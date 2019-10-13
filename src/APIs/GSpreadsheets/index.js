const SetUp = require('./setup');
const sheetId = process.env.SHEET_ID;

class SheetsAPI {
  constructor(sheetID) {
    this.sheets = null;
    this.id = sheetID;
  }

  async _init() {
    this.sheets = await SetUp();
  }

  async read(ranges) {
    if (this.sheets === null) await this._init();

    let request = {
      spreadsheetId: this.id,
      ranges
    };

    this.sheets.spreadsheets.values.batchGet(request, (err, response) => {
      if (err) return console.log('Oops, something went wrong: ', err);
      response.data.valueRanges.map(v => {
        console.log(v);
      });
    });
  }

  async append()
}

// Tests
async function main() {
  const sheets = new SheetsAPI(sheetId);
  await sheets.read(['General Information!A2:A']);
}

main();
module.exports = SheetsAPI;
