const users = require("../controllers/user.controller.js");
const auth = require('../_middleware/auth');
require('dotenv').config()

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/add-state`, auth,  users.addState);
    app.get(`${process.env.MICRO_SERVICE}/api/get-state-list`, auth,  users.viewState);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-states`, auth,  users.getAllState);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-state`, auth,  users.editState);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-state`, auth,  users.deleteState);
    app.get(`${process.env.MICRO_SERVICE}/api/test`, users.test);
};