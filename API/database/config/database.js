const dotenv = require('dotenv');
dotenv.config(
  {
    path: '../.env'
  }
);


module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  production: {
    username: null,
    password: null,
    database: null,
    host: null,
    dialect: null
  }
}