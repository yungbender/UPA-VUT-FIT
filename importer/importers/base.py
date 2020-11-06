import aiohttp
import asyncio

class ImporterExc(Exception):
    pass

class BaseImporter:
    session = aiohttp.ClientSession()

    def __init__(self):
        self._in_progress = asyncio.Lock()

    async def _import_mongo(self):
        raise NotImplemented()

    async def _import_postgres(self):
        raise NotImplemented()

    async def import_stats(self):
        raise NotImplemented()

    @property
    def in_progress(self):
        return self._in_progress.locked()
