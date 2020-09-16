const express = require('express');
const router = express.Router();

const {validateBody, schemas} = require('../helpers/validator');
const {signUp} = require('../controllers/user');

router
    .route("/signup")
    .post(validateBody(schemas.userSchema), signUp)


module.exports = router;