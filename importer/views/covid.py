import asyncio
from aiohttp import web
from aiohttp.web import Request

from importers.covid import CovidImporter

IMPORTER = CovidImporter()


async def covid_view(request: Request):
    if IMPORTER.in_progress is not False:
        return web.json_response({"response": "Covid statistics fetch already in progress."}, status=429)

    wipe = request.query.get("wipe", False)

    asyncio.create_task(IMPORTER.import_stats(wipe))
    return web.json_response({"response": "Starting covid stats fetch."})
