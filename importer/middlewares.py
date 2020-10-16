from aiohttp.web import middleware
from json import dumps


@middleware
async def headers_setup(request, handler):
    resp = await handler(request)
    resp.content_type = "application/json"
    return resp
