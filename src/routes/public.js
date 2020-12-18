const express = require('express');
const router = express.Router();

const {getElectronics} = require('../controllers/categories/electronics');
const {getMobilePhonesAndTablets} = require('../controllers/categories/mobile_phones_tablets');
const {getAll} = require('../controllers/items/laptopsAndComputers');
const {getAllMobilePhones} = require('../controllers/items/mobile_phones');
const {getAllTablets} = require('../controllers/items/tablets');


router
    .route('/electronics')
    .get(getElectronics)

router
    .route('/mobile-phones-tablets')
    .get(getMobilePhonesAndTablets)

router
    .route('/computers-and-laptops')
    .get(getAll)

router
    .route('/mobile-phones')
    .get(getAllMobilePhones)

router
    .route('/tablets')
    .get(getAllTablets)



module.exports = router;