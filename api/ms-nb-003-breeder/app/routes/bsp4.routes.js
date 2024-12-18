const bsp4 = require("../controllers/bsp4.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp4-year-crop`, auth, bsp4.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp4-variety`, auth, bsp4.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp4-proforma`, auth, bsp4.bsp4Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp4-variety-list`, auth, bsp4.bsp4ProformaVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp4-list`, auth, bsp4.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp4/:id`, auth, bsp4.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp4`, auth, bsp4.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp4`, auth, bsp4.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp4/:id`, auth, bsp4.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP4`, auth, bsp4.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP4`, auth, bsp4.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSP4`, auth, bsp4.getCropDataForBSPForm);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP4List`, auth, bsp4.getYearDataForBSP4List);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP4List`, auth, bsp4.getSeasonDataForBSP4List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP4List`, auth, bsp4.getCropGroupDataForBSP4List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP4List`, auth, bsp4.getCropsDataForBSP4List);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP4List`, auth, bsp4.getVarietiesDataForBSP4List);
};