# Node.js, Express, MySQL RESTful API

Simple restful API. Uses the "mysql2" package for database connection and "joi" for data validation.

Should (technically) be useable with any database (as long as data validation is disabled, more below).

Initialize with `node i` and run with `node .`.

## Included

- `index.js` - base code for the API,
- `db+table+insert.sql` - example database with table creation and data insertion.

## Usage

Below are the main points to take in for the proper usage of the API. If any of the three conditions are not met, the API may not work as expected.

- The API expects tables to have their respectable primary keys set automatically (via AUTO_INCREMENT or something similar). This can of course be changed as you wish.
- The API expects the column name for the primary key column of each table to be in the format of `id_table_name` (eg. table "items" has primary key `id_items`). The same goes for foreign keys.
- For POST and PUT, the API expects the keys of the properties within the HTTP body to **_EXACTLY MATCH_** the name of the columns within the tables.

## Personalization

### Database

To setup the API for your own use with a different server, database, etc., simply edit the `conn` constant with the `index.js` file.

### Data validation

By default, data validation related code is disabled so it is useable with any database. To enable data validation, simply run with `node . :dataValOn`.

**_Data validation is not auto-generated and has to be set manually!_**

Joi is included to handle data validation, however anything else can also be used. To setup your personal data validation simply edit the `switch` statement within the `evalBody` function. The `case` statement represents the table and `const schema` is used to define valid data.
