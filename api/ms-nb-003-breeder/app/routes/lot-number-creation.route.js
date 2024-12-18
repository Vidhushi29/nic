const LotNumberController = require("../controllers/lot-number-creation.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/lotNumberCreation/getLotNumberData`, auth, LotNumberController.fetch);
};