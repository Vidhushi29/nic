const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const fileUpload = require('../_helpers/upload');
const {
    allocationToIndentor,
    bsp1Model,
    bsp4Model,
    bsp5bModel,
    bsp6Model,
    cropModel,
    indenterModel,
    varietyModel,
    userModel,
    bsp2Model,
    breederCertificate,
    labelNumberForBreederseed,
    generatedLabelNumberModel,
    seasonModel,
    bsp3Model
} = require('../models');

class breederCertificateController {

    static yearAndCropList = async (req, res) => {
        let condition = {
            attributes: ['id', 'year', 'crop_code'],
            include: {
                model: cropModel,
                left: true,
                attributes: ['crop_name'],
            },
            raw: true,
            nest: true,
        };
        const breederCertificateData = await breederCertificate.findAll(condition);
        if (!(breederCertificateData && breederCertificateData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await breederCertificateData.filter(element => {
            const cropCode = uniqueCrops.includes(element.crop_code);
            const year = uniqueYear.includes(element.year);
            if (!cropCode) {
                uniqueCrops.push(element.crop_code);
                crops.push({
                    value: element.crop_code,
                    name: element.m_crop.crop_name
                });
            }
            if (!year) {
                uniqueYear.push(element.year);
                years.push({
                    name: element.year,
                    value: element.year
                });
            }
            return false;
        });
        obj['years'] = years;
        obj['crops'] = crops;

        return response(res, status.DATA_AVAILABLE, 200, obj);

    }

    static varietyList = async (req, res) => {
        const { yearOfIndent: year, cropName } = req.query;
        let condition = {
            attributes: ['id', 'variety_id'],
            include: {
                model: varietyModel,
                left: true,
                attributes: ['variety_name'],
            },
            where: {
                year: year,
                crop_code: cropName,
            },
            raw: true,
            nest: true,
        };
        const breederCertificateDataVarietyData = await breederCertificate.findAll(condition);
        if (!(breederCertificateDataVarietyData && breederCertificateDataVarietyData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await breederCertificateDataVarietyData.filter(element => {
            const varieties = uniqueVariety.includes(element.variety_id);
            if (!varieties) {
                uniqueVariety.push(element.variety_id);
                variety.push({
                    value: element.variety_id,
                    name: element.m_crop_variety.variety_name
                });
            }
            return false;
        });
        obj['variety'] = variety;
        return response(res, status.DATA_AVAILABLE, 200, obj);

    }


    static getIndentors = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName: crop_code, cropVariety: variety_id } = req.query;
            const condition = {
                attributes: ['id'],
                include: {
                    attributes: ['id', 'name'],
                    model: userModel,
                    left: true,
                },
                where: {
                    year,
                    crop_code,
                    variety_id,
                },
                raw: true,
                nest: true,
            };

            const indentorData = await indenterModel.findAll(condition);

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, indentorData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getCropList = async (req, res) => {
        try {
            const { yearOfIndent: year } = req.query;
            const condition = {
                attributes: ['id', 'crop_code'],
                include: {
                    attributes: ['id', 'crop_name'],
                    model: cropModel,
                    left: true,
                },
                where: {
                    year
                },
                raw: true,
                nest: true,
            };

            const indentorData = await indenterModel.findAll(condition);

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const uniqueCrops = [];
            const crops = [];
            const data = await indentorData.filter(element => {
                const isExist = uniqueCrops.includes(element.crop_code);
                if (!isExist) {
                    uniqueCrops.push(element.crop_code);
                    crops.push({
                        crop_code: element.crop_code,
                        'm_crop.id': element.m_crop.id,
                        'm_crop.crop_name': element.m_crop.crop_name
                    });
                }
                return false;
            });

            return response(res, status.DATA_AVAILABLE, 200, crops);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getCropName = async (req, res) => {
        try {
            const { yearOfIndent: year, indentorId: id } = req.query;
            const condition = {
                attributes: ['id'],
                include: {
                    attributes: ['id', 'crop_name'],
                    model: cropModel,
                    left: true,
                },
                where: {
                    id,
                    year
                },
                raw: true,
                nest: true,
            };

            const indentorData = await indenterModel.findAll(condition);

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, indentorData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getVarietyName = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName: crop_code } = req.query;
            const condition = {
                attributes: ['id'],
                include: {
                    attributes: ['id', 'variety_name'],
                    model: varietyModel,
                    left: true,
                },
                where: {
                    crop_code,
                    year
                },
                raw: true,
                nest: true,
            };

            const indentorData = await indenterModel.findAll(condition);

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, indentorData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static breederProformaVariety = async (req, res) => {
        try {
            const { yearOfIndent: year, indentorId: id, cropName: crop_code, cropVariety: variety_id } = req.query;
            const condition = {
                attributes: ['id', 'crop_code', 'indent_quantity', 'variety_id', 'year'],
                include: [
                    {
                        attributes: ['id', 'season'],
                        model: cropModel,
                        left: true,
                    },
                    {
                        attributes: ['variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                    {
                        attributes: ['name'],
                        model: userModel,
                        left: true,
                    },
                ],
                where: {
                    id,
                    crop_code,
                    variety_id,
                    year,
                },
                nest: true,
                raw: true,
            };

            let indentorData = await indenterModel.findAll(condition);
            indentorData = await Promise.all(indentorData.map(async element => {
                const seasonName = await seasonModel.findOne({
                    attributes: ['season'],
                    where: {
                        season_code: element.m_crop.season
                    },
                    raw: true,
                });
                element.m_crop.season = seasonName;
                return element;
            }));
            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const updatedData = await Promise.all(indentorData.map(async data => {
                const bsp1Data = await this.bsp1Data(data.id);
                const labels = await this.bsp5bData(id);
                data.yearOfProduction = bsp1Data.yearOfProduction;
                data.dateOfInspection = bsp1Data.dateOfInspection;
                data.bsp5bLabels = labels;
                if (data.upload) {
                    const upload = await fileUpload.download({ name: data.upload, res });
                    data.upload = upload;
                }
                return data;
            }));
            return response(res, status.DATA_AVAILABLE, 200, updatedData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static bsp1Data = async (indentOfBreederseedId) => {
        try {
            const bsp1Data = await bsp1Model.findOne({
                attributes: ['id'],
                where: {
                    indent_of_breederseed_id: indentOfBreederseedId,
                },
                include: {
                    attributes: ['id', 'expected_availbility'],
                    model: bsp2Model,
                    left: true,
                    include: {
                        attributes: ['id', 'date_of_inspection'],
                        model: bsp3Model,
                        left: true,
                    }
                },
                raw: true,
                nest: true,
            });
            const yearOfProduction = bsp1Data?.bsp_2?.expected_availbility;
            const dateOfInspection = bsp1Data?.bsp_2?.bsp_3?.date_of_inspection;
            console.log('bsp1Data', bsp1Data);
            return {
                yearOfProduction,
                dateOfInspection
            };
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static bsp5bData = async (indentOfBreederseedId) => {
        try {
            const bsp5bData = await bsp5bModel.findOne({
                attributes: ['id', 'label_number'],
                where: {
                    indent_of_breederseed_id: indentOfBreederseedId,
                },
                raw: true,
                nest: true,
            });

            const labelNumber = bsp5bData.label_number.split(',');
            const data = await Promise.all(labelNumber.map(async label => {
                const generatedLabelNumber = await generatedLabelNumberModel.findOne({
                    attributes: ['id', 'label_number_for_breeder_seeds', 'generated_label_name'],
                    where: {
                        id: label,
                    },
                    include: {
                        attributes: ['id', 'lot_number', 'weight'],
                        model: labelNumberForBreederseed,
                        left: true,
                    },
                    raw: true,
                    nest: true,
                });
                return generatedLabelNumber;
            }));
            return data;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static fetch = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName, cropVariety, userId } = req.query;

            let condition = {};

            if (userId) {
                condition = {
                    where: {
                        user_id: userId,
                    },
                    raw: true,
                    nest: true,
                };
            }

            if (year && cropName && cropVariety) {
                condition = {
                    where: {
                        year: year,
                        crop_code: cropName,
                        variety_id: cropVariety,
                        user_id: userId
                    },
                    raw: true,
                    nest: true,
                };
            }

            const bsp6Data = await bsp6Model.findAll(condition);
            if (!bsp6Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, bsp6UpdatedData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getById = async (req, res) => {
        try {
            const { id = "" } = req.params;
            const condition = {
                include: [
                    {
                        attributes: ['variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'created_by'],
                        model: userModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'crop_name'],
                        model: indenterModel,
                        left: true,
                        include: {
                            attributes: ['id', 'name'],
                            model: userModel,
                            left: true,
                        }
                    }
                ],
                where: {
                    id,
                },
                raw: true,
                nest: true,
            };
            const data = await breederCertificate.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const labels = await this.bsp5bData(data.indent_of_breederseed_id);
            const user = await userModel.findOne({
                attributes: ['id', 'name'],
                where: {
                    id: data.user.created_by
                },
                raw: true
            });
            // if (data.upload) {
            //     const extension = data.upload.split('.').pop();
            //     const allowedFile = ['jpg', 'png', 'gif', 'jpeg', 'pdf'];
            //     let document;
            //     if (allowedFile.includes(extension)) {
            //         const fileType = fileUpload.allowedFile({ extension });
            //         document = await fileUpload.download({ name: data.upload, extension });
            //         console.log(document);
            //         data.upload = document || "";
            //     }
            //     data.upload = document || "";
            // }
            data.label = labels;
            data.user = user;
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getByUser = async (req, res) => {
        try {
            const {
                cropName,
                cropVariety,
                indentorId,
                userId,
                yearOfIndent: year
            } = req.query;
            const condition = {
                where: {
                    crop_code: cropName,
                    indent_of_breederseed_id: indentorId,
                    user_id: userId,
                    variety_id: cropVariety,
                    year: year
                },
                raw: true,
            };
            const data = await breederCertificate.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static create = async (req, res) => {
        try {
            const formData = req.body;

            const rules = {
                'data.*.bill_number': 'required|string',
                'data.*.crop_code': 'required|string',
                'data.*.date_of_bill': 'required|string',
                'data.*.date_of_inspection': 'required|string',
                'data.*.generation_date': 'required|string',
                'data.*.indent_of_breederseed_id': 'required|integer',
                'data.*.is_active': 'required|integer',
                'data.*.label_number': 'required|string',
                'data.*.left_over_amount': 'required|string',
                'data.*.net_weight': 'required|integer',
                'data.*.season': 'required|string',
                'data.*.upload': 'required|string',
                'data.*.user_id': 'required|integer',
                'data.*.variety_id': 'required|integer',
                'data.*.year': 'required|integer',
                'data.*.year_of_production': 'required|string', 

            };

            const validation = new Validator(formData, rules);
            const isValidData = validation.passes();

            if (!isValidData) {
                const errorResponse = {};
                for (let key in rules) {
                    const error = validation.errors.get(key);
                    if (error.length) {
                        errorResponse[key] = error;
                    }
                }
                return response(res, status.BAD_REQUEST, 400, ((errorResponse && errorResponse.length) || isValidData));
            }

            const dataToInsert = await Promise.all(formData.map(async (data) => {

                const isExist = await breederCertificate.findOne({
                    where: {
                        year: data.year,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                    }
                    
                });

                if (isExist && Object.keys(isExist).length) {
                 
                    throw new Error(status.DATA_ALREADY_EXIST);
                }
                let upload;
                if (!(data.hasOwnProperty("upload") && data.upload.hasOwnProperty("photo") && Object.keys(data.upload).length)) {
                    upload = "";
                } else {
                    const document = await fileUpload.uploadImage({ upload: data.upload });
                    upload = document || "";
                }

                return {
                    bill_number: data.bill_number,
                    crop_code: data.crop_code,
                    date_of_bill: data.date_of_bill,
                    date_of_inspection: data.date_of_inspection,
                    generation_date: data.generation_date,
                    indent_of_breederseed_id: data.indent_of_breederseed_id,
                    is_active: data.is_active,
                    label_number: data.label_number,
                    left_over_amount: data.left_over_amount,
                    net_weight: data.net_weight,
                    season: data.season,
                    upload,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    year_of_production: data.year_of_production
                };
            }));
            const data = await breederCertificate.bulkCreate(dataToInsert);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static update = async (req, res) => {
        try {
            const formData = req.body;
            const rules = {
                'bill_number': 'required|string',
                'crop_code': 'required|string',
                'date_of_bill': 'required|string',
                'date_of_inspection': 'required|string',
                'generation_date': 'required|string',
                'id': 'required|integer',
                'indent_of_breederseed_id': 'required|integer',
                'is_active': 'required|integer',
                'label_number': 'required|string',
                'left_over_amount': 'required|string',
                'net_weight': 'required|integer',
                'season': 'required|string',
                'upload': 'required|string',
                'user_id': 'required|integer',
                'variety_id': 'required|integer',
                'year': 'required|integer',
                'year_of_production': 'required|string'
            };

            const validation = new Validator(formData, rules);
            const isValidData = validation.passes();
            if (!isValidData) {
                const errorResponse = {};
                for (let key in rules) {
                    const error = validation.errors.get(key);
                    if (error.length) {
                        errorResponse[key] = error;
                    }
                }
                return response(res, status.BAD_REQUEST, 400, errorResponse);
            }

            const condition = {
                where: {
                    id: formData.id
                }
            };
            const isExist = await breederCertificate.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                bill_number: formData.bill_number,
                crop_code: formData.crop_code,
                date_of_bill: formData.date_of_bill,
                date_of_inspection: formData.date_of_inspection,
                generation_date: formData.generation_date,
                indent_of_breederseed_id: formData.indent_of_breederseed_id,
                is_active: formData.is_active,
                label_number: formData.label_number,
                left_over_amount: formData.left_over_amount,
                net_weight: formData.net_weight,
                season: formData.season,
                upload: formData.upload,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                year_of_production: formData.year_of_production
            };
            const data = await breederCertificate.update(dataToUpdate, condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static delete = async (req, res) => {
        try {
            const condition = {
                where: {
                    id: req.params.id,
                }
            };
            const isExist = await breederCertificate.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await breederCertificate.destroy(condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getbreedercertificateSerialNumber = async (req, res) => {
        try {
            const formData = req.body;
            console.log(formData)
            const rules = {
                'bill_number': 'required|string',
                'crop_code': 'required|string',
                'date_of_bill': 'required|string',
                'date_of_inspection': 'required|string',
                'generation_date': 'required|string',
                'id': 'required|integer',
                'indent_of_breederseed_id': 'required|integer',
                'is_active': 'required|integer',
                'label_number': 'required|string',
                'left_over_amount': 'required|string',
                'net_weight': 'required|integer',
                'season': 'required|string',
                'upload': 'string',
                'user_id': 'required|integer',
                'variety_id': 'required|integer',
                'year': 'required|integer',
                'year_of_production': 'required|string',
                'serial_number_update':'required|integer'
            };

            const validation = new Validator(formData, rules);
            const isValidData = validation.passes();
            if (!isValidData) {
                const errorResponse = {};
                for (let key in rules) {
                    const error = validation.errors.get(key);
                    if (error.length) {
                        errorResponse[key] = error;
                    }
                }
                return response(res, status.BAD_REQUEST, 400, errorResponse);
            }

            const condition = {
                where: {
                    id: formData.id
                }
            };
            const isExist = await breederCertificate.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                bill_number: formData.bill_number,
                crop_code: formData.crop_code,
                date_of_bill: formData.date_of_bill,
                date_of_inspection: formData.date_of_inspection,
                generation_date: formData.generation_date,
                indent_of_breederseed_id: formData.indent_of_breederseed_id,
                is_active: formData.is_active,
                label_number: formData.label_number,
                left_over_amount: formData.left_over_amount,
                net_weight: formData.net_weight,
                season: formData.season,
                upload: formData.upload,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                year_of_production: formData.year_of_production,
                serial_number_update:formData.serial_number_update=='' || formData.serial_number_update==null ||
                formData.serial_number_update==undefined ? 1: parseInt(formData.serial_number_update) + 1
                
            };
            const data = await breederCertificate.update(dataToUpdate, condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
};

module.exports = breederCertificateController;
