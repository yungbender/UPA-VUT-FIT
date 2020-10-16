from aiohttp import web
import asyncio

from mongo_handler import mongo_connect
from middlewares import headers_setup
from views.main import main_view
from views.covid import covid_view


async def setup_app():
    app = web.Application(middlewares=[headers_setup])
    app.router.add_get("/covid19/fetch", covid_view)
    #app.router.add_get("/deaths/fetch")
    app.router.add_get("/", main_view)

    return app

def main():
    web.run_app(setup_app(), host="0.0.0.0", port="4200")

if __name__ == "__main__":
    main()
