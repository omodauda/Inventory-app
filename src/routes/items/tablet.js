const express = require('express');
const router = express.Router();

const {create} = require('../../controllers/items/tablets');

router
    .route("/create")
    .post(create)

module.exports = router;