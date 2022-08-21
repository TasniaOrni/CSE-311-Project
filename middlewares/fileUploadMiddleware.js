const multer = require("multer");

const imageCheck = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
    fileFilter: function (req, file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;

        // Check ext
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

const pdfCheck = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/uploads/pdfs");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
    fileFilter: function (req, file, cb) {
        // Allowed ext
        const filetypes = /pdf/;

        // Check ext
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

module.exports = {
    imageCheck,
    pdfCheck,
};