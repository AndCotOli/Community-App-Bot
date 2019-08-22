const fetch = require("node-fetch");

const { token, key, id } = require("./config.json");

async function addBoardMember(email) {
  const url = `https://api.trello.com/1/boards/${id}/members?email=${email}&key=${key}&token=${token}`;

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  };

  const res = await fetch(url, options);
  const data = await res.json();
  return data;
}

module.exports = { addBoardMember };
