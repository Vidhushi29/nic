const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { monitoringTeamModel, designationModel } = require('../models');
// const bsp3Helper = require('../_helpers/bsp3');


class MonitoringTeamController {
    static fetch = async (req, res) => {
        try {
            const condition = {
                include: {
                    model: designationModel,
                    left: true,
                },
                raw: true,
                nest: true,
            }
            console.log('condition', condition);
            const data = await monitoringTeamModel.findAll(condition);
            console.log('data', data);
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

    static getById = async (req, res) => {
        try {
            const { id = "" } = req.params;
            const condition = {
                where: {
                    id,
                }
            };
            const data = await monitoringTeamModel.findOne(condition);
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
                'address': 'string',
                'designation_id': 'required|integer',
                'institute_name': 'string',
                'is_active': 'required|integer',
                'mobile_number': 'integer',
                'name': 'required|string',
                'user_id': 'required|integer'
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

            // const userMappingId = await bsp3Helper.maxValueFromColumn(formData.user_id, formData.crop_code);

            const dataToInsert = {
                address: formData.address,
                designation: formData.designation_id,
                institute_name: formData.institute_name,
                is_active: formData.is_active,
                mobile_number: formData.mobile_number,
                name: formData.name,
                user_id: formData.user_id,
                // user_mapping_id: userMappingId
            };

            const isExist = await monitoringTeamModel.count({
                where: {
                    mobile_number: formData.mobile_number.toString(),
                },
                raw: true
            });
            if (isExist) {
                return response(res, status.DATA_ALREADY_EXIST, 404);
            }

            const data = await monitoringTeamModel.create(dataToInsert);

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
                'address': 'required|string',
                'designation_id': 'required|integer',
                'id': 'required|integer',
                'institute_name': 'required|string',
                'is_active': 'required|integer',
                'mobile_number': 'required|integer',
                'name': 'required|string',
                'user_id': 'required|integer',
                // 'user_mapping_id': 'required|integer'
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
            const isExist = await monitoringTeamModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                address: formData.address,
                designation: formData.designation_id,
                institute_name: formData.institute_name,
                is_active: formData.is_active,
                mobile_number: formData.mobile_number,
                name: formData.name,
                user_id: formData.user_id,
                // user_mapping_id: formData.user_mapping_id
            };

            const data = await monitoringTeamModel.update(dataToUpdate, condition);

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
                    id: req.params.id
                }
            };
            const isExist = await monitoringTeamModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await monitoringTeamModel.destroy(condition);

            return response(res, status.DATA_AVAILABLE, 200, data)
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
};

module.exports = MonitoringTeamController;