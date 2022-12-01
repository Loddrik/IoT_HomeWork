const express = require("express");

const admin = require("./admin");
const company = require("./company");
const location = require("./location");
const sensor = require("./sensor");
const router = express.Router();

router.use("/admin", admin);
router.use("/company", company);
router.use("/location", location);
router.use("/sensor", sensor);

router.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = router;

