const mysql = require("mysql2");
const express = require("express");
const fetch = require("node-fetch");
const Joi = require("joi");

const app = express();
app.use(express.json());

const validationEnabled = process.argv.includes(":dataValOn") ? 1 : 0;

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "passwd",
  database: "express_sql_api_v2",
});

conn.connect();

/* ------- */
/* get all */
/* ------- */

app.get(`/api/:table`, (req, res) => {
  const { table } = req.params;

  conn.query(`SELECT * FROM ${table}`, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

/* ----------- */
/* get with id */
/* ----------- */

app.get(`/api/:table/:id`, (req, res) => {
  const { id, table } = req.params;

  conn.query(
    `SELECT * FROM ${table} WHERE id_${table} = ${id}`,
    (error, results, fields) => {
      if (error) throw error;

      const eRes = evalResult(results, id, table);
      if (eRes) return res.status(404).send(eRes);

      res.send(results);
    }
  );
});

/* ---- */
/* post */
/* ---- */

app.post(`/api/:table`, (req, res) => {
  const { table } = req.params;
  const body = req.body;

  if (validationEnabled) {
    const eBod = evalBody(body, table);
    if (eBod) return res.status(400).send(eBod);
  }

  const finalString = Object.keys(body)
    .reduce((res, key) => {
      if (typeof body[key] === "string") return `${res}"${body[key]}", `;
      return `${res}${body[key]}, `;
    }, "")
    .slice(0, -2);

  conn.query(
    `INSERT INTO ${table} VALUES (null, ${finalString})`,
    (error, results, fields) => {
      if (error) throw error;

      conn.query(
        `SELECT * FROM ${table} WHERE id_${table} = ${results.insertId}`,
        (error, results, fields) => {
          if (error) throw error;

          const eRes = evalResult(results, results.insertId, table);
          if (eRes) return res.status(404).send(eRes);

          res.send(results);
        }
      );
    }
  );
});

/* --- */
/* put */
/* --- */

app.put(`/api/:table/:id`, (req, res) => {
  const { id, table } = req.params;
  const body = req.body;

  conn.query(
    `SELECT * FROM ${table} WHERE id_${table} = ${id}`,
    (error, results, fields) => {
      if (error) throw error;

      const eRes = evalResult(results, id, table);
      if (eRes) return res.status(404).send(eRes);
    }
  );

  if (validationEnabled) {
    const eBod = evalBody(body, table);
    if (eBod) return res.status(400).send(eBod);
  }

  const finalString = Object.keys(body)
    .reduce((res, key) => {
      if (typeof body[key] === "string")
        return `${res}${key} = "${body[key]}", `;
      return `${res}${key} = ${body[key]}, `;
    }, "")
    .slice(0, -2);

  conn.query(
    `UPDATE ${table} SET ${finalString} WHERE id_${table} = ${id}`,
    (error, results, fields) => {
      if (error) throw error;

      fetch(`http://${req.headers.host}/api/${table}/${id}`)
        .then((resp) => resp.json())
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err));
    }
  );
});

/* ------ */
/* delete */
/* ------ */

app.delete(`/api/:table/:id`, (req, res) => {
  const id = req.params.id;
  const table = req.params.table;
  let selectResult;

  conn.query(
    `SELECT * FROM ${table} WHERE id = ${id}`,
    (error, results, fields) => {
      if (error) throw error;

      selectResult = results;

      const eRes = evalResult(results, id);
      if (eRes) return res.status(404).send(eRes);
    }
  );

  conn.query(
    `DELETE FROM ${table} WHERE id = ${id}`,
    (error, results, fields) => {
      if (error) throw error;

      res.send(selectResult);
    }
  );
});

/* --------- */
/* functions */
/* --------- */

function evalResult(results, id, table) {
  if (!results.length)
    return `<h1>404</h1><p>Row with ID: <b>${id}</b> doesn't exist in table: <b>${table}</b>`;
}

function evalBody(body, table) {
  let error;

  switch (table) {
    case "item_types": {
      const schema = Joi.object({
        type_name: Joi.string().required().min(3),
      });

      ({ error } = schema.validate(body));
      break;
    }
    case "items": {
      const schema = Joi.object({
        title: Joi.string().required().min(3),
        description: Joi.string().required().min(3),
        id_item_types: Joi.integer().required(),
      });

      ({ error } = schema.validate(body));
      break;
    }
    case "imgs": {
      const schema = Joi.object({
        img: Joi.string().required().min(3),
        id_items: Joi.integer().required(),
      });

      ({ error } = schema.validate(body));
      break;
    }
  }

  return (
    error &&
    `<h1>400</h1><p>Invalid atribute entry: <b>${error.details[0].message}</b></p>`
  );
}

/* ----- */
/* serve */
/* ----- */

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
