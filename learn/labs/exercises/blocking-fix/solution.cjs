const http = require("node:http");
const crypto = require("node:crypto");

const server = http.createServer((request, response) => {
  if (request.url === "/hash") {
    const hash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512");
    response.end(hash.toString("hex"));
    return;
  }

  response.end("ok");
});

module.exports = server;
