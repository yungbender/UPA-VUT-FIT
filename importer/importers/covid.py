import asyncio
import logging
import aiohttp
import json
from dateutil.parser import parse
from datetime import timedelta

from utils.mongo_handler import MongoDb
from utils.db_handler import SqlHandler
from importers.base import BaseImporter
from pymongo import ReplaceOne, InsertOne

INFECTED_INDEX = "kumulativni_pocet_nakazenych"
CURED_INDEX = "kumulativni_pocet_vylecenych"
DEATHS_INDEX = "kumulativni_pocet_umrti"
TESTED_INDEX = "kumulativni_pocet_testu"
TIMESTAMP_INDEX = "file_timestamp"

LOGGER = logging.getLogger(__name__)
URL = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.json"


class CovidImporter(BaseImporter):
    def __init__(self):
        super().__init__()

    async def _import_mongo(self, wipe, mongo_conn: MongoDb):
        async with self.session.get(URL) as doc:
            doc = await doc.text()        

        doc = json.loads(doc)

        db = mongo_conn.get_db()

        if wipe:
            db.covid19.remove({})

        timestamp = doc["modified"]
        new_docs = []

        for record in doc["data"]:
            record["file_timestamp"] = timestamp
            record["_id"] = record["datum"]

            operation = InsertOne(record)

            old_doc = db.covid19.find_one({"_id": record["datum"]})
            if old_doc:
                if old_doc["file_timestamp"] != timestamp:
                    operation = ReplaceOne(old_doc, record)
                else:
                    continue

            del record["datum"]

            new_docs.append(operation)

        LOGGER.info("Importing batch of %d data to mongodb" % (len(new_docs)))

        if new_docs:
            db.covid19.bulk_write(new_docs)

    async def _postgres_insert(self, sql_conn, data):
        LOGGER.info("Importing batch of %d covid data to postgres" % (len(data)))
        await sql_conn.executemany("""INSERT INTO covid19 (date_, infected, cured, deaths, tested, ts) VALUES
                                      ($1, $2, $3, $4, $5, $6)
                                      ON CONFLICT (date_) DO UPDATE
                                      SET infected = EXCLUDED.infected,
                                          cured = EXCLUDED.cured,
                                          deaths = EXCLUDED.deaths,
                                          tested = EXCLUDED.tested,
                                          ts = EXCLUDED.ts
                                      WHERE covid19.ts <> EXCLUDED.ts
                                   """, data)

    async def _import_postgres(self, wipe, mongo_conn, sql_conn):
        mongo_db = mongo_conn.get_db()

        if wipe:
            await sql_conn.execute("""TRUNCATE TABLE covid19""")

        record_batch = []
        batch_cnt = 0
        for record in mongo_db.covid19.find():
            # Date represents our key in mongodb
            date = parse(record["_id"])

            # There are cumulative counts in json, substract it
            # Go back by one day
            yesterday = date - timedelta(days=1)

            # Find the record of covid from previous day
            yesterday_record = mongo_db.covid19.find_one({"_id": str(yesterday.date())})
            # If there is one yesterday record, substract cummulative from today and yesterday
            if yesterday_record:
                infected = record[INFECTED_INDEX] - yesterday_record[INFECTED_INDEX]
                cured = record[CURED_INDEX] - yesterday_record[CURED_INDEX]
                deaths = record[DEATHS_INDEX] - yesterday_record[DEATHS_INDEX]
                tested = record[TESTED_INDEX] - yesterday_record[TESTED_INDEX]
            # Else, there is not, take the the cummulative as "first" class data
            else:
                infected = record[INFECTED_INDEX]
                cured = record[CURED_INDEX]
                deaths = record[DEATHS_INDEX]
                tested = record[TESTED_INDEX]
            timestamp = parse(record[TIMESTAMP_INDEX]).replace(tzinfo=None)

            record_batch.append((date.date(), infected, cured, deaths, tested, timestamp))

        # There can be some last 
        if record_batch:
            await self._postgres_insert(sql_conn, record_batch)

    async def import_stats(self, wipe, sql, nosql):
        if self._in_progress.locked():
            LOGGER.warning("Sync of covid19 already in progress")
            return

        async with self._in_progress:
            with MongoDb() as mongo_conn:
                if nosql:
                    LOGGER.info("Starting syncing covid19 info to mongodb")
                    await self._import_mongo(wipe, mongo_conn)
                    LOGGER.info("Finished syncing covid19 info to mongodb")
                if sql:
                    LOGGER.info("Starting syncing covid19 info to postgres")
                    sql_pool = await SqlHandler.get()
                    async with sql_pool.acquire() as sql_conn:
                        await self._import_postgres(wipe, mongo_conn, sql_conn)
                    LOGGER.info("Finished syncing covid19 info to postgres")
