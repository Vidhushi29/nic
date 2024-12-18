// const uploadController = require("../controllers/upload.controller.js");
// const seed = require("../controllers/seed.controller.js");
// const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage })

// module.exports = app => {
//     app.get(`${process.env.MICRO_SERVICE}/api/download-image`, uploadController.download);
//     app.post(`${process.env.MICRO_SERVICE}/api/upload-image`, upload.single('name'), uploadController.upload);
// }