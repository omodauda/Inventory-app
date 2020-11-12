require('dotenv').config();
const express = require('express');
require('./database/db');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());


app.get("/api/v1", (req, res) => {
    res
    .status(200)
    .json({
        status: "success",
        message: "welcome to inventory app"
    })
});

//endpoints
app.use("/api/v1/user", userRoutes);

app.use((err, req, res, next) => {
    res.status(400).json({
      status: 'fail',
      error: err.message
    });
});


module.exports = app;