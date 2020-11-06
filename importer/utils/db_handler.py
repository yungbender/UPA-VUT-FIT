import os

import asyncpg

DBNAME = os.getenv("SQL_DBNAME", "upa-covid19")
DBHOST = os.getenv("SQL_HOST", "upa-postgres")
DBUSER = os.getenv("SQL_USERNAME", "upa_importer")
DBPWD  = os.getenv("SQL_PASSWORD", "upa_importer_pwd")
DBPORT = int(os.getenv("SQL_PORT", "5432"))

MIN_CONN = int(os.getenv("SQL_MIN_POOL", "2"))
MAX_CONN = int(os.getenv("SQL_MAX_POOL", "4"))


class SqlHandlerExc(Exception):
    pass

class SqlHandler:
    __instance = None

    def __init__(self):
        raise SqlHandlerExc("This is singleton, call get function.")

    @staticmethod
    async def get(dbname=DBNAME, host=DBHOST, port=DBPORT, user=DBUSER, pwd=DBPWD):
        if SqlHandler.__instance != None:
            SqlHandler.__instance = await asyncpg.create_pool(min_size=MIN_CONN, max_size=MAX_CONN,
                                                             user=user, port=port, host=host, 
                                                             database=dbname, password=pwd)
        return SqlHandler.__instance

    @staticmethod
    async def reconnect(**kwargs):
        if SqlHandler.__instance != None:
            SqlHandler.__instance.close()
            SqlHandler.__instance = None
        return await SqlHandler.reconnect(**kwargs)

    @staticmethod
    async def close():
        if SqlHandler.__instance != None:
            SqlHandler.__instance.close()
