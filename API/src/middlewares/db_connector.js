const Pool = require('pg').Pool

require('dotenv').config()

console.log(process.env.DEV_PORT)
console.log(process.env.POSTGRES_DB)

const client = new Pool({
    user: process.env.POSTGRES_USER,
    host: "postgres",
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
}, (err, client) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected to DB")
    }
})


module.exports = client;
