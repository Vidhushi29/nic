const indenter = require("../controllers/indenter.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-list`, auth, indenter.fetchCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-year`, auth, indenter.fetchYear);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-by-year`, auth, indenter.fetchCropByYear);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-varieties-list`, auth, indenter.fetchCropVarieties);
    app.get(`${process.env.MICRO_SERVICE}/api/get-production-center-name`, auth, indenter.productionCenterName);
    app.get(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed`, auth, indenter.fetchNucleusSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seeds-submission-list`, auth, indenter.getBreederSeedsSubmisionList);

    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroup`, auth, indenter.getCropGroup);


    app.get(`${process.env.MICRO_SERVICE}/api/fetchSeasonByCrop`, auth, indenter.fetchSeasonByCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/fetchCropGroup`, auth, indenter.fetchCropGroup);
    app.get(`${process.env.MICRO_SERVICE}/api/fetchCropName`, auth, indenter.fetchCropName);

    app.get(`${process.env.MICRO_SERVICE}/api/fetchCropNameByYearAndSeason`, auth,indenter.fetchCropNameByYearAndSeason);

    app.post(`${process.env.MICRO_SERVICE}/api/fetchVarietyForSeedTestingResult`, auth,indenter.fetchVarietyForSeedTestingResult);
};