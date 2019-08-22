const request = require("request");

const { token, key, id } = require("./config.json");

// function addBoardMember(email) {
//   const options = {
//     method: "PUT",
//     url: `https://api.trello.com/1/boards/${id}/members`,
//     qs: { email, key, token },
//     headers: { type: "type", "content-type": "application/json" }
//   };

//   request(options, (err, _res, data) => {
//     if (err) return err;

//     console.log(data);

//     return data;
//   });
// }

async function addBoardMember(email) {
  const options = {
    method: "PUT",
    url: `https://api.trello.com/1/boards/${id}/members`,
    qs: { email, key, token },
    headers: { type: "type", "content-type": "application/json" }
  };

  try {
    const data = await request(options);
    return data.body;
  } catch (error) {
    return error;
  }
}

module.exports = { addBoardMember };
