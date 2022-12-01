const express = require("express")
const client = require("../middlewares/db_connector")
const generate_token = require("../functions/tokengen")


const sensor_data = express.Router()
