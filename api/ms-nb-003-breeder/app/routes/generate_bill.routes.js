const generateBill = require("../controllers/genrate_bill");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-year`, auth, generateBill.getYear);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-season`, auth, generateBill.fetchSeasonByCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-crop-list`, auth, generateBill.getCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-variety`, auth, generateBill.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-indentors`, auth, generateBill.getIndentors);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-variety-list`,auth,  generateBill.breederProformaVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill-label-number`,auth,  generateBill.labelNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/add-generate-bill`, auth, generateBill.create);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-bill-list`, auth, generateBill.fetch);

    app.post(`${process.env.MICRO_SERVICE}/api/certificate-generated`, auth, generateBill.isCertificateGenerated);
    app.get(`${process.env.MICRO_SERVICE}/api/certificate-generated/:id`, auth, generateBill.generateCertificate);
    app.get(`${process.env.MICRO_SERVICE}/api/generateCertificateSecond/:id`, auth, generateBill.generateCertificateSecond);
    app.get(`${process.env.MICRO_SERVICE}/api/get-generate-bill/:id`, auth, generateBill.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-generate-bill`, auth, generateBill.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-generate-bill/:id`,auth,  generateBill.delete);
    app.post(`${process.env.MICRO_SERVICE}/api/get-serial-number`, auth, generateBill.getSerialNumber);

    app.get(`${process.env.MICRO_SERVICE}/api/year-generate-bill`, auth, generateBill.getYearData);
    app.get(`${process.env.MICRO_SERVICE}/api/season-generate-bill`, auth, generateBill.getSeasonData);
    app.get(`${process.env.MICRO_SERVICE}/api/cropgroup-generate-bill`, auth, generateBill.getCropGroupData);
    app.get(`${process.env.MICRO_SERVICE}/api/crop-generate-bill`, auth, generateBill.getCropsData);
    app.get(`${process.env.MICRO_SERVICE}/api/varieties-generate-bill`, auth, generateBill.getVarietiesData);
    app.get(`${process.env.MICRO_SERVICE}/api/spa-list`, auth, generateBill.getSPA);
    app.post(`${process.env.MICRO_SERVICE}/api/getSpaUserList`, auth, generateBill.getSpaUserList);
    app.post(`${process.env.MICRO_SERVICE}/api/update-bill-payment-status`, auth, generateBill.updateBillPaymentStatus);
    app.post(`${process.env.MICRO_SERVICE}/api/getGenerateBillData`, auth, generateBill.getGenerateBillData);

}