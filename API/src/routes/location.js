const express = require("express")
const client = require("../middlewares/db_connector")

const location = express.Router();

location.post("/createLocation/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id, locationName, locationCountry, locationCity, locationMeta } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT companias.id, usuarios.token FROM usuarios, companias WHERE (companias.companyApiKey = $1 and usuarios.token = $2);`, [companyApiKey, token], (err, result) => {
            if (err) {
                res.send(err.message);
            }
            console.log(result)

            if (result.rows.length > 0) {
                const companyId = result.rows[0].id;

                client.query("INSERT INTO ubicaciones(id, companyId,locationName, locationCountry, locationCity, locationMeta) VALUES ($1, $2, $3, $4, $5, $6)", [id, companyId, locationName, locationCountry, locationCity, locationMeta], (err, result) => {
                    done();
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send({
                            message: "Ubicacion creada",
                            data: {
                                id: id,
                                companyId: companyId,
                                locationName: locationName,
                                locationCountry: locationCountry,
                                locationCity: locationCity,
                                locationMeta: locationMeta
                            }
                        });
                    }
                });
            } else {
                res.send("companyApikey invalida");
            }
        })
    })
});

location.get("/getLocations/", (req, res) => {
    const { token, companyApiKey } = req.query;
    client.connect((err, client, done) => {
        if (err) {
            res.send("err.message");
        }
        client.query(`SELECT companias.id, usuarios.token FROM usuarios, companias WHERE (companias.companyApiKey = $1 and usuarios.token = $2);`, [companyApiKey, token], (err, result) => {
            if (err) {
                res.send(err.message);
            }
            console.log(result)
            if (result.rows.length > 0) {
                client.query("SELECT * FROM ubicaciones where companyId = $1;", [result.rows[0].id], (err, result) => {
                    done();
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send(result.rows);
                    }
                });
            } else {
                res.send("Invalid tokens");
            }
        });
    });
});

location.put("/updateLocation/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id, name, value } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT companias.id, usuarios.token FROM usuarios, companias WHERE (companias.companyApiKey = $1 and usuarios.token = $2);`, [companyApiKey, token], (err, result) => {
            if (err) {
                res.send(err.message);
            }
            if (result.rows.length > 0) {
                const companyId = result.rows[0].id;
                console.log(value, id, companyId);
                client.query(`UPDATE ubicaciones SET ${name} = $1 WHERE (id = $2 and companyId = $3) ;`, [value, id, companyId], (err, result) => {
                    done();
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send({
                            message: "Ubicacion actualizada",
                            data: {
                                id: id,
                                companyId: companyId,
                                fieldName: name,
                                updatedValue: value,
                            }
                        });
                    }
                });
            } else {
                res.send("Invalid tokens");
            }
        });
    });
});

location.delete("/deleteLocation/", (req, res) => {
    const { token, companyApiKey } = req.query;
    const { id } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT companias.id, usuarios.token FROM usuarios, companias WHERE (companias.companyApiKey = $1 and usuarios.token = $2);`, [companyApiKey, token], (err, result) => {
            if (err) {
                res.send(err.message);
            }
            const companyId = result.rows[0].id;
            if (result.rows.length > 0) {
                client.query(`DELETE FROM ubicaciones WHERE (id = $1 and companyId = $2)`, [id, companyId], (err, result) => {
                    done();
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send({
                            message: "Ubicacion eliminada",
                            data: {
                                id: id,
                                companyId: companyId,

                            }
                        });
                    }
                });
            } else {
                res.send("Invalid token");
            }
        });
    });
});


module.exports = location;