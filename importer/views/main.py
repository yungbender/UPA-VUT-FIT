from aiohttp import web
from aiohttp.web import json_response, Request


async def main_view(request: Request):
    """
    Main route view.
    """
    help_str = """
    Use HTTP GET on:
    /covid19/fetch - To fetch covid 19 statistics into mongo db.
    User parameter wipe=true if you want to wipe the whole mongo
    db and redownload it again. Without the wipe fetch will just
    update the mongo db records.

    /deaths/fetch - Same as as previous route, but fetches overall
    deaths into mongo db. Also usage of wipe=true parameter is possible.

    / - Route shows this help message.
    """

    return json_response({"response": help_str})
