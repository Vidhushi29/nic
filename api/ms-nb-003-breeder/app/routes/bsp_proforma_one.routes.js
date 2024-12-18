const bspProformaOne = require("../controllers/bsp_profarma_one.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-data`,auth, bspProformaOne.getBspProformaOneData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp-proforma-one-data`,auth, bspProformaOne.addBspProformaOneData);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp-proforma-one-data`,auth, bspProformaOne.deleteBspProformaOneData);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-bspc-data`,auth, bspProformaOne.getAllBspcData);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-year`, auth, bspProformaOne.getBspProformaOneYear);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-season`, auth, bspProformaOne.getBspProformaOneSeason);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-crop`, auth, bspProformaOne.getBspProformaOneCrop);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety`, auth, bspProformaOne.getBspProformaOneVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-filter`,auth, bspProformaOne.getBspProformaOneVarietyFilter);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-second`,auth, bspProformaOne.getBspProformaOneVarietySecond);    
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-basic-data`,auth, bspProformaOne.getBspProformaOneVarietyBasicData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-basic-data-second`,auth, bspProformaOne.getBspProformaOneVarietyBasicDataSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-monitoring-team`,auth, bspProformaOne.getBspMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp-monitoring-team`,auth, bspProformaOne.addBspMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/check-bsp-one-variety-availability`, bspProformaOne.checkBspOneVarietyAvailability);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-line-data`, auth,bspProformaOne.getBspProformaOneVarietyLineData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-line-data-second`,auth, bspProformaOne.getBspProformaOneVarietyLineDataSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-line-new-data`,auth, bspProformaOne.getBspProformaOneVarietyLineNewData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-variety-line-data-new-second`,auth, bspProformaOne.getBspProformaOneVarietyLineDataNewSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/check-report-runing-number`,auth, bspProformaOne.checkReportRuningNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/update-report-runing-number`, auth,bspProformaOne.updateReportRuningNumber);

    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-monitoring-team-report`, bspProformaOne.getBspMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/generate-report-runing-number`, bspProformaOne.generateReferenceNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-crop-report`, bspProformaOne.getBspProformaOneCrop); 
    
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-data-qr`, bspProformaOne.getBspProformaOneData);

};