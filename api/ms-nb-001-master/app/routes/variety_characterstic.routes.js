const varietyCharacterstic = require("../controllers/variety_characterstic.controller.js");
const auth = require('../_middleware/auth');
const apiValidation = require('../_middleware/api-validation');
require('dotenv').config()

module.exports = app => {
    // characterstic new api's
    app.post(`${process.env.MICRO_SERVICE}/api/get-agro-ecological-regions-state-wise`, varietyCharacterstic.getAgroEcologicalRegionsStateWise)
    app.post(`${process.env.MICRO_SERVICE}/api/get-muturity-days`, varietyCharacterstic.getMuturityDays)
    app.post(`${process.env.MICRO_SERVICE}/api/get-climate-resilience`, varietyCharacterstic.getCimateResilience)
    app.post(`${process.env.MICRO_SERVICE}/api/get-reaction-to-major-diseases-data`, varietyCharacterstic.getReactionToMajorDiseasesData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-reaction-to-major-insect-pests-data`, varietyCharacterstic.getReactionToMajorInsectPestsData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-state-by-bspc`, varietyCharacterstic.getStateByBspc)
};

