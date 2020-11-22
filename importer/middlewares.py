from aiohttp.web import middleware
from json import dumps


@middleware
async def headers_setup(request, handler):
    resp = await handler(request)
    resp.headers["Content-Type"] = "application/json"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp
