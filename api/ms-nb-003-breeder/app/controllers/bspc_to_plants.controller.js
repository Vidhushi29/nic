const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { bspcToPlants, plantDetails } = require('../models');

class BspcToPlantsController {

    static create = async (req, res) => {
        try {
            const formData = req.body;

            // const rules = {
            //     'data.*.plant_id': 'required|integer',
            //     'data.*.user_id': 'required|integer',
            //     'data.*.agency_id': 'required|integer'
            // };

            // const validation = new Validator(formData, rules);
            // const isValidData = validation.passes();

            // if (!isValidData) {
            //     const errorResponse = {};
            //     for (let key in rules) {
            //         const error = validation.errors.get(key);
            //         if (error.length) {
            //             errorResponse[key] = error;
            //         }
            //     }
            //     return response(res, status.BAD_REQUEST, 400, ((errorResponse && errorResponse.length) || isValidData));
            // }

            const result = await Promise.all(formData.map(data => {
                return {
                    plant_id: data.plant_id,
                    user_id: data.user_id,
                    agency_id: data.agency_id
                }
            }));

            const data = await bspcToPlants.bulkCreate(result);
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
            const user_id = req.body.user_id
            const formData = req.body.ssp_data;

            const condition = {
                where: {
                    user_id: user_id
                }
            };

            const isExist = await bspcToPlants.count(condition);

            if (isExist) {
                await bspcToPlants.destroy(condition);
            }

            const result = await Promise.all(formData.map(data => {
                return {
                    plant_id: data.plant_id,
                    user_id: data.user_id,
                    agency_id: data.agency_id
                }
            }));

            const data = await bspcToPlants.bulkCreate(result);
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static get_plants_data_for_bsp4 = async (req, res) => {
        try {
            const user_id = req.body.user_id;

            if (!user_id) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const data = await bspcToPlants.findAll({
                include: [
                    {
                        model: plantDetails,
                        left: true,
                        attributes: ['plant_name', 'id']
                    },
                ],
                where: {
                    user_id: user_id
                },
                attributes: ['id', 'user_id', 'agency_id']
            });

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

    static get_plants_data_for_lot_number = async (req, res) => {
        try {
            const id = req.query.id;

            if (!id) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const data = await plantDetails.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'plant_name', 'code']
            });

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

};

module.exports = BspcToPlantsController;