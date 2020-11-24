const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {promoteAd} = require('../controllers/ad');

const {validateBody, schemas} = require('../validators');

router
    .route('/promote/:id')
    .post(validateBody(schemas.promoteAdSchema), passportJWT, promoteAd)



module.exports = router;