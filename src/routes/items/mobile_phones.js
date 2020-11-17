const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {create, getAllMobilePhones, verifyPost} = require('../../controllers/items/mobile_phones');

const upload = require('../../helpers/multer');

router
    .route("/")
    .post(passportJWT, upload.array('images'), create)
    .get(getAllMobilePhones)

router
    .route("/verify/:id")
    .patch(verifyPost)

module.exports = router;