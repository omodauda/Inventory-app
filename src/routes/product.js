const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {validateBody, schemas} = require('../helpers/validator');
const accessControl = require('../middlewares/accessControl');

const {createProduct, getProducts, getProductById, getProductsByCategory} = require('../controllers/product');

router 
    .route('/')
    .post(passportJWT, createProduct)
    .get(passportJWT, getProducts)

router
    .route('/categories')
    .get(passportJWT, getProductsByCategory)

router
    .route("/:id")
    .get(passportJWT, getProductById);

module.exports = router;