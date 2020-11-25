const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate("jwt", {session: false});

const {
    create, 
    getAllMobilePhones,
    editMobilePhone
} = require('../../controllers/items/mobile_phones');

const upload = require('../../helpers/multer');
const {validateBody, schemas } = require('../../validators');

router
    .route("/")
    .post(passportJWT, upload.array('images'), create)
    .get(validateBody(schemas.createMobileSchema), passportJWT, getAllMobilePhones)

router
    .route("/update/:id")
    .patch(validateBody(schemas.editMobileSchema), passportJWT, editMobilePhone)


module.exports = router;