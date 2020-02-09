const SetUp = require('./setup');

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

  async append(values) {
    if (this.sheets === null) await this._init();

    let request = {
      spreadsheetId: this.id,
      range: 'Genermal Information!A2:A',
      valueInputOption: 'RAW',
      resource: { values }
    };

    return this.sheets.spreadsheets.values.append(request, (err, response) => {
      if (err) return console.log('Oops, something went wrong: ', err);

      return {
        status: response.status,
        message: response.statusText,
        position: response.tableRange
      };
    });
  }
}

module.exports = SheetsAPI;
