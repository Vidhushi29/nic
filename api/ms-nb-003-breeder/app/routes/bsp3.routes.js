const bsp3 = require("../controllers/bsp3.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp3-year-crop`, auth, bsp3.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp3-variety`, auth, bsp3.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp3-proforma`, auth, bsp3.bsp3Proforma);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp3-variety-list`, auth, bsp3.bsp3ProformaFilter);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp3-list`, auth, bsp3.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp3/:id`, auth, bsp3.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp3`, auth, bsp3.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp3`, auth, bsp3.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp3/:id`, auth, bsp3.delete);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP3`, auth, bsp3.getYearDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP3`, auth, bsp3.getSeasonDataForBSPForm);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropDataForBSP3`, auth, bsp3.getCropDataForBSPForm);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP3List`, auth, bsp3.getYearDataForBSP3List);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP3List`, auth, bsp3.getSeasonDataForBSP3List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP3List`, auth, bsp3.getCropGroupDataForBSP3List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP3List`, auth, bsp3.getCropsDataForBSP3List);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP3List`, auth, bsp3.getVarietiesDataForBSP3List);
};