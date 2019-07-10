"use-strict";

const router = require("express").Router();
const controller = require("./controller");

router.get("/relatorio", controller.get);

module.exports = router;