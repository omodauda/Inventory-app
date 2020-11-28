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
    .post(passportJWT, upload.array("images"), create)
    .get(passportJWT, getAll)

router
    .route("/:id")
    .patch(validateBody(schemas.editLaptop), passportJWT, editPost)

module.exports = router;