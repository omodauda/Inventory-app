const express = require('express');
const router = express.Router();

const {create, getAllMobilePhones} = require('../../controllers/items/mobile_phones');

router
    .route("/")
    .post(create)
    .get(getAllMobilePhones)

// router
//     .route("/")
//     .get(getAllMobilePhones)

module.exports = router;