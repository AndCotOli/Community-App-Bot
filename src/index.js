require('dotenv').config();
require('./DB/');
const discordBot = require('./Bot');

discordBot.login(process.env.DISCORD_TOKEN);
