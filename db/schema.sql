CREATE TABLE covid19
(
    id       SERIAL PRIMARY KEY,
    date_    date NOT NULL,
    infected bigint NOT NULL,
    cured    bigint NOT NULL,
    deaths   bigint NOT NULL,
    tested   bigint NOT NULL
);

CREATE TABLE deaths
(
    id        SERIAL PRIMARY KEY,
    date_from date NOT NULL,
    date_to   date NOT NULL,
    week      integer NOT NULL,
    deaths    bigint NOT NULL
);

CREATE USER upa_api WITH ENCRYPTED PASSWORD 'upa_api_pwd';

GRANT SELECT ON covid19 TO upa_api;
GRANT SELECT ON deaths TO upa_api;

CREATE USER upa_importer WITH ENCRYPTED PASSWORD 'upa_importer_pwd';

GRANT ALL ON covid19 TO upa_importer;
GRANT ALL ON deaths TO upa_importer;
