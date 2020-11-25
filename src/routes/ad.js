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
    .patch(acceptAd)

    
router
    .route('/decline/:id')
    .patch(declineAd)


router
    .route('/close/:id')
    .patch(closeAd)


router
    .route('/promote/:id')
    .post(validateBody(schemas.promoteAdSchema), passportJWT, promoteAd)

router
    .route("/verify-payment/:id")
    .post(verifyAdPayment)

router
    .route('/remove/:id')
    .delete(passportJWT, deleteAd)

router
    .route("/validate-promotions")
    .get(checkPromotions)

module.exports = router;