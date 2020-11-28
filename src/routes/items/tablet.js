const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {
    create, 
    getAllTablets,
    editTablet
} = require('../../controllers/items/tablets');

const upload = require('../../helpers/multer');

const {validateBody, schemas} = require('../../validators');

router
    .route("/")
    .post(passportJWT, upload.array('images'), create)
    .get(passportJWT, getAllTablets)

router
    .route("/:id")
    .patch(validateBody(schemas.editMobileSchema), passportJWT, editTablet)

    
module.exports = router;