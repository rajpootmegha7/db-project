DROP DATABASE IF EXISTS liquorstore;
CREATE DATABASE liquorstore;

DROP USER IF EXISTS johndoe;
CREATE USER johndoe WITH PASSWORD 'johndoe';

GRANT ALL PRIVILEGES ON DATABASE liquorstore TO johndoe;
ALTER USER johndoe SET search_path = projectdb;
ALTER USER johndoe WITH SUPERUSER; 