const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/inventory', 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to database');
})