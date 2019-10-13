const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const colors = require('colors');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

async function setUpSheetsAPI() {
  return fs
    .readFile(CREDENTIALS_PATH)
    .then(contentBuffer => {
      const credentials = JSON.parse(contentBuffer);

      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      return fs
        .readFile(TOKEN_PATH)
        .then(token => {
          oAuth2Client.setCredentials(JSON.parse(token));
          return google.sheets({ version: 'v4', auth: oAuth2Client });
        })
        .catch(_err => {
          return _getNewToken(oAuth2Client);
        });
    })
    .catch(err => console.log(colors.red('Error loading credentials: ', err)));
}

async function _getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log(colors.cyan('Please, authorize this app by visiting: ', authUrl));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter your code here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.log(colors.red('Error while getting the token, '), err);

      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token))
        .then(() => console.log(colors.yellow('Token stored to: ', TOKEN_PATH)))
        .catch(err =>
          console.log(
            colors.red('Something went wrong when storing the token: ', err)
          )
        );

      return google.sheets({ version: 'v4', auth: oAuth2Client });
    });
  });
}

module.exports = setUpSheetsAPI;
