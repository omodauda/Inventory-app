const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {
    promoteAd,
    verifyAdPayment,
    acceptAd
} = require('../controllers/ad');

const {validateBody, schemas} = require('../validators');

router
    .route('/accept/:id')
    .patch(acceptAd)
router
    .route('/promote/:id')
    .post(validateBody(schemas.promoteAdSchema), passportJWT, promoteAd)

router
    .route("/verify-payment/:id")
    .post(verifyAdPayment)

module.exports = router;