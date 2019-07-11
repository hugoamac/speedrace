"use-strict";
const RelatorioService = require("./service");
const service =  new RelatorioService();

const get = (req, res) => {

    const data = service.recuperaRelatorioFinalDeTodaCorrida();
    
    res.json(data).status(200);

};

module.exports = { get };