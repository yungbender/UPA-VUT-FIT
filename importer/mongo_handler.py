import os

from pymongo import MongoClient

MONGO_HOST = os.getenv("NOSQL_HOST", "localhost")
MONGO_NAME = os.getenv("NOSQL_DBNAME", "upa-covid19")


class MongoDb(MongoClient):

    def __init__(self, host=MONGO_HOST, port=27017, connect=None):
        super().__init__(host=host, port=port, connect=connect)

    def get_db(self, name=MONGO_NAME):
        return self.get_database(name)
