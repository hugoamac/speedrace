"use-strict";
const service = require("./service");

const get = (req, res) => {

    const data = service.recuperaRelatorioFinalDeTodaCorrida();
    
    res.json(data).status(200);

};

module.exports = { get };