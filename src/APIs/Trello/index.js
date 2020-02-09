const fetch = require('node-fetch');

const token = process.env.TRELLO_TOKEN,
  key = process.env.TRELLO_KEY,
  id = process.env.TRELLO_ID;

async function addBoardMember(email) {
  const url = `https://api.trello.com/1/boards/${id}/members?email=${email}&type=normal&key=${key}&token=${token}`;

  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  };

  const res = await fetch(url, options);
  console.log(res);
  const data = await res.json();
  console.log(data);
  return data;
}

module.exports = { addBoardMember };
