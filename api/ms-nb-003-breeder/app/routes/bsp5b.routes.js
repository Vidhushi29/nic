const bsp5b = require("../controllers/bsp5b.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b-year-crop`, auth, bsp5b.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b-variety`, auth, bsp5b.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b-proforma`, auth, bsp5b.bsp5Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b-variety-list`, auth, bsp5b.bsp5ProformaVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b-label-number`, auth, bsp5b.labelNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp5b-list`, auth, bsp5b.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5b/:id`, auth, bsp5b.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp5b`, auth, bsp5b.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp5b`, auth, bsp5b.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp5b/:id`, auth, bsp5b.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP5b`, auth, bsp5b.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP5b`, auth, bsp5b.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSP5b`, auth, bsp5b.getCropDataForBSPForm);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP5bList`, auth, bsp5b.getYearDataForBSP5bList);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP5bList`, auth, bsp5b.getSeasonDataForBSP5bList);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP5bList`, auth, bsp5b.getCropGroupDataForBSP5bList);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP5bList`, auth, bsp5b.getCropsDataForBSP5bList);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP5bList`, auth, bsp5b.getVarietiesDataForBSP5bList);
};