#!/bin/bash

while true;
do
    sleep 1
    echo "Trying to contact postgres..."
    pg_isready -h upa-postgres -U $SQL_USERNAME -d $SQL_DBNAME &>/dev/null
    if [ "$?" == 0 ]
    then
        break
    fi
done;

exec api
