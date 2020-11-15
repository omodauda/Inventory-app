const express = require('express');
const router = express.Router();

const {create, getAllTablets} = require('../../controllers/items/tablets');

router
    .route("/")
    .post(create)
    .get(getAllTablets)

// router
//     .route("/")
//     .get(getAllTablets)

module.exports = router;