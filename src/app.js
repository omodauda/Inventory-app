const express = require('express');
require('./database/db');

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res
    .status(200)
    .json({
        status: "success",
        message: "welcome to inventory app"
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

module.exports = app;