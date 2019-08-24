const fs = require("fs");
const readline = require("readline");
const colors = require("colors");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

class Sheet {
  constructor() {
    const client = this.buildClient();
    this.sheetsService = client.then(auth =>
      googleapis.sheets({ version: "v4", auth })
    );
  }

  // buildClient() {
  //   return new Promise((resolve, reject) => {
  //     new GoogleAuth().getApplicationDefault((err, authClient) => {
  //       if (err) return reject(err);

  //       let scopes = ["https://www.googleapis.com/auth/spreadsheets"];

  //       if (authClient.createScopeRequired && authClient.createScopeRequired())
  //         authClient = authClient.createScoped(scopes);

  //       resolve(authClient);
  //     });
  //   });
  // }

  buildClient() {
    return new Promise((resolve, reject) => {
      fs.readFile("credentials.json", (err, content) => {
        if (err) reject(err);

        return resolve(this._authorize(JSON.parse(content)));
      });
    });
  }

  _authorize(credentials) {
    console.log("Authorizing");
    return new Promise((resolve, reject) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;

      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      fs.readFile("token.json", (err, token) => {
        if (err) resolve(this._generateToken(oAuth2Client));

        oAuth2Client.setCredentials(JSON.parse(token));

        resolve(oAuth2Client);
      });
    });
  }

  _generateToken(client) {
    return new Promise(async (resolve, reject) => {
      const url = client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });

      console.log(
        colors.blue(`You need to authorize the app going to: ${url}`)
      );

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      await rl.question(colors.blue("Enter your code here: "), code => {
        rl.close();
        client.getToken(code, (err, token) => {
          if (err) reject(err);

          client.setCredentials(token);

          fs.writeFile("token.json", JSON.stringify(token), err => {
            if (err) reject(err);

            console.log(colors.green("Token stored!"));
          });

          resolve(client);
        });
      });
    });
  }

  async readValues(id, range) {
    return new Promise((resolve, reject) => {
      this.sheetsService.spreadsheets.values.get(
        {
          id,
          range
        },
        (err, data) => {
          if (err) return reject(err);

          const nRows = data.values ? data.values.length : 0;
          console.log(`${nRows} rows were readed`);

          resolve(data);
        }
      );
    });
  }
}

const main = async () => {
  try {
    const s = new Sheet();
    const result = await s.readValues(
      "1Tgq48t2MqPs5wvGsk0mo8fSSlELoTAK5g0B7Xtj5MLA",
      "Data A2:K"
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

main();
