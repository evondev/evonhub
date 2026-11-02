const server = require(process.argv[2]);

if (!server || typeof server.listen !== "function") {
  console.error("solution.cjs phải có dòng: module.exports = server;");
  process.exit(1);
}

server.listen(0, "127.0.0.1", () => {
  process.send({ port: server.address().port });
});
