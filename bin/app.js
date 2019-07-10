const http = require("http");
const app = require("../src/");
const config = require("../config/default.json");

const server = http.createServer(app);

server.listen(config.server.port, (err) => {

    if (err) throw new Error(`Error on listening ${config.server.host} server on port ${config.server.port}`);

    console.log(`${config.server.host} server listening on port ${config.server.port}`);
});