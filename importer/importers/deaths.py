import asyncio
import logging
import aiohttp
import json
from csv import DictReader
from bs4 import BeautifulSoup

from mongo_handler import MongoDb
from importers.base import BaseImporter
from pymongo import InsertOne

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

    async def _import(self, wipe, mongo_conn):
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
            operation = InsertOne

            old_doc = db.deaths.find_one({"_id": record["idhod"]})
            if old_doc:
                continue

            record["_id"] = record["idhod"]
            del record["idhod"]

            new_docs.append(operation(record))

        LOGGER.info("Doing %d operations" % len(new_docs))

        if new_docs:
            db.deaths.bulk_write(new_docs)

    async def import_stats(self, wipe):
        if self._in_progress.locked():
            LOGGER.warning("Sync of deaths already in progress")
            return

        LOGGER.info("Starting syncing deaths info to mongodb")
        async with self._in_progress:
            with MongoDb() as mongo_conn:
                await self._import(wipe, mongo_conn)

        LOGGER.info("Finished syncing deaths info to mongodb") 