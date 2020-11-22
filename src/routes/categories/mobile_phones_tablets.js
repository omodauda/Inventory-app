const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session:false});

const {getMobilePhonesAndTablets} = require('../../controllers/categories/mobile_phones_tablets');

router
    .route("/")
    .get(passportJWT, getMobilePhonesAndTablets)



module.exports = router;