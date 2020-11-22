CREATE TABLE covid19
(
    id       SERIAL PRIMARY KEY,
    date_    date UNIQUE NOT NULL,
    infected numeric NOT NULL,
    cured    numeric NOT NULL,
    deaths   numeric NOT NULL,
    tested   numeric NOT NULL,
    ts       timestamp NOT NULL
);

CREATE TABLE deaths
(
    id        SERIAL PRIMARY KEY,
    date_from date NOT NULL,
    date_to   date NOT NULL,
    week      integer NOT NULL,
    deaths    numeric NOT NULL,
    age_from  float NOT NULL,
    age_to    float NOT NULL,
    CONSTRAINT unique_deaths UNIQUE(date_from, date_to, age_from, age_to)
);

CREATE USER upa_api WITH ENCRYPTED PASSWORD 'upa_api_pwd';

GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO upa_api;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO upa_api;

CREATE USER upa_importer WITH ENCRYPTED PASSWORD 'upa_importer_pwd';

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO upa_importer;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO upa_importer;
