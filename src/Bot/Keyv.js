const Keyv = require("keyv");
const colors = require("colors");

const db = new Keyv();

db.on("error", e =>
  console.log(colors.red(`Error during connecting to Keyv\n${e}`))
);

module.exports = db;
