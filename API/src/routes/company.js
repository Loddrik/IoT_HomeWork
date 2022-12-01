const express = require("express")
const client = require("../middlewares/db_connector")
const generate_token = require("../functions/tokengen")

const company = express.Router();

company.post("/createCompany/", (req, res) => {
    const { token } = req.query;
    const { id, companyName } = req.body;

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT * FROM usuarios WHERE token = $1;`, [token], (err, result) => {
            if (err) {
                res.send("Query error");
            }
            const tok = generate_token(10);
            console.log(result.rows)
            if (result.rows.length > 0) {
                client.query("INSERT INTO companias(id, companyName, companyApiKey) VALUES ($1, $2, $3)", [id, companyName, tok], (err, result) => {
                    done();
                    if (err) {
                        res.send("Query error");
                    } else {
                        res.send({
                            message: "Empresa creada",
                            data: {
                                id: id,
                                companyName: companyName,
                                companyApiKey: tok
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

company.get("/getCompanies/", (req, res) => {
    const { token } = req.query;
    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query(`SELECT * FROM usuarios WHERE token = $1;`, [token], (err, result) => {
            if (err) {
                res.send("Query error");
            }
            if (result.rows.length > 0) {
                client.query("SELECT * FROM companias", (err, result) => {
                    done();
                    if (err) {
                        res.send("Query error");
                    } else {
                        res.send(result.rows);
                    }
                });
            } else {
                res.send("Invalid token");
            }
        });
    });
});

module.exports = company;