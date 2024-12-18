const GeneratedLabelNumber = require("../controllers/generated_label_number.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/getAllGeneratedLabelNumber`, auth, GeneratedLabelNumber.getAll);
    app.get(`${process.env.MICRO_SERVICE}/api/getAllGeneratedLabelNumberByUserId`, auth, GeneratedLabelNumber.getAllGeneratedLabelNumberByUserId);
    app.get(`${process.env.MICRO_SERVICE}/api/getGeneratedLabelNumberById`, auth, GeneratedLabelNumber.getById);
    app.get(`${process.env.MICRO_SERVICE}/api/getGeneratedLabelNumberByLabelNumberForBreederseedId`, auth, GeneratedLabelNumber.getGeneratedLabelNumberByLabelNumberForBreederseedId);
    app.post(`${process.env.MICRO_SERVICE}/api/createGeneratedLabelNumber`, auth, GeneratedLabelNumber.create);
    app.post(`${process.env.MICRO_SERVICE}/api/updateGeneratedLabelNumber`, auth, GeneratedLabelNumber.update);
    app.post(`${process.env.MICRO_SERVICE}/api/deleteGeneratedLabelNumber`, auth, GeneratedLabelNumber.delete);
};