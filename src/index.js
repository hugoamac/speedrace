"use-strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const reportRouter = require("./relatorio/router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const data = "Speed Race API";
    res.json(data).status(200);
});

app.use("/api", reportRouter);

module.exports = app;