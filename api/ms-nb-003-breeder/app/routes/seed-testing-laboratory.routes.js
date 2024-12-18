const SeedTestingReports = require("../controllers/seed_testing_reports.controller");
const auth = require("../_middleware/auth");
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/getAllSeedTestingReports/:id`, auth, SeedTestingReports.getAll);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeedTestingReportsById/:id`, auth, SeedTestingReports.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/getDataforlabelNumberforBreederSeed`, auth, SeedTestingReports.getDataforlabelNumberforBreederSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/createSeedTestingReports`, auth, SeedTestingReports.create);
    app.post(`${process.env.MICRO_SERVICE}/api/updateSeedTestingReports`, auth, SeedTestingReports.update);
    app.post(`${process.env.MICRO_SERVICE}/api/deleteSeedTestingReports/:id`, auth, SeedTestingReports.delete);


    app.get(`${process.env.MICRO_SERVICE}/api/getYearDataForSeedTestingReports`, auth, SeedTestingReports.getYearDataForSeedTestingReports);
    app.get(`${process.env.MICRO_SERVICE}/api/getSeasonDataForSeedTestingReports`, auth, SeedTestingReports.getSeasonDataForSeedTestingReports);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsDataForSeedTestingReports`, auth, SeedTestingReports.getCropsDataForSeedTestingReports);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForSeedTestingReports`, auth, SeedTestingReports.getVarietiesDataForSeedTestingReports);
    app.post(`${process.env.MICRO_SERVICE}/api/getReportDataForSeedTestingReports`, auth, SeedTestingReports.getReportDataForSeedTestingReports);
    app.post(`${process.env.MICRO_SERVICE}/api/getVarietiesDataForSeedTestingReportsSecond`, auth, SeedTestingReports.getVarietiesDataForSeedTestingReportsSecond);

};