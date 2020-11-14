const express = require('express');
const router = express.Router();

const {createSubcategory} = require('../controllers/subCategory');

router
    .route("/create")
    .post(createSubcategory)





module.exports = router;