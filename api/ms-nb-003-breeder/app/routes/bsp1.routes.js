const bsp1 = require("../controllers/bsp1.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp1-year-crop`, auth, bsp1.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp1-variety`, auth, bsp1.varietyList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp1-list`, auth, bsp1.getAll);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bsp1/:id`, auth, bsp1.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bsp1`, auth, bsp1.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp1`, auth, bsp1.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp1/:id`, auth, bsp1.delete);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForBSP1List`, auth, bsp1.getYearDataForBSP1List);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForBSP1List`, auth, bsp1.getSeasonDataForBSP1List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropGroupDataForBSP1List`, auth, bsp1.getCropGroupDataForBSP1List);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForBSP1List`, auth, bsp1.getCropsDataForBSP1List);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForBSP1List`, auth, bsp1.getVarietiesDataForBSP1List);
    app.get(`${process.env.MICRO_SERVICE}/api/bsp/fetchCropNameByYearAndSeason`, auth,bsp1.fetchCropNameByYearAndSeason);
};