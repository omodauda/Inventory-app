require('dotenv').config();
const express = require('express');
require('./database/db');

//Routes
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const mobileTablets = require('./routes/categories/mobile_phones_tablets');
const mobile = require('./routes/items/mobile_phones');
const tablet = require('./routes/items/tablet');
const laptopAndComputers = require('./routes/items/laptops_and_computers');
const electronics = require('./routes/categories/electronics');


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
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/mobile-phones-tablets", mobileTablets);
app.use("/api/v1/mobile-phones", mobile);
app.use("/api/v1/tablets", tablet);
app.use("/api/v1/computers-and-laptops", laptopAndComputers);
app.use("/api/v1/electronics", electronics);

app.use((err, req, res, next) => {
    res.status(400).json({
      status: 'fail',
      error: err.message
    });
});


module.exports = app;