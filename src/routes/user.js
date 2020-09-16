const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportLogin = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate("jwt", {session: false});

const {validateBody, schemas} = require('../helpers/validator');
const accessControl = require('../middlewares/accessControl');


const {signUp, login, secret} = require('../controllers/user');

router
    .route("/signup")
    .post(validateBody(schemas.userSchema), signUp)

router
    .route("/login")
    .post(validateBody(schemas.loginSchema), passportLogin, login)


module.exports = router;