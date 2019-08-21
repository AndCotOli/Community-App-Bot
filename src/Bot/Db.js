const Keyv = require("keyv");
const colors = require("colors");

const db = new Keyv();

db.on("error", () => console.log(colors.red("Error during Keyv setup")));

module.exports = db;
