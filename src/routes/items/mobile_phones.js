const express = require('express');
const router = express.Router();

const {create, getAllMobilePhones, verifyPost} = require('../../controllers/items/mobile_phones');

router
    .route("/")
    .post(create)
    .get(getAllMobilePhones)

router
    .route("/verify/:id")
    .patch(verifyPost)

module.exports = router;