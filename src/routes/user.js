const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportLogin = passport.authenticate('local', {session: false});
const passportGoogle = passport.authenticate("google", {session: false});
const passportJWT = passport.authenticate("jwt", {session: false});

const {validateBody, schemas} = require('../helpers/validator');
const accessControl = require('../middlewares/accessControl');


const {signUp, login, googleOauth, verifyUser, updateUser, profile, uploadImage} = require('../controllers/user');
const upload = require('../helpers/multer');

router
    .route("/signup")
    .post(validateBody(schemas.userSchema), signUp)

router
    .route("/confirm")
    .post(verifyUser)

router
    .route("/login")
    .post(validateBody(schemas.loginSchema), passportLogin, login)

router
    .route("/google")
    .post(passportGoogle, googleOauth);

router
    .route("/update")
    .patch(validateBody(schemas.updateSchema), passportJWT, updateUser)

router
    .route("/profile/:userId")
    .get(passportJWT, profile)

router
    .route("/profile/upload_image")
    .post(passportJWT, upload.single('image'), uploadImage)
    
module.exports = router;