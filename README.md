# Starting project
```
docker-compose up --build
```
This will rebuild the files and containers, which takes too long. Use
this only when you want to test the whole app and dont want to change source code. The apps and parts will start by itself.

The problem is that when you change the source code, you need to rebuild it which takes too long.

# Developing
For developing there is a script called ```run-dev.sh``` which merges the two docker compose files (devel and docker-compose). The script just passes the other arguments to docker-compose app.

So you can start your instance for developing.
```
./run-dev.sh up
```

This will start containers, psql and mongo, and other containers will remain to sleep infinity. Api and importer will remain sleep infinity and have the source code live mounted into the container so you dont need to rebuild it every time when you change the code, like in first example.

Now you need to get into the shell of the two containers
```
docker exec -it upa-api bash
```
```
docker exec -it upa-importer bash
```

Now in two terminals you are in the shell of the containers, you can start the python and golang app.
```
bash entrypoint.sh
```
```
go run upa/api
```

Now you can change the source code and just restart the apps (not rebuilding the containers).
