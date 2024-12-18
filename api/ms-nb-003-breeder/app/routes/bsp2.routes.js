const bsp2 = require("../controllers/bsp2.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp2-year-crop`, auth, bsp2.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp2-variety`, auth, bsp2.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp1-proforma`, auth, bsp2.bsp1Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp1-data`, auth, bsp2.bsp1Data);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-list`, auth, bsp2.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp2/:id`, auth, bsp2.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp2`, auth, bsp2.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp2`, auth, bsp2.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp2/:id`, auth, bsp2.delete);

    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSPForm`, auth, bsp2.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSPForm`, auth, bsp2.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSPForm`, auth, bsp2.getCropDataForBSPForm);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP2List`, auth, bsp2.getYearDataForBSP2List);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP2List`, auth, bsp2.getSeasonDataForBSP2List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP2List`, auth, bsp2.getCropGroupDataForBSP2List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP2List`, auth, bsp2.getCropsDataForBSP2List);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP2List`, auth, bsp2.getVarietiesDataForBSP2List);


};