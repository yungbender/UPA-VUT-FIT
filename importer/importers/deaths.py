import asyncio
import logging
import aiohttp
import json
from csv import DictReader
from bs4 import BeautifulSoup

from pymongo import InsertOne, ReplaceOne
from dateutil.parser import parse

from utils.mongo_handler import MongoDb
from utils.db_handler import SqlHandler
from importers.base import BaseImporter

DEATHS_INDEX = "hodnota"
DATE_FROM_INDEX = "casref_od"
DATE_TO_INDEX = "casref_do"
WEEK_INDEX = "tyden"
AGE_INDEX = "vek_txt"

LOGGER = logging.getLogger(__name__)
URL = "https://www.czso.cz/csu/czso/zemreli-podle-tydnu-a-vekovych-skupin-v-ceske-republice"


class DeathsImporter(BaseImporter):
    def __init__(self):
        super().__init__()

    async def _parse_csv_link(self, html):
        # PEPEGAS
        soup = BeautifulSoup(html, features="html.parser")
        csv_div = soup.find("div", {"class": "priloha-vychozi priloha-csv"})
        if not csv_div:
            return None

        return csv_div.parent["href"]

    async def _import_mongo(self, wipe, mongo_conn):
        async with self.session.get(URL) as doc:
            doc = await doc.text()

        csv_url = await self._parse_csv_link(doc)
        if not csv_url:
            raise ImporterExc("Cannot scrape CSV file url")

        async with self.session.get(csv_url) as doc:
            doc = await doc.text()

        db = mongo_conn.get_db()

        if wipe:
            db.deaths.remove({})

        csv_dict = DictReader(doc.splitlines())
        new_docs = []

        for record in csv_dict:
            record["_id"] = record["idhod"]
            operation = InsertOne(record)

            old_doc = db.deaths.find_one({"_id": record["idhod"]})
            del record["idhod"]
            if old_doc:
                operation = ReplaceOne(old_doc, record)

            new_docs.append(operation)

        LOGGER.info("Doing %d operations" % len(new_docs))

        if new_docs:
            db.deaths.bulk_write(new_docs)

    async def _postgres_insert(self, sql_conn, data):
        LOGGER.info("Importing batch of %d deaths data to postgres" % len(data))
        await sql_conn.executemany("""INSERT INTO deaths (date_from, date_to, week, deaths, age_from, age_to) VALUES
                                      ($1, $2, $3, $4, $5, $6)
                                      ON CONFLICT (date_from, date_to, age_from, age_to) DO UPDATE
                                      SET date_from = EXCLUDED.date_from,
                                          date_to = EXCLUDED.date_to,
                                          week = EXCLUDED.week,
                                          deaths = EXCLUDED.deaths,
                                          age_from = EXCLUDED.age_from,
                                          age_to = EXCLUDED.age_to
                                   """, data)

    async def _import_postgres(self, wipe, mongo_conn, sql_conn):
        mongo_db = mongo_conn.get_db()

        if wipe:
            await sql_conn.execute("""TRUNCATE TABLE deaths""")

        record_batch = []
        batch_cnt = 0
        for record in mongo_db.deaths.find():
            if record[AGE_INDEX] == "celkem":
                continue

            date_from = parse(record[DATE_FROM_INDEX])
            date_to = parse(record[DATE_TO_INDEX])
            week = int(record[WEEK_INDEX])
            deaths = int(record[DEATHS_INDEX])
            # Age records are in format <age>-<age> or <age>-a vice :)):):):)):):))
            try:
                age_from, age_to = [int(age) for age in record[AGE_INDEX].split("-")]
            except ValueError:
                age_from = int(record[AGE_INDEX].split(" ")[0])
                age_to = float("inf")
            record_batch.append((date_from, date_to, week, deaths, age_from, age_to))

        if record_batch:
            await self._postgres_insert(sql_conn, record_batch)

    async def import_stats(self, wipe, sql, nosql):
        if self._in_progress.locked():
            LOGGER.warning("Sync of deaths already in progress")
            return

        async with self._in_progress:
            with MongoDb() as mongo_conn:
                if nosql:
                    LOGGER.info("Starting syncing deaths info to mongodb")
                    await self._import_mongo(wipe, mongo_conn)
                    LOGGER.info("Finished syncing deaths info to mongodb") 
                if sql:
                    LOGGER.info("Starting syncing deaths info to postgres")
                    sql_pool = await SqlHandler.get()
                    async with sql_pool.acquire() as sql_conn:
                        await self._import_postgres(wipe, mongo_conn, sql_conn)
                    LOGGER.info("Finished syncing deaths info to postgres")
