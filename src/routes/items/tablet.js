const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {create, getAllTablets, verifyPost} = require('../../controllers/items/tablets');

const upload = require('../../helpers/multer');

router
    .route("/")
    .post(passportJWT, upload.array('images'), create)
    .get(passportJWT, getAllTablets)

router
    .route("/verify/:id")
    .patch(verifyPost)

module.exports = router;