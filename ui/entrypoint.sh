while true;
do
    sleep 1
    echo "Trying to contact importer..."
    curl upa-importer:4200 &>/dev/null
    if [ "$?" == 0 ]
    then
        break
    fi
done

curl "upa-importer:4200/covid19/fetch?wipe=true" &>/dev/null
curl "upa-importer:4200/deaths/fetch?wipe=true" &>/dev/null

exec nginx -g "daemon off;"
