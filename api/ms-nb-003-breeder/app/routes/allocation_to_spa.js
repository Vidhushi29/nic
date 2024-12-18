const allocationToSPA = require("../controllers/allocation_to_spa");
const auth = require('../_middleware/auth');
require('dotenv').config();
const apiValidation = require('../_middleware/api-validation');

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-year`, auth, allocationToSPA.yearData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-season`, auth, allocationToSPA.seasonData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-crop-group`, auth, allocationToSPA.cropGroupData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-crop`, auth, allocationToSPA.cropData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-varieties`, auth, allocationToSPA.varietiesData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-variety`, auth, allocationToSPA.varietyData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-spa/:id`, auth, allocationToSPA.getByID);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-spa`, auth, allocationToSPA.create);
    app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-to-spa-list`, auth, allocationToSPA.fetch);
    app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-to-spa-list-second`, auth, allocationToSPA.fetchsecond);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-spa/edit`, auth, allocationToSPA.update);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-spa/delete/:id`, auth, allocationToSPA.delete);
    app.get(`${process.env.MICRO_SERVICE}/api/year-allocation-to-spa`, auth, allocationToSPA.getYearData);
    app.get(`${process.env.MICRO_SERVICE}/api/season-allocation-to-spa`, auth, allocationToSPA.getSeasonData);
    app.get(`${process.env.MICRO_SERVICE}/api/cropgroup-allocation-to-spa`, auth, allocationToSPA.getCropGroupData);
    app.get(`${process.env.MICRO_SERVICE}/api/crop-allocation-to-spa`, auth, allocationToSPA.getCropsData);
    app.get(`${process.env.MICRO_SERVICE}/api/varieties-allocation-to-spa`, auth, allocationToSPA.getVarietiesData);
    app.get(`${process.env.MICRO_SERVICE}/api/varieties-allocation-to-spa`, auth, allocationToSPA.getVarietiesData);
    app.post(`${process.env.MICRO_SERVICE}/api/report-lifting`, auth, allocationToSPA.getReportLifting);
    app.post(`${process.env.MICRO_SERVICE}/api/report-spa`, auth, allocationToSPA.getReportSPA);
    app.post(`${process.env.MICRO_SERVICE}/api/lifting-nonlifting-spa-report`, auth, allocationToSPA.liftingNonLifitngReportSPA);
    app.post(`${process.env.MICRO_SERVICE}/api/cropWiseAllocationSubmission`, auth, allocationToSPA.cropWiseAllocationSubmission);

    app.post(`${process.env.MICRO_SERVICE}/api/allocationToSPA/getVarietyDataForEdit`, auth, allocationToSPA.getVarietyDataForEdit);

    app.post(`${process.env.MICRO_SERVICE}/api/spa/indentor-report`, auth, allocationToSPA.indentorReport);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation/varietyWiseSubmissionIndentor`, auth, allocationToSPA.varietyWiseSubmissionIndentor);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation/cropWiseSubmissionIndentor`, auth, allocationToSPA.cropWiseSubmissionIndentor);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-line`, auth, allocationToSPA.allocationToSpaLineData);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-spa-line-for-edit`, auth, allocationToSPA.allocationToSpaLineDataforEdit);
    app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-data`, auth, allocationToSPA.getAllocationSpaData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-allocation-data`, auth, allocationToSPA.updateAllocationSpaData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-allocation-status`, auth, allocationToSPA.updateSpaStatus);
}
