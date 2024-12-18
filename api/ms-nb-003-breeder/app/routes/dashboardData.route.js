const DashboardData = require("../controllers/dashboardData.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/dashboardData/create`, DashboardData.create);

    app.post(`${process.env.MICRO_SERVICE}/api/dashboardData/fetch`, auth, DashboardData.fetch);


};
