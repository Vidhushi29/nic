const LabelNumberForBreederSeedController = require("../controllers/label_number_for_breederseed.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/getAllLabelNumberForBreederSeed`, auth, LabelNumberForBreederSeedController.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/getLabelNumberForBreederSeedById/:id`, auth, LabelNumberForBreederSeedController.getById);
    app.get(`${process.env.MICRO_SERVICE}/api/getAllLabelNumberForBreederSeedbyLotNumber`, auth, LabelNumberForBreederSeedController.fetchwithLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/createLabelNumberForBreederSeed`, auth, LabelNumberForBreederSeedController.create);
    app.post(`${process.env.MICRO_SERVICE}/api/updateLabelNumberForBreederSeed`, auth, LabelNumberForBreederSeedController.update);
    app.post(`${process.env.MICRO_SERVICE}/api/deleteLabelNumberForBreederSeed/:id`, auth, LabelNumberForBreederSeedController.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getQuantityOfAllLabelNumber`, auth, LabelNumberForBreederSeedController.getQuantityOfAllLabelNumber);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForLabelNumber`, auth, LabelNumberForBreederSeedController.getYearDataForLabelNumber);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForLabelNumber`, auth, LabelNumberForBreederSeedController.getSeasonDataForLabelNumber);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForLabelNumber`, auth, LabelNumberForBreederSeedController.getCropsDataForLabelNumber);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForLabelNumber`, auth, LabelNumberForBreederSeedController.getVarietiesDataForLabelNumber);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForLabelNumberSecond`, auth, LabelNumberForBreederSeedController.getVarietiesDataForLabelNumberSecond);

};