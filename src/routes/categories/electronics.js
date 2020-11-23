const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {getElectronics} = require('../../controllers/categories/electronics');

router
    .route('/')
    .get(passportJWT, getElectronics)


module.exports = router;