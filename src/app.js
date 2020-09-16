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

app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

module.exports = app;