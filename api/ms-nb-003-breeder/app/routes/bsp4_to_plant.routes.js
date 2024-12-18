const Bsp4ToPlantsController = require("../controllers/bsp4_to_plant.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/create_bsp4_to_plants`, auth, Bsp4ToPlantsController.create);
    app.post(`${process.env.MICRO_SERVICE}/api/update_bsp4_to_plants`, auth, Bsp4ToPlantsController.update);

    app.post(`${process.env.MICRO_SERVICE}/api/getSPPDataForLotNumber`, auth, Bsp4ToPlantsController.getSPPDataForLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/getQuantityOfSPPDataForLotNumber`, auth, Bsp4ToPlantsController.getQuantityOfSPPDataForLotNumber);

    app.post(`${process.env.MICRO_SERVICE}/api/getVarietyDataForLotNumberFromPlantData`, auth, Bsp4ToPlantsController.getVarietyData);
    app.post(`${process.env.MICRO_SERVICE}/api/getVarietyDataForLotNumberFromBSP4`, auth, Bsp4ToPlantsController.getData);
    app.post(`${process.env.MICRO_SERVICE}/api/plants/getPlantsData`, auth, Bsp4ToPlantsController.getPlantsData);

};
