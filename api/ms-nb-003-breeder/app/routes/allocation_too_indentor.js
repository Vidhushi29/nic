// const allocationToIndentor = require("../controllers/allocation_to_indentor");
// const auth = require('../_middleware/auth');
// require('dotenv').config();

// module.exports = app => {
//     app.get(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-year-crop`, auth, allocationToIndentor.yearAndCropList);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-variety`, auth, allocationToIndentor.varietyList);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-proforma`, allocationToIndentor.proforma);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-variety-list`, auth, allocationToIndentor.proformaVariety);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor-list`, auth, allocationToIndentor.fetch);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-allocation-to-indentor/:id`, auth, allocationToIndentor.getById);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-production-center-details`,  allocationToIndentor.getProductionCenterDetails);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-variety-name`, allocationToIndentor.getVarietyName);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-indentors`, allocationToIndentor.getIndentors);
//     app.post(`${process.env.MICRO_SERVICE}/api/add-allocation-to-indentor`, auth, allocationToIndentor.create);
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-allocation-to-indentor`, auth, allocationToIndentor.update);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-allocation-to-indentor/:id`, auth, allocationToIndentor.delete);

//     app.post(`${process.env.MICRO_SERVICE}/api/getAllocationOfBreederSeedsToIndentorsLifting`, auth, allocationToIndentor.getAllocationOfBreederSeedsToIndentorsLifting); //1
//     app.post(`${process.env.MICRO_SERVICE}/api/filterAllocationOfBreederSeedsToIndentorsLifting`, auth, allocationToIndentor.filterAllocationOfBreederSeedsToIndentorsLifting);
//     app.get(`${process.env.MICRO_SERVICE}/api/getYearOfIndentForIndentorLifting`, auth, allocationToIndentor.getYearOfIndentForIndentorLifting);
//     app.get(`${process.env.MICRO_SERVICE}/api/getCropOfIndentorLiftingByYear`, auth, allocationToIndentor.getCropOfIndentorLiftingByYear);
//     app.get(`${process.env.MICRO_SERVICE}/api/getVarietyOfIndentorLiftingByYear`, auth, allocationToIndentor.getVarietyOfIndentorLiftingByYear);

// };