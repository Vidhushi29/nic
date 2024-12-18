const uploadController = require("../controllers/upload.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/download`, uploadController.download);
    app.post(`${process.env.MICRO_SERVICE}/api/upload`, upload.single('name'), uploadController.upload);
}