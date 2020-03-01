const { CronJob } = require('cron');
const User = require('../DB/Models/User');
const Role = require('../DB/Models/Role');

async function synchronizeTeams() {
  console.log('Synchronizing Teams');
  // const users = await User.find({});

  // for (let user of users) {
  // }
}

const teamsJob = new CronJob(
  '0 * * * *',
  synchronizeTeams,
  null,
  true,
  'Europe/London'
);

module.exports = [teamsJob]; // Array with all the jobs
