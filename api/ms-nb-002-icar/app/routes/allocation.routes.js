const allocation = require("../controllers/allocation.controller");
const auth = require('../_middleware/auth');
require('dotenv').config()

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-seed-production-breeder-submission`,  auth, allocation.allocationSeedProductionBreeder);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-seed-production-breeder-list`,  auth, allocation.allocationSeedProductionBreederList);
    app.post(`${process.env.MICRO_SERVICE}/api/allocation-seed-production-breeder-list-grouped`, auth,  allocation.allocationSeedProductionBreederGroupedList);
    app.get(`${process.env.MICRO_SERVICE}/api/test`, allocation.test);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-allocation-seed-production-breeder/:id`, auth,  allocation.deleteallocationSeedProductionBreeder);
    app.post(`${process.env.MICRO_SERVICE}/api/get-data`, auth,  allocation.getData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name-data`,auth,   allocation.getcropNameData);
    app.post(`${process.env.MICRO_SERVICE}/api/filter-crop-name-data`,  auth, allocation.allocationSeedProductionBreederGroupedLists);
    app.post(`${process.env.MICRO_SERVICE}/api/update-icar-freeze-data`, auth,  allocation.updateIcarFreezeData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-coordination-name`,auth,   allocation.getCoOrdinationName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-coordination-name-crop-model`,allocation.getCoOrdinationNameCropModel);
    app.post(`${process.env.MICRO_SERVICE}/api/get-filter-data`, auth,  allocation.getIndenterDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indenter-crop-name`,auth,   allocation.getIndenterCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indenter-crop-group`,   auth,allocation.getIndenterCropGroup);

};