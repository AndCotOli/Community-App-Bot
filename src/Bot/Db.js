const fs = require("fs");
const path = require("path");

const hash = {};
const dbPath = path.join(__dirname, "./DB/db.json");

const get = index => (typeof hash[index] !== "undefined" ? hash[index] : null);

const set = (index, data) => {
  if (typeof hash[index] === "undefined") hash[index] = [];

  hash[index] = data;
  saveDB();
};

const remove = index => {
  if (typeof hash[index] !== "undefined") delete hash[index];

  saveDB();
  return true;
};

const saveDB = () => {
  const data = JSON.stringify(hash);
  const options = { encoding: "utf8" };

  fs.writeFile(dbPath, data, options, err => {
    if (err) throw err;
  });
};

const readDB = () => {
  fs.readFile(dbPath, { encoding: "utf8" }, (err, data) => {
    if (err) throw err;

    console.log(data);

    try {
      data = JSON.parse(data);

      for (key in data) {
        hash[key] = data[key];
      }
    } catch (e) {
      throw e;
    }
  });
};

readDB();

module.exports = { get, set, remove, readDB };
