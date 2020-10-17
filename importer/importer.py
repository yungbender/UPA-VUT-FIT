from aiohttp import web
import asyncio
import logging

from middlewares import headers_setup
from views.main import main_view
from views.covid import covid_view
from views.deaths import deaths_view


async def setup_app():
    app = web.Application(middlewares=[headers_setup])
    logging.basicConfig(level=logging.INFO)
    app.router.add_get("/covid19/fetch", covid_view)
    app.router.add_get("/deaths/fetch", deaths_view)
    app.router.add_get("/", main_view)

    return app

def main():
    web.run_app(setup_app(), host="0.0.0.0", port="4200")

if __name__ == "__main__":
    main()
