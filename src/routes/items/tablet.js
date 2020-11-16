const express = require('express');
const router = express.Router();

const {create, getAllTablets, verifyPost} = require('../../controllers/items/tablets');

router
    .route("/")
    .post(create)
    .get(getAllTablets)

router
    .route("/verify/:id")
    .patch(verifyPost)

module.exports = router;