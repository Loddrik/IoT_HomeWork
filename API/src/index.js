const express = require("express")
const cors = require("cors")
const routes = require("./routes")


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use("/", routes)

app.listen(process.env.DEV_PORT, () => console.log("Server running on port " + process.env.DEV_PORT))