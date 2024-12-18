const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { generatedLabelNumber, lotNumberModel }  = require('../models');

class GeneratedLabelNumberController {
    static getAll = async (req, res) => {
        try {
            const data = await generatedLabelNumber.findAll();
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getAllGeneratedLabelNumberByUserId = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            const condition = {
                where: {
                    user_id: user_id,
                },
                attributes: ['unique_label_number'],
                order: [['unique_label_number', 'DESC']]
            };

            const data = await generatedLabelNumber.findAll(condition);
            
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log(error)
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
                where: {
                    id,
                },
            };
            let data = await generatedLabelNumber.findOne(condition);

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

    static getGeneratedLabelNumberByLabelNumberForBreederseedId = async (req, res) => {
        try {
            console.log(req)
            const { label_number_for_breeder_seeds = "" } = req.query;
            const condition = {
                where: {
                    label_number_for_breeder_seeds: label_number_for_breeder_seeds,
                },
               
            };
            let data = await generatedLabelNumber.findAll(condition);

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
            console.log(formData)

            const rules = {
                'data.*.label_number_for_breeder_seeds': 'required|integer',
                'data.*.generated_label_name': 'required|string',
                'data.*.weight': 'required|string',
                'data.*.user_id': 'required|integer',
                'data.*.unique_label_number': 'required|string',
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

            const result = await Promise.all(formData.map(data => {
                return {
                    label_number_for_breeder_seeds: data.label_number_for_breeder_seeds,
                    generated_label_name: data.generated_label_name,
                    weight: data.weight,
                    user_id: data.user_id,
                    unique_label_number: data.unique_label_number
                }
            }));

            const data = await generatedLabelNumber.bulkCreate(result);
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
            console.log(formData)

            const rules = {
                'id': 'required|integer',
                'label_number_for_breeder_seeds': 'required|integer',
                'generated_label_name': 'required|string',
                'weight': 'required|string',
                'user_id': 'required|integer',
                'unique_label_number': 'required|string',
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

            const isExist = await generatedLabelNumber.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                label_number_for_breeder_seeds: formData.label_number_for_breeder_seeds,
                generated_label_name: formData.generated_label_name,
                weight: formData.weight,
                user_id: formData.user_id,
                unique_label_number: formData.unique_label_number
            };

            const data = await generatedLabelNumber.update(dataToUpdate, condition);

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
                    id: req.body.id,
                }
            };
            const isExist = await generatedLabelNumber.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data = await generatedLabelNumber.destroy(condition);

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

module.exports = GeneratedLabelNumberController;