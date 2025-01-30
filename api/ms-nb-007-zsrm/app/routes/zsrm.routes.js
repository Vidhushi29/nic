const zsrm = require("../controllers/zsrm.controller");
const auth = require('../_middleware/auth');
const apiValidation = require('../_middleware/api-validation');

// const redis = require('../_middleware/redis');
require('dotenv').config()
module.exports = app => {
    //Crop and Variety
    app.get(`${process.env.MICRO_SERVICE}/api/get-all-crops`,auth,zsrm.getCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-all-varieties`,auth,zsrm.getVarietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-data`,auth,zsrm.getVarietyData);

    //ZSRM FS SEED
    app.post(`${process.env.MICRO_SERVICE}/api/add-req-fs`,auth,zsrm.saveZsrmReqFs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all`,auth,zsrm.viewZsrmReqFsAll);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs/:id`,auth,zsrm.getZsrmReqFsById);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-updated`,auth,zsrm.viewZsrmReqFsAllUpdated);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed`,auth,zsrm.viewZsrmReqFsAllSD);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed-crop`,auth,zsrm.viewZsrmReqFsAllSDCropWiseReport);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop`,auth,zsrm.viewZsrmReqFsCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop-variety`,auth,zsrm.viewZsrmReqFsCropVariety);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-req-fs/:id`,auth,zsrm.deleteZsrmReqFsById);
    app.put(`${process.env.MICRO_SERVICE}/api/update-req-fs/:id`,auth,zsrm.updateZsrmReqFsById);

    //SRP
    app.post(`${process.env.MICRO_SERVICE}/api/add-srp`,auth,zsrm.addSrp);
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp/:id`,auth,zsrm.viewSrpById); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-all`,auth,zsrm.viewSrpAll); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-summary`,auth,zsrm.viewSrpAllCropWiseSummary); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise`,auth,zsrm.viewSrpAllCropWise); 
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-srp/:id`,auth,zsrm.deleteSrp);
    app.put(`${process.env.MICRO_SERVICE}/api/update-srp/:id`,auth,zsrm.updateSrp);
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-all-seed-division`,auth,zsrm.viewSrpAllSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-seed-division`,auth,zsrm.viewSrpAllCropWiseSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-summary-seed-division`,auth,zsrm.viewSrpAllCropWiseSummarySD); 

    //SRR
    app.post(`${process.env.MICRO_SERVICE}/api/add-srr`,auth,zsrm.addSrr);
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr`,auth,zsrm.viewSrrByYearCropSeedType); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr-all`,auth,zsrm.viewSrrAll); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr-all-report`,auth,zsrm.viewSrrAllReport); 
    app.put(`${process.env.MICRO_SERVICE}/api/update-srr/:id`,auth,zsrm.updateSrr);
  
    //ZSRMBSTOFS
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-bs-to-fs`,auth,zsrm.addZsrmBsToFs);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-bs-to-fs/:id`,auth,zsrm.deleteZsrmBsToFs);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-bs-to-fs/:id`,auth,zsrm.updateZsrmBsToFs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-bs-to-fs-all`,auth,zsrm.viewZsrmBsToFs); 

    //ZSRMFSTOCS
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-fs-to-cs`,auth,zsrm.addZsrmFsToCs);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-fs-to-cs/:id`,auth,zsrm.deleteZsrmFsToCs);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-fs-to-cs/:id`,auth,zsrm.updateZsrmFsToCs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-fs-to-cs-all`,auth,zsrm.viewZsrmFsToCs); 

    //ZSRMCSQDSeedDistribution
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-cs-qs-dist`,auth,zsrm.addZsrmCsQsDist);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-cs-qs-dist/:id`,auth,zsrm.deleteZsrmCsQsDist);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-cs-qs-dist/:id`,auth,zsrm.updateZsrmCsQsDist);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-cs-qs-all`,auth,zsrm.viewZsrmCsQsDist); 


     //ZSRMCSFSAREA
     app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-cs-fs-area`,auth,zsrm.addZsrmCsFsArea);
     app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-cs-fs-area/:id`,auth,zsrm.deleteZsrmCsFsArea);
     app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-cs-fs-area/:id`,auth,zsrm.updateZsrmCsFsArea);
     app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-cs-fs-area-all`,auth,zsrm.viewZsrmCsFsArea); 

     

};