const util = require("../controllers/util.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/institute`, auth, util.getInstitute);
    app.post(`${process.env.MICRO_SERVICE}/api/utils/upload`, auth, util.upload);
    app.get(`${process.env.MICRO_SERVICE}/api/utils/file-download`, auth, util.getFile);
    app.get(`${process.env.MICRO_SERVICE}/api/designation`, auth, util.getDesignation);
    app.post(`${process.env.MICRO_SERVICE}/api/utils/check-status`,  util.makeHttpRequest);
    // app.post(`${process.env.MICRO_SERVICE}/api/utils/decrypt-data`,  util.decryptData);
    // app.post(`${process.env.MICRO_SERVICE}/api/utils/vahan-encrypt`,  util.encryptData);

    app.post(`${process.env.MICRO_SERVICE}/api/utils/decrypt-data`,  util.decryptVahan);
+    app.post(`${process.env.MICRO_SERVICE}/api/utils/vahan-encrypt`,  util.encryptVahan);

    app.post(`${process.env.MICRO_SERVICE}/api/utils/encrypt-status-data`,  util.encryptStatusData);
    app.post(`${process.env.MICRO_SERVICE}/api/utils/decrypt-status-data`,  util.decryptStatusData);

    

};