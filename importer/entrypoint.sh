#!/bin/bash

exec gunicorn importer:setup_app --bind 0.0.0.0:4200 --worker-class aiohttp.GunicornWebWorker --workers 1
