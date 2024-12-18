const bsp5a = require("../controllers/bsp5a.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5a-year-crop`, auth, bsp5a.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5a-variety`, auth, bsp5a.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5a-proforma`, auth, bsp5a.bsp5Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5a-variety-list`, auth, bsp5a.bsp5ProformaVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp5a-list`, auth, bsp5a.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp5a/:id`, auth, bsp5a.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp5a`, auth, bsp5a.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp5a`, auth, bsp5a.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp5a/:id`, auth, bsp5a.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP5a`, auth, bsp5a.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP5a`, auth, bsp5a.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSP5a`, auth, bsp5a.getCropDataForBSPForm);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP5aList`, auth, bsp5a.getYearDataForBSP5aList);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP5aList`, auth, bsp5a.getSeasonDataForBSP5aList);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP5aList`, auth, bsp5a.getCropGroupDataForBSP5aList);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP5aList`, auth, bsp5a.getCropsDataForBSP5aList);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP5aList`, auth, bsp5a.getVarietiesDataForBSP5aList);
};