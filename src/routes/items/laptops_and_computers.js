const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {create, getAll} = require('../../controllers/items/laptopsAndComputers');

const upload = require('../../helpers/multer');

router
    .route('/')
    .post(passportJWT, upload.array("images"), create)
    .get(passportJWT, getAll)



module.exports = router;