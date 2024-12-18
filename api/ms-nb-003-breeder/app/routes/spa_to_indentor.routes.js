const SPAToIndentor = require("../controllers/spa_to_indentor.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/spaToIndentor/getAgencyData`, auth, SPAToIndentor.getAgencyData);
    app.post(`${process.env.MICRO_SERVICE}/api/spaToIndentor/getAllIndentor`, auth, SPAToIndentor.fetch);
    app.post(`${process.env.MICRO_SERVICE}/api/spaToIndentor/updateAsIndentor`, auth, SPAToIndentor.update);
    app.post(`${process.env.MICRO_SERVICE}/api/spaToIndentor/removeAsIndentor`, auth, SPAToIndentor.remove);
};