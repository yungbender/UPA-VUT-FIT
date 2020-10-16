import os

from pymongo import MongoClient

MONGO_HOST = os.getenv("NOSQL_HOST", "localhost")
MONGO_NAME = os.getenv("NOSQL_DBNAME", "upa-covid19")


def mongo_connect(host=MONGO_HOST, name=MONGO_NAME, port=27017, connect=None):
    client = MongoClient(host=host, port=port, connect=connect)
    db = client[name]
    return client, db
