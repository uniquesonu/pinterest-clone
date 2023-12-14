const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
// finding the path name
// console.log(path.extname("hello.pdf"));

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination folder for uploaded files
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for each uploaded file
        const uniqueFilename = uuidv4();
        cb(null, uniqueFilename+path.extname(file.originalname));
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
