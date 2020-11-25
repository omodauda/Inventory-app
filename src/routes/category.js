const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const accessControl = require('../middlewares/accessControl');

const {createCategory, getAllCategories} = require('../controllers/category');

router
    .route('/create')
    .post(passportJWT, accessControl(["admin"]), createCategory)

router
    .route("/")
    .get(getAllCategories)


module.exports = router;