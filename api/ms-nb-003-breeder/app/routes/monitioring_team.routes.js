const monitoringTeam = require("../controllers/monitoring_team.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-monitoring-team-list`, auth, monitoringTeam.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-monitoring-team/:id`, auth, monitoringTeam.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-monitoring-team`, auth, monitoringTeam.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-monitoring-team`, auth, monitoringTeam.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-monitoring-team/:id`, auth, monitoringTeam.delete);
};