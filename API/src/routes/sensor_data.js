const express = require("express")
const client = require("../middlewares/db_connector")
const generate_token = require("../functions/tokengen")
const { DataRowMessage } = require("pg-protocol/dist/messages")


const sensor_data = express.Router()

sensor_data.post("/sendData", (req, res) => {

    const { sensorApiKey } = req.query
    const data = req.body

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT id FROM sensores WHERE sensorApiKey = $1;`, [sensorApiKey], (err, result) => {
            if (err) {
                res.status(400).send(err.message);
            }
            console.log(result.rows)
            for (let i = 0; i < data.length; i++) {
                client.query(`INSERT INTO datos(sensorId, dataValue, dataValue2, dataDate) VALUES ($1, $2, $3, $4);`, [result.rows[0].id, data[i].Data1, data[i].Data2, data[i].date], (err, result) => {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                })
            }
            res.status(200).send("Data inserted");
        })

    })
})

sensor_data.get("/getData", (req, res) => {
    const { sensorApiKey, date1, date2 } = req.query

    client.connect((err, client, done) => {
        if (err) {
            res.status(400).send("Client connection error");
        }
        client.query(`SELECT id FROM sensores where sensorApiKey = $1;`, [sensorApiKey], (err, result) => {
            if (err) {
                res.status(400).send(err.message);
            }
            client.query(`SELECT * FROM datos WHERE sensorId = $1;`, [result.rows[0].id], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);
                }
                if (result.rows.length > 0) {
                    const data = []
                    for (let i = 0; i < result.rows.length; i++) {
                        if (Date.parse(result.rows[i].datadate) >= Date.parse(date1) && Date.parse(result.rows[i].datadate) <= Date.parse(date2)) {
                            data.push(result.rows[i]);
                        }
                    }
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send("No data found");
                }
            })
        })
    })


})

sensor_data.get("/getSensorData", (req, res) => {
    client.connect((err, client, done) => {
        if (err) {
            res.status(400).send("Client connection error");
        }
        client.query(`SELECT * FROM datos;`, (err, result) => {
            if (err) {
                res.status(400).send(err.message);
            }
            res.status(200).send(result.rows);
        })
    })
})

module.exports = sensor_data
