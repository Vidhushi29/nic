const SPALiftingController = require("../controllers/spa-lifting.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/getStateDataForSPALifting`, auth, SPALiftingController.fetch);
    app.post(`${process.env.MICRO_SERVICE}/api/getSPADataForSPALifting`, auth, SPALiftingController.getSPAData);

    app.post(`${process.env.MICRO_SERVICE}/api/getCropDataForSPALifting`, auth, SPALiftingController.getCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/getVarietyDataForSPALifting`, auth, SPALiftingController.getVarietyData);


    app.post(`${process.env.MICRO_SERVICE}/api/createSPALiftingForm`, auth, SPALiftingController.create);

};