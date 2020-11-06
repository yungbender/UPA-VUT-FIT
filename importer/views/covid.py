import asyncio
from aiohttp import web
from aiohttp.web import Request

from importers.covid import CovidImporter

IMPORTER = CovidImporter()


async def covid_view(request: Request):
    if IMPORTER.in_progress is not False:
        return web.json_response({"response": "Covid statistics fetch already in progress."}, status=429)

    try:
        wipe = bool(request.query.get("wipe", False))
        sql = bool(request.query.get("sql", False))
        nosql = bool(request.query.get("nosql", False))

        # Default setting if nothing is set
        if nosql is False and sql is False:
            nosql = True
            sql = True
    except ValueError:
        return web.json_response({"response": "Invalid parameters"}, status=400)

    asyncio.create_task(IMPORTER.import_stats(wipe, sql, nosql))
    return web.json_response({"response": "Starting covid stats fetch."})
