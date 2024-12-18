const zsrm = require("../controllers/zsrm.controller");
const auth = require('../_middleware/auth');
const apiValidation = require('../_middleware/api-validation');

// const redis = require('../_middleware/redis');
require('dotenv').config()
module.exports = app => {
    
    app.post(`${process.env.MICRO_SERVICE}/api/add-req-fs`,auth,zsrm.saveZsrmReqFs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all`,auth,zsrm.viewZsrmReqFsAll);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed`,auth,zsrm.viewZsrmReqFsAllSD);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed-crop`,auth,zsrm.viewZsrmReqFsAllSDCropWiseReport);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop`,auth,zsrm.viewZsrmReqFsCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop-variety`,auth,zsrm.viewZsrmReqFsCropVariety);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-req-fs/:id`,auth,zsrm.deleteZsrmReqFsById);
    app.put(`${process.env.MICRO_SERVICE}/api/update-req-fs/:id`,auth,zsrm.updateZsrmReqFsById);
};