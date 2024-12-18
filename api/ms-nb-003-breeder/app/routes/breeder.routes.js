const breeder = require("../controllers/breeder.controller.js");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/add-breeder-production`, auth, breeder.addbreederProduction);
    app.post(`${process.env.MICRO_SERVICE}/api/update-indentor`, auth, breeder.updateIndentor);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-list`, auth, breeder.breederList);
    app.post(`${process.env.MICRO_SERVICE}/api/production-center-list`, auth, breeder.productionCenter);

    app.post(`${process.env.MICRO_SERVICE}/api/breeder-crop-list`, auth, breeder.breedercropList);

    // breedercropNewList
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-crop-new-list`, auth, breeder.breedercropNewList);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-crop-new-year`, auth, breeder.breedercropYear);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-crop-new-season`, auth, breeder.breedercropSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-crop-new-crop-name`, auth, breeder.breedercropName);
    app.post(`${process.env.MICRO_SERVICE}/api/filter-add-breeder-list-data`, auth, breeder.getbreederList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-agency-details`, auth, breeder.getAgencyDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, breeder.viewCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name`, auth, breeder.cropName);

    // shubham (mar-1-2023)(3:31 PM)
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-data`, auth, breeder.assignIndentingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-data`, auth, breeder.assignIndentingVarietyData);

    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-assign-indenter-data`, auth, breeder.cropAssignIndentingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-assign-indenter-data`, auth, breeder.sessionAssignIndentingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-assign-indenter-data`, auth, breeder.yearAssignIndentingData);


    app.post(`${process.env.MICRO_SERVICE}/api/delete-user`, auth, breeder.deleteUser);
    app.post(`${process.env.MICRO_SERVICE}/api/filter-crop-list-data`, auth, breeder.getTransactionsDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-crop-details/:id`, auth, breeder.deleteCropDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-add-crop-details`, auth, breeder.breederSeedssubmision);
    app.post(`${process.env.MICRO_SERVICE}/api/get-add-crop-details/:id`, auth, breeder.breederSeedssubmision);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seeds-submission/:id`, auth, breeder.getBreederSeedssubmisionWithId);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-submission/:id`, breeder.getBreedersSeedssubmisionWithId);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-crop-details/:id`, auth, breeder.deleteCropDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-breeder-crop-details/:id`, auth, breeder.deleteBreederCropDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/filter-breeder-crop-list-data`, auth, breeder.getBreederCropDetails);
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, breeder.viewCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-breeder/:id`, breeder.deleteBreederSeedssubmisionWithId);
    app.post(`${process.env.MICRO_SERVICE}/api/submit-indents-breeder-seeds-list`, auth, breeder.submitIndentsbreederseedslist);

    app.post(`${process.env.MICRO_SERVICE}/api/getUniqueIndentorOfBreederSeeds`, auth, breeder.getUniqueIndentorOfBreederSeeds);

    app.post(`${process.env.MICRO_SERVICE}/api/getDataForReceivedIndentsOfBreederSeeds`, auth, breeder.getDataForReceivedIndentsOfBreederSeeds);

    app.post(`${process.env.MICRO_SERVICE}/api/get-indents-breeder-list`, auth, breeder.indentslist);
    app.post(`${process.env.MICRO_SERVICE}/api/view-indentor`, auth, breeder.viewIndentor);
    app.post(`${process.env.MICRO_SERVICE}/api/view-indentor-breeder`, auth, breeder.viewIndentorBreeder);

    app.post(`${process.env.MICRO_SERVICE}/api/add-breeder`, auth, breeder.addBreeder);
    app.post(`${process.env.MICRO_SERVICE}/api/add-breeder-seed-list`, auth, breeder.addBreederSeedList);
    app.post(`${process.env.MICRO_SERVICE}/api/update-breeder-seed-list`, auth, breeder.updateBreederSeedList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-data`, auth, breeder.getData);
    app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-short-name`, auth, breeder.checkAlreadyExistsShortName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-dynamic-crop-code`, auth, breeder.getDynamicCropCode);

    app.post(`${process.env.MICRO_SERVICE}/api/edit-user-data`, auth, breeder.editUserData)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-user-data-production`, auth, breeder.editUserDataProduction)

    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-data-list`, auth, breeder.getCropVerietyDataList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-data-list`, auth, breeder.getCropVerietyDataList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-data`, auth, breeder.breedercropData)

    // 
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-data-filter`, auth, breeder.breedercropDataFilter)

    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-crop-name-data`, auth, breeder.getbreederCropNameList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-data-by-id`, auth, breeder.getDataofBreeder)

    // checkbreederSeedssubmisionData ==========================================
    app.post(`${process.env.MICRO_SERVICE}/api/check-breeder-submission-data`, auth, breeder.checkbreederSeedssubmisionData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-production-district`, auth, breeder.getBreederProductionCenterDistrict)
    app.post(`${process.env.MICRO_SERVICE}/api/get-received-indents-of-breeder-seeds-year`, auth, breeder.submitIndentsbreederseedsYear)
    app.post(`${process.env.MICRO_SERVICE}/api/get-received-indents-of-breeder-seeds-season`, auth, breeder.submitIndentsbreederseedsSeason)
    app.post(`${process.env.MICRO_SERVICE}/api/get-received-indents-of-breeder-seeds-crop-group`, auth, breeder.submitIndentsbreederseedsCropGroup)
    app.post(`${process.env.MICRO_SERVICE}/api/get-received-indents-of-breeder-seeds-crop-name`, auth, breeder.submitIndentsbreederseedsCropName)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indeter-details`, auth, breeder.getIndenterDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data`, auth, breeder.getChartIndentData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-data-by-crop`, auth, breeder.getChartDataByCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety`, auth, breeder.getVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-filter-data`, auth, breeder.getIndenterDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-count-bpc`, auth, breeder.getCountBPC);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-count-bpc`, auth, breeder.getBreederCountBPC);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-breeder-crop`, auth, breeder.getTotalBreederCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-allocated-prod-breeder-seed`, auth, breeder.getTotalAllocatedProdBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-pending-allocated-prod-breeder-seed`, auth, breeder.getTotalPendingAllocatedProdBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-pending-breeder-seed`, auth, breeder.getChartPendingBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-short-indenter-name`, auth, breeder.getShortIndenterName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-name-certificate-of-breeeder`,  breeder.getAddresssOfCertificate)
    app.post(`${process.env.MICRO_SERVICE}/api/get-name-certificate-of-breeeder-by-created-by`,  breeder.getAddresssOfCertificateByCreatedy)
    app.post(`${process.env.MICRO_SERVICE}/api/get-name-certificate-of-breeeder-by-agenct-table`,  breeder.getAddresssOfCertificateByAgencyTable)
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-crop-season`, auth, breeder.getAssignCropSeason)
    app.post(`${process.env.MICRO_SERVICE}/api/getLotnumberdata`, auth, breeder.getLotnumber);
    app.post(`${process.env.MICRO_SERVICE}/api/getCeritificateName`, auth, breeder.getCeritificateName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-spa-data`,auth, breeder.getSPAsAllData);
    app.post(`${process.env.MICRO_SERVICE}/api/getBreederProductrionList`,auth, breeder.getBreederProductrionList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nodal-card-qnt-details`, breeder.getNodalCardQntDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nodal-card-filter-crop-data`, breeder.getNodalFilterCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data-variety`,  breeder.getChartIndentDataVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data-crop`,  breeder.getChartIndentDataCrop);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-nodal-variety-count`,  breeder.getNodalVarietyCount);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-freeze-indent-quntity`,auth,  breeder.getFreezIndentQauntity);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-freeze-recieved-indent-quntity`,auth,  breeder.getFreezRecievedIndentQauntity);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-crop-reports`, auth,breeder.getAssignCropReports);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-created-lot-numbers-reports`, auth,breeder.getCreatedLotNumbersReports);
    app.post(`${process.env.MICRO_SERVICE}/api/seedtestingreportingapi`, breeder.seedtestingreportingapi);
    app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapi`, breeder.getBillGenerateCertificateapi);
    app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecond`,auth, breeder.getBillGenerateCertificateapiSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/seedtestingreportingapilotNumber`, breeder.seedtestingreportingapilotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/getTotalPendingAllocatedProdBreederSeedSecond`,auth, breeder.getTotalPendingAllocatedProdBreederSeedSecond);
    // app.post(`${process.env.MICRO_SERVICE}/api/getTotalPendingAllocatedProdBreederSeedSecond`,auth, breeder.getTotalPendingAllocatedProdBreederSeedSecond);

    // coardinator dashoboard api's
    app.post(`${process.env.MICRO_SERVICE}/api/get-actual-production`,auth, breeder.getActualProduction);
    app.post(`${process.env.MICRO_SERVICE}/api/cropAssignIndentingDataSecond`,auth, breeder.cropAssignIndentingDataSecond);
  
    //new api's willing to produced
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-assign-indenter-data-willing-produce`, auth, breeder.cropAssignIndentingWillingProduceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-assign-indenter-data-willing-produce`, auth, breeder.sessionAssignIndentingWillingProduceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-assign-indenter-data-willing-produce`, auth, breeder.yearAssignIndentingWillingProduceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-data-willing-produce`, auth, breeder.assignIndentingVarietyWillingProduceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-bspc-data-willing-produce`, auth, breeder.assignIndentingBspcWillingProduceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-all-data`, auth, breeder.assignIndentingVarietyAllData);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-all-data-second`, auth, breeder.assignIndentingVarietyAllDataSecond);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-filter-data`, auth, breeder.assignIndentingVarietyFilterData);    
    app.post(`${process.env.MICRO_SERVICE}/api/assign-crop-final-submit`, auth, breeder.assignCropFinalSubmit);    
    app.post(`${process.env.MICRO_SERVICE}/api/check-assign-crop-variety-availability`, auth, breeder.checkAssignCropVarietyAvailability);    
    app.post(`${process.env.MICRO_SERVICE}/api/get-assign-indenter-variety-data-willing-produce-second`, auth, breeder.assignIndentingVarietyWillingProduceDataSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-parental-data`, auth, breeder.getParentalData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-data-for-recieved-indent-second`, auth, breeder.getDataForReceivedIndentsOfBreederSeedsSecond);


};