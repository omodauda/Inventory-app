const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {
    promoteAd,
    verifyAdPayment,
    acceptAd,
    declineAd,
    closeAd,
    deleteAd,
    checkPromotions
} = require('../controllers/ad');

const {validateBody, schemas} = require('../validators');

router
    .route('/accept/:id')
    .patch(passportJWT, acceptAd)

    
router
    .route('/decline/:id')
    .patch(passportJWT, declineAd)


router
    .route('/close/:id')
    .patch(passportJWT, closeAd)


router
    .route('/promote/:id')
    .post(passportJWT, validateBody(schemas.promoteAdSchema), passportJWT, promoteAd)

router
    .route("/verify-payment/:id")
    .post(passportJWT, verifyAdPayment)

router
    .route('/remove/:id')
    .delete(passportJWT, deleteAd)

router
    .route("/validate-promotions")
    .get(passportJWT, checkPromotions)

module.exports = router;