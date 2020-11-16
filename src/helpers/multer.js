const multer = require('multer');
const path = require('path');

//Multer configuration
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let _ext = path.extname(file.originalname);
        const ext = [".jpg", ".jpeg", ".png"];
        if(!ext.includes(_ext)){
            cb(new Error("File format is not supported"), false);
            return;
        }
        cb(null, true);
    },
    limits: {fileSize: 5 * 1024 * 1024}
});