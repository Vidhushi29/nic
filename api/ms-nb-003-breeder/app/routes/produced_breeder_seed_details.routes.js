const ProducedBreederSeedDetailsController = require("../controllers/produced_breeder_seed_details.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getYearsData);
    app.post(`${process.env.MICRO_SERVICE}/api/getSeasonDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getCropGroupData);
    app.post(`${process.env.MICRO_SERVICE}/api/getCropDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getCropData);

    app.post(`${process.env.MICRO_SERVICE}/api/getPageDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getPageData);
    app.post(`${process.env.MICRO_SERVICE}/api/getBSPDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getBSPData);
    app.post(`${process.env.MICRO_SERVICE}/api/getLabelNumberDataForProducedBreederSeedDetails`, auth, ProducedBreederSeedDetailsController.getLabelNumberData);


    app.post(`${process.env.MICRO_SERVICE}/api/AllocationOfBreederSeedsToIndentorsLifting/getCropData`, auth, ProducedBreederSeedDetailsController.getCropDataForSeedReport);
    app.post(`${process.env.MICRO_SERVICE}/api/AllocationOfBreederSeedsToIndentorsLifting/getPageData`, auth, ProducedBreederSeedDetailsController.getPageDataForSeedReport);
    app.post(`${process.env.MICRO_SERVICE}/api/AllocationOfBreederSeedsToIndentorsLifting/getLiftingData`, auth, ProducedBreederSeedDetailsController.getAllAllocationToIndentorProductionCenterSeedData);

    app.post(`${process.env.MICRO_SERVICE}/api/AllocationOfBreederSeedsToIndentorsLifting/getIndentData`, auth, ProducedBreederSeedDetailsController.getIndentDataForSeedReport);
    app.post(`${process.env.MICRO_SERVICE}/api/getYearDataForProducedBreederSeedDetailsSecond`, auth, ProducedBreederSeedDetailsController.getYearsDataSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getSeasonDataproductionSecond`, auth, ProducedBreederSeedDetailsController.getSeasonDataproductionSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getCropGroupDataProductionSecond`, auth, ProducedBreederSeedDetailsController.getCropGroupDataProductionSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getCropDataProductionseedSecond`, auth, ProducedBreederSeedDetailsController.getCropDataProductionseedSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getproductionSeedData`, auth, ProducedBreederSeedDetailsController.getproductionSeedData);
    app.post(`${process.env.MICRO_SERVICE}/api/forward`, auth, ProducedBreederSeedDetailsController.forward);
};