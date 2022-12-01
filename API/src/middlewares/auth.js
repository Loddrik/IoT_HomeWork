const client = require("../middlewares/db_connector")

function isAuth(token) {
    var res = false;
    client.connect((err, client, done) => {
        if (err) {
            console.log("Error en auth");
        }
        client.query("SELECT * FROM usuarios WHERE token = $1", [token], (err, result) => {
            done();
            if (err) {
                console.log("Error en auth");
            } else {
                if (result.rows.length > 0) {
                    res = true;
                    console.log("true")

                } else {
                    res = false;
                    console.log("false")
                }
            }
        });
    })
    console.log(res)
    return res;
}


module.exports = isAuth;