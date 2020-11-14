const express = require('express');
const router = express.Router();

const {createCategory, getAllCategories} = require('../controllers/category');

router
    .route('/create')
    .post(createCategory)

router
    .route("/")
    .get(getAllCategories)


module.exports = router;