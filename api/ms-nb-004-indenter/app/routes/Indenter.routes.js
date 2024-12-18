const indenters = require("../controllers/indenter.controller");
const auth = require('../_middleware/auth');
const apiValidation = require('../_middleware/api-validation');

// const redis = require('../_middleware/redis');
require('dotenv').config()
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-crop-name`, auth, indenters.IndentorCropName)
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-seeds-submission`, indenters.breederSeedssubmision);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-seeds-submission/:id`, auth, indenters.breederSeedssubmision);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seeds-submission/:id`, auth, indenters.getBreederSeedssubmisionWithId);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seeds-submission-list`, indenters.getBreederSeedsSubmisionList);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-breeder-seeds-submission/:id`, auth, indenters.deleteBreederSeedssubmisionWithId);
    app.get(`${process.env.MICRO_SERVICE}/api/test`, indenters.test)
    app.get(`${process.env.MICRO_SERVICE}/api/indetor-crop-group`, auth, indenters.IndentorCropGroup)
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-dashboard-crop-name`, auth, indenters.IndentorDashboardCropName)
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-dashboard-variety-name`, auth, indenters.IndentorDashboardVarietyName)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indeter-details`, auth, indenters.getIndenterDetails)
    app.post(`${process.env.MICRO_SERVICE}/api/get-filter-data`, auth, indenters.getIndenterDetails)
    app.post(`${process.env.MICRO_SERVICE}/api/get-count-data`, auth, indenters.getCountData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-lifted-count`, auth, indenters.getTotalLiftedCount)
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data`, auth, indenters.getChartIndentData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety`, auth, indenters.getVariety)
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-data-by-crop`, auth, indenters.getChartDataByCrop)

    app.post(`${process.env.MICRO_SERVICE}/api/indetor-year-list`, auth, indenters.IndentoryearList)
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-season-list`, auth, indenters.IndentorSeasonList)
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-crop-name-list`, auth, indenters.IndentorCropNameList)
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-variety-name-list`, auth, indenters.IndentorVarietyNameList)

    //submission of indent of spa 
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-report`, auth,indenters.getIndentOfSpaData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-year`,auth, indenters.getIndentOfSpaYear)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-report-count`,auth, indenters.getIndentOfSpaCountData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-season`,auth, indenters.getIndentOfSpaSeason)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-crop-group`, auth,indenters.getIndentOfSpaCropGroup)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-crop`,auth, indenters.getIndentOfSpaCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/freez-indent-of-spa-data`,auth, indenters.freezIndentOfSpaData)
    app.post(`${process.env.MICRO_SERVICE}/api/freez-indent-of-breederseed-data-from-spa`,auth, indenters.freezIndentOfBreederSeedData)



    app.post(`${process.env.MICRO_SERVICE}/api/getTotalNumberOfSPA`,auth, indenters.getTotalNumberOfSPA)
    app.post(`${process.env.MICRO_SERVICE}/api/getIndentOfBreederSeedDataForSPA`,auth, indenters.getIndentOfBreederSeedDataForSPA)

    // new api apr-26-2023 (variety-list,crop-list,all-indenter-list) 
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, indenters.viewCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-variety-list`, auth,  indenters.viewVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-indenter-list`,  auth, indenters.indenterLists);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-year-list`,auth, indenters.getindentoryearlist);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-year-list-second`,auth, indenters.getindentoryearlistSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-season-list`, auth, indenters.getindentorSeasonlist);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-season-list-second`,auth,  indenters.getindentorSeasonlistSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-cropGroup-list`,auth, indenters.getindentorCropGrouplist);
    app.post(`${process.env.MICRO_SERVICE}/api/getindentorCropTypelist`, auth, indenters.getindentorCropTypelist);
    app.post(`${process.env.MICRO_SERVICE}/api/getindentorCropTypelistSecond`,auth,  indenters.getindentorCropTypelistSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getindentorVarietylist`,auth, indenters.getindentorVarietylist);
    app.post(`${process.env.MICRO_SERVICE}/api/getindentorVarietylistNew`,auth, indenters.getindentorVarietylistNew);

    app.post(`${process.env.MICRO_SERVICE}/api/getIndentorCropWiseBreederSeed`,auth,  indenters.getIndentorCropWiseBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaWiseBreederSeed`,auth, indenters.getIndentorSpaWiseBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaNameBreederSeed`,auth, indenters.getIndentorSpaNameBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-spa-data`,auth, indenters.getSPAsAllData);
    app.post(`${process.env.MICRO_SERVICE}/api/getindentorCroplist`,auth, indenters.getindentorCroplist);
    app.post(`${process.env.MICRO_SERVICE}/api/check-isonboard-statewise`,auth, indenters.checkIsonboardStatewise);

    // new api get crop and variety (aug-29-2023)
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`,apiValidation,indenters.getCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-list`,apiValidation, indenters.getVarietyList);
};