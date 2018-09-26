DROP DATABASE IF EXISTS postgres;
CREATE DATABASE postgres;

CREATE TABLE agencies (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  grade VARCHAR,
  tags INTEGER
);

CREATE TABLE tags (
  ID SERIAL PRIMARY KEY,
  tagname VARCHAR
);

CREATE TABLE association (
  ID SERIAL PRIMARY KEY,
  tagid INTEGER,
  agencyid INTEGER
);
