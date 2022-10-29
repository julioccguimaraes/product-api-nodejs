// ENV variables
require('dotenv').config()

const Logger = require("./logger")

const dbHost = process.env.DB_HOST
const dbDatabase = process.env.DB_DATABASE
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase
  }
});

knex.raw("SELECT 1").then(() => {
  Logger.info("Database connected")
})
  .catch((e) => {
    Logger.error("Database not connected");
    Logger.error(e);
  });

module.exports = knex