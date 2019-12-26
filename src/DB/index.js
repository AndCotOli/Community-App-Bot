const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.once('open', () => console.log('DB Ready'));
mongoose.connection.on('error', error =>
  console.error('Error connecting to the db: ', error)
);
