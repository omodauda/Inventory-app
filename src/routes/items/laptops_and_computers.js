const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const {
    create, 
    getAll,
    editPost
} = require('../../controllers/items/laptopsAndComputers');

const upload = require('../../helpers/multer');

const {validateBody, schemas} = require('../../validators');

router
    .route('/')
    .post(validateBody(schemas.createLaptop), passportJWT, upload.array("images"), create)
    .get(passportJWT, getAll)

router
    .route("/update/:id")
    .patch(validateBody(schemas.editLaptop), passportJWT, editPost)

module.exports = router;