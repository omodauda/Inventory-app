const express = require('express');
const router = express.Router();

const {createCategory} = require('../controllers/category');

router
    .route('/create')
    .post(createCategory)



module.exports = router;