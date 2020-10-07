const config = require('../config');
const mongoose = require('mongoose');

const DB_URL = config.databaseUrl[config.environment];

mongoose.connect(
    DB_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true, 
        useFindAndModify: false
    }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to database', DB_URL);
})