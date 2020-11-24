const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {create, getAllMobilePhones, verifyPost, promotePost} = require('../../controllers/items/mobile_phones');

const upload = require('../../helpers/multer');
const {validateBody, schemas} = require('../../validators');

router
    .route("/")
    .post(passportJWT, upload.array('images'), create)
    .get(passportJWT, getAllMobilePhones)

router
    .route("/verify/:id")
    .patch(verifyPost)

// router
//     .route("/promote/:id")
//     .post(validateBody(schemas.promoteProductSchema), passportJWT, promotePost)

module.exports = router;