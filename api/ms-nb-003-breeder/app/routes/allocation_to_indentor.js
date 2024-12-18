const allocationToIndentor = require("../controllers/allocation_to_indentor");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-year`, auth, allocationToIndentor.yearData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-season`, auth, allocationToIndentor.seasonData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-crop-group`, auth, allocationToIndentor.cropGroupData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-crop`, auth, allocationToIndentor.cropData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-varieties`, auth, allocationToIndentor.varietiesData);
    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-varieties-for-edit`, auth, allocationToIndentor.varietiesDataForEdit);

    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor-variety`, auth, allocationToIndentor.varietyData);

    app.get(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor/:id`, auth, allocationToIndentor.getByID);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor`, auth, allocationToIndentor.create);
    app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-list`, auth, allocationToIndentor.fetch);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor/edit`, auth, allocationToIndentor.update);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-to-indentor/delete`, auth, allocationToIndentor.delete);
    app.get(`${process.env.MICRO_SERVICE}/api/year-allocation-to-indentor`, auth, allocationToIndentor.getYearData);
    app.get(`${process.env.MICRO_SERVICE}/api/season-allocation-to-indentor`, auth, allocationToIndentor.getSeasonData);
    app.get(`${process.env.MICRO_SERVICE}/api/cropgroup-allocation-to-indentor`, auth, allocationToIndentor.getCropGroupData);
    app.get(`${process.env.MICRO_SERVICE}/api/crop-allocation-to-indentor`, auth, allocationToIndentor.getCropsData);
    app.get(`${process.env.MICRO_SERVICE}/api/varieties-allocation-to-indentor`, auth, allocationToIndentor.getVarietiesData);

    app.post(`${process.env.MICRO_SERVICE}/api/allocation/varietyWiseSubmission`, auth, allocationToIndentor.varietyWiseSubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation/cropWiseSubmission`, auth, allocationToIndentor.cropWiseSubmission);

    app.post(`${process.env.MICRO_SERVICE}/api/allocation/getVarietyDataForEdit`, auth, allocationToIndentor.getVarietyDataForEdit);
    app.get(`${process.env.MICRO_SERVICE}/api/indenter-allocation-data`, allocationToIndentor.indenterAllocationData);

    
  
    app.post(`${process.env.MICRO_SERVICE}/api/allocation/indentor-report`, auth, allocationToIndentor.indentorReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-line-data`, auth, allocationToIndentor.breederLineData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-line-data-for-edit`, auth, allocationToIndentor.breederLineDataforEdit);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-line-data-for-edit`, auth, allocationToIndentor.breederLineDataforEdit);
    // app.post(`${process.env.MICRO_SERVICE}/api/allocation/getVarietyLine`, auth, allocationToIndentor.getVarietyLine);
};