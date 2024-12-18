const breederCertificate = require("../controllers/breeder_certificate.controller");
const auth = require('../_middleware/auth');
require('dotenv').config();

module.exports = app => {

    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-data-indentor-year-crop`, auth, breederCertificate.yearAndCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-data-indentor-variety`, auth, breederCertificate.varietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-indentors`, auth, breederCertificate.getIndentors);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate`, auth, breederCertificate.getByUser);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-crop-name`, auth, breederCertificate.getCropName);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-variety-name`, auth, breederCertificate.getVarietyName);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-variety-list`, auth, breederCertificate.breederProformaVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-list`, auth, breederCertificate.fetch);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate/:id`, auth, breederCertificate.getById);
    app.post(`${process.env.MICRO_SERVICE}/api/add-breeder-certificate`, auth, breederCertificate.create);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-breeder-certificate`, auth, breederCertificate.update);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-breeder-certificate/:id`, auth, breederCertificate.delete);
    app.get(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-crop-list`, auth, breederCertificate.getCropList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-certificate-serial-number`, auth, breederCertificate.getbreedercertificateSerialNumber);

}