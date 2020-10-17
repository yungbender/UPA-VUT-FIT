import asyncio
import logging
import aiohttp
import json

from mongo_handler import MongoDb
from importers.base import BaseImporter
from pymongo import UpdateOne, InsertOne

LOGGER = logging.getLogger(__name__)
URL = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.json"


class CovidImporter(BaseImporter):
    def __init__(self):
        super().__init__()

    async def _import(self, wipe, mongo_conn: MongoDb):
        async with self.session.get(URL) as doc:
            doc = await doc.text()        

        doc = json.loads(doc)

        db = mongo_conn.get_db()

        if wipe:
            db.covid19.remove({})

        timestamp = doc["modified"]
        new_docs = []

        for record in doc["data"]:
            operation = InsertOne

            old_doc = db.covid19.find_one({"_id": record["datum"]})
            if old_doc:
                if old_doc["file_timestamp"] != timestamp:
                    operation = UpdateOne
                else:
                    continue

            record["file_timestamp"] = timestamp
            record["_id"] = record["datum"]
            del record["datum"]

            new_docs.append(operation(record))

        LOGGER.info("Doing %d operations" % (len(new_docs)))

        if new_docs:
            db.covid19.bulk_write(new_docs)

    async def import_stats(self, wipe):
        if self._in_progress.locked():
            LOGGER.warning("Sync of covid19 already in progress")
            return

        LOGGER.info("Starting syncing covid19 info to mongodb")
        async with self._in_progress:
            with MongoDb() as mongo_conn:
                await self._import(wipe, mongo_conn)

        LOGGER.info("Finished syncing covid19 info to mongodb")
