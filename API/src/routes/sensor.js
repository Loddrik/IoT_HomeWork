const express = require("express")
const client = require("../middlewares/db_connector")
const generate_token = require("../functions/tokengen")

const sensor = express.Router();

sensor.post("/createSensor/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id, locationId, sensorName, sensorCategory, sensorMeta } = req.body;


    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT ubicaciones.id FROM usuarios, companias, ubicaciones WHERE (companias.companyApiKey = $1 and usuarios.token = $2 and ubicaciones.companyId = companias.id);`, [companyApiKey, token,], (err, result) => {
            if (err) {
                res.send(err);
            }
            console.log(result.rows)

            var ids = [];
            for (var i = 0; i < result.rows.length; i++) {
                ids.push(result.rows[i].id);
            }

            if (ids.includes(parseInt(locationId))) {
                const tok = generate_token(10);
                client.query(`INSERT INTO sensores(id, locationId, sensorName, sensorCategory, sensorMeta, sensorApiKey) VALUES ($1, $2, $3, $4, $5, $6)`, [id, locationId, sensorName, sensorCategory, sensorMeta, tok], (err, result) => {
                    done();
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send({
                            message: "Sensor creado",
                            data: {
                                id: id,
                                locationId: locationId,
                                sensorName: sensorName,
                                sensorCategory: sensorCategory,
                                sensorMeta: sensorMeta,
                                sensorApiKey: tok
                            },
                            response: result,
                        });
                    }
                });

            } else {
                res.send({
                    message: "Ubicacion no valida",
                    data: {
                        locationId: locationId,
                    }
                });
            }
        });
    });
});

sensor.get("/getSensors/", (req, res) => {
    const { token, companyApiKey } = req.query;
    console.log(token, companyApiKey)
    client.connect((err, client, done) => {
        if (err) {
            res.send("Query error");
        }
        client.query(`select sensores.id, sensores.sensorName, sensores.locationId, sensores.sensorCategory,
         sensores.sensorMeta, sensores.sensorApiKey  from usuarios,companias,ubicaciones,sensores where
         (companias.companyapikey = $1 and usuarios.token = $2 and companias.id = ubicaciones.companyId
          and sensores.locationId = ubicaciones.id);`, [companyApiKey, token,], (err, result) => {
            if (err) {
                res.send(err.message);
            } else {
                res.send(result.rows);
            }

        });
    });
});



sensor.put("/updateSensor/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id, name, value } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Query error");
        }
        client.query(`select sensores.id from usuarios,companias,ubicaciones,sensores where
        (companias.companyapikey = $1 and usuarios.token = $2 and companias.id = ubicaciones.companyId
         and sensores.locationId = ubicaciones.id);`, [companyApiKey, token,], (err, result) => {
            if (err) {
                res.send("Query error");
            }
            var ids = [];
            for (var i = 0; i < result.rows.length; i++) {
                ids.push(result.rows[i].id);
            }

            if (ids.includes(parseInt(id))) {
                client.query(`UPDATE sensores SET ${name} = $1 WHERE id = $2`, [value, id], (err, result) => {
                    done();
                    if (err) {
                        res.send("Query error");
                    } else {
                        res.send({
                            message: "Sensor actualizado",
                            data: {
                                id: id,
                                name: name,
                                value: value
                            },
                            response: result
                        });
                    }
                });
            } else {
                res.send("Invalid id");
            }
        });
    });
});

sensor.delete("/deleteSensor/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Query error");
        }
        client.query(`select sensores.id from usuarios,companias,ubicaciones,sensores where
        (companias.companyapikey = $1 and usuarios.token = $2 and companias.id = ubicaciones.companyId
         and sensores.locationId = ubicaciones.id);`, [companyApiKey, token,], (err, result) => {
            if (err) {
                res.send("Query error");
            }
            var ids = [];
            for (var i = 0; i < result.rows.length; i++) {
                ids.push(result.rows[i].id);
            }

            if (ids.includes(parseInt(id))) {
                client.query(`DELETE FROM sensores WHERE id = $1`, [id], (err, result) => {
                    done();
                    if (err) {
                        res.send("Query error");
                    } else {
                        res.send({
                            message: "Sensor eliminado",
                            data: {
                                id: id
                            },
                            response: result
                        });
                    }
                });
            } else {
                res.send("Invalid token");
            }
        });
    });
});





module.exports = sensor;