const express = require("express")
const client = require("../middlewares/db_connector")
const generate_token = require("../functions/tokengen")

const admin = express.Router()

admin.post("/register", (req, res) => {
    const { username, password } = req.body

    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error")
            return
        }
        client.query("Select * from usuarios where username = $1", [username], (err, result) => {
            if (err) {
                res.send(err)
                return
            }
            if (result.rows.length > 0) {
                res.send({
                    message: "Usuario ya existe",
                    data: result.rows[0],
                });
            }
            else {
                client.query("INSERT INTO usuarios(username, password) VALUES ($1, $2)", [username, password], (err, result) => {
                    done()
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({
                            message: "Usuario creado",
                            data: {
                                username,
                                password
                            }
                        })
                    }
                });
            }
        });
    })
})

admin.get("/getUsers", (req, res) => {
    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query("SELECT * FROM usuarios", (err, result) => {
            done()
            if (err) {
                res.send(err.stack)
            } else {
                res.send(result.rows)
            }
        })
    })
})

admin.post("/login", (req, res) => {
    const { username, password } = req.body;
    client.connect((err, client, done) => {
        if (err) {
            res.send("Client connection error");
        }
        client.query("SELECT * FROM usuarios WHERE username = $1 AND password = $2", [username, password], (err, result) => {
            done()
            if (err) {
                res.send("Query error");
            }
            if (result.rows.length > 0) {
                const tok = generate_token(10);
                client.query("UPDATE usuarios SET token = $1 WHERE username = $2", [tok, username], (err, result) => {
                    if (err) {
                        res.send("Query error");
                    }
                    else {
                        res.send({
                            message: "Usuario logueado, por favor guarde su token",
                            data: { username, token: tok },
                        })
                    }
                })
            } else {
                res.send({
                    message: "Usuario no existe",
                    data: result.rows,
                });
            }
        });
    });
});


module.exports = admin



