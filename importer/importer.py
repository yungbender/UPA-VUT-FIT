from time import sleep
from mongo_handler import mongo_connect

if __name__ == "__main__":
    while True:
        handler, db = mongo_connect(connect=True)
        print(handler)
        sleep(10)
