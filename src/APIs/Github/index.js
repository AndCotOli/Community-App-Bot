const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.GITHUB_API_URL, {
  headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
});

async function getEmailFromGitHub(username) {
  const query = `
  query getEmail($username: String!) {
    user (login: $username) {
      email
    }
  }
  `;

  const data = await client.request(query, { username });
  return data.user.email;
}

module.exports = { getEmailFromGitHub };
