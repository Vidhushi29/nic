const BspcToPlantsController = require("../controllers/bspc_to_plants.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/create_bspc_to_plants`, auth, BspcToPlantsController.create);
    app.post(`${process.env.MICRO_SERVICE}/api/update_bspc_to_plants`, auth, BspcToPlantsController.update);
    app.post(`${process.env.MICRO_SERVICE}/api/get_plants_data_for_bsp4`, auth, BspcToPlantsController.get_plants_data_for_bsp4);
    app.post(`${process.env.MICRO_SERVICE}/api/get_plants_data_for_lot_number`, auth, BspcToPlantsController.get_plants_data_for_lot_number);

};