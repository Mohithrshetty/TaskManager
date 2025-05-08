const multer = require('multer');

//configure multer storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // append timestamp to the original filename
    }
});

//file filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // specify allowed file types
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG files are allowed.'), false); // reject the file
    }
};


const upload = multer({storage, fileFilter}); // create multer instance with storage and file filter

module.exports = upload; // export the multer instance for use in routes

