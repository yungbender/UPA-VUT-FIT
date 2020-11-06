db.createUser(
    {
        user: "upa-importer",
        pwd: "upa_importer_pwd",
        roles: [
            {
                role: "readWrite",
                db: "upa-covid19"
            }
        ]
    }
);

db.createUser(
    {
        user: "upa-api",
        pwd: "upa_api_pwd",
        roles: [
            {
                role: "readWrite",
                db: "upa-covid19"
            }
        ]
    }
);

db.createCollection("covid-19");
db.createCollection("deaths");
