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

const accessControl = require('../middlewares/accessControl');

router
    .route('/:id/accept')
    .patch(passportJWT, accessControl('admin'), acceptAd)

    
router
    .route('/:id/decline')
    .patch(passportJWT, accessControl('admin'), declineAd)


router
    .route('/:id/close')
    .patch(passportJWT, closeAd)


router
    .route('/:id/promote')
    .post(passportJWT, validateBody(schemas.promoteAdSchema), passportJWT, promoteAd)

router
    .route("/:id/verify-payment")
    .post(passportJWT, verifyAdPayment)

router
    .route('/:id/remove')
    .delete(passportJWT, deleteAd)

router
    .route("/validate-promotions")
    .get(passportJWT, accessControl('admin'), checkPromotions)

module.exports = router;