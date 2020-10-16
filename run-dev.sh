#!/bin/bash

docker-compose -f docker-compose.yml -f devel-compose.yml "$@"
