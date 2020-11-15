const express = require('express');
const router = express.Router();

const {mobile_phones_tablets} = require('../../controllers/categories/mobile_phones_tablets');

router
    .route("/")
    .get(mobile_phones_tablets)



module.exports = router;