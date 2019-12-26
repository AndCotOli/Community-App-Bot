const Meeting = require('../../DB/Models/Meeting');
const moment = require('moment');

const validTeams = ['backend', 'frontend', 'general', 'design'];

async function addMeeting(channel, name, date, time, team = 'general') {
  try {
    date = moment.utc(`${date} ${time}`, 'DD-MM-YYYY hh:mm');
    team = team.toLowerCase();

    if (!validTeams.includes(team)) return channel.send('Invalid team');
    if (date.toString() === 'Invalid date') return channel.send('Invalid date');

    await Meeting.create({ team, date: date.toDate(), name });

    return channel.send(
      `Successfully added a meeting on ${date.format(
        'dddd, MMMM Do YYYY - hh:mm:ss a z'
      )}`
    );
  } catch (e) {
    channel.send('A meeting with that name is already scheduled');
  }
}

async function viewMeeting(channel, filter) {
  try {
    if (!filter) meetings = await Meeting.find({});
    else if (validTeams.includes(filter))
      meetings = await Meeting.find({ team: filter });
    else meetings = await Meeting.find({ name: filter });

    if (meetings.length) {
      for (let meeting of meetings) {
        channel.send(
          `${meeting.name} ${meeting.isDone ? 'done' : 'scheduled'} on ${moment(
            meeting.date
          ).format('dddd, MMMM Do YYYY - hh:mm:ss a z')}for ${meeting.team}`
        );
      }
    } else channel.send('No scheduled or done meetings with that info');
  } catch (e) {
    channel.send('Something happened');
  }
}

async function markMeeting(channel, name, done) {
  try {
    await Meeting.findOneAndUpdate({ name }, { isDone: done });
    channel.send('Meeting updated');
  } catch (e) {
    channel.send('Oops, something went wrong');
  }
}

async function removeMeeting(channel, name) {
  try {
    await Meeting.findOneAndRemove({ name });
    channel.send('Succesfully removed the meeting');
  } catch (e) {
    channel.send('Oops, something went wrong');
  }
}

async function changeDate(channel, name, day, time) {
  try {
    let date = moment.utc(`${day} ${time}`, 'DD-MM-YYYY hh:mm');
    if (date.toString() === 'Invalid date') return channel.send('Invalid date');

    await Meeting.findOneAndUpdate({ name }, { date: date.toDate() });

    channel.send('Changed the day of the meeting succesfully');
  } catch (e) {
    channel.send('Oops, something went wrong');
  }
}

module.exports = {
  name: 'meeting',
  description: 'Information about next meeting',
  usage: `<mode> ...<options>
    add <name> <date> <time> <team>
    view/. <?name/team>
    mark <name> <done (true/false)>
    remove <name>
    postpone <name> <date> <time>
      `,
  async: true,
  async execute(message, args) {
    switch (args[0]) {
      case 'add':
        addMeeting(message.channel, args[1], args[2], args[3], args[4]);
        break;
      case 'check':
      case '.':
        viewMeeting(message.channel, args[1]);
        break;
      case 'mark':
        markMeeting(message.channel, args[1], args[2]);
        break;
      case 'remove':
        removeMeeting(message.channel, args[1]);
        break;
      case 'postpone':
        changeDate(message.channel, args[1], args[2], args[3]);
        break;
      default:
        return message.channel.send(
          'Invalid mode. Valid modes are: "add", "check", "mark", "remove" and "postpone"'
        );
    }
  }
};
