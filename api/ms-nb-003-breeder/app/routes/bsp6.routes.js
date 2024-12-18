const bsp6 = require("../controllers/bsp6.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp6-year-crop`, auth, bsp6.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp6-variety`, auth, bsp6.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp6-proforma`, auth, bsp6.bsp6Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp6-variety-list`, auth, bsp6.bsp6ProformaVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp6-list`, auth, bsp6.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp6/:id`, auth, bsp6.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp6`, auth, bsp6.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp6`, auth, bsp6.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp6/:id`, auth, bsp6.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP6`, auth, bsp6.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP6`, auth, bsp6.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSP6`, auth, bsp6.getCropDataForBSPForm);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP6List`, auth, bsp6.getYearDataForBSP6List);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP6List`, auth, bsp6.getSeasonDataForBSP6List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP6List`, auth, bsp6.getCropGroupDataForBSP6List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP6List`, auth, bsp6.getCropsDataForBSP6List);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP6List`, auth, bsp6.getVarietiesDataForBSP6List);
}