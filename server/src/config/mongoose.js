const mongoose = require('mongoose');
const { config } = require('dotenv');

config();

const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASSWORD;
const dburi = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const dbAuth = process.env.DB_AUTH;
const isTest = !!process.env.NODE_ENV;

const baseConnectHost = process.env.SERVER === 'true' ? 'mongodb+srv' : 'mongodb';
const finalUri = !dbuser && !dbpassword
  ? `${baseConnectHost}://${dburi}/${dbName || ''}${isTest ? '-test' : ''}${dbAuth || ''}`
  : `${baseConnectHost}://${dbuser}:${dbpassword}@${dburi}/${dbName || ''}${isTest ? '-test' : ''}${dbAuth || ''}`;

  console.log(finalUri);
// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Connect to mongo db
exports.connect = async () => {
  await mongoose.connect(finalUri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose.connection;
};
