const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { bspcToPlants, plantDetails, bsp4ToPlant, bsp4Model, varietyModel } = require('../models');
const Sequelize = require('sequelize');

class Bsp4ToPlantsController {

    static create = async (req, res) => {
        try {
            const formData = req.body;

            const rules = {

                'data.*.year': 'required|integer',
                'data.*.season': 'required|string',
                'data.*.crop_code': 'required|string',
                'data.*.bsp4_id': 'required|integer',
                'data.*.plant_id': 'required|integer',
                'data.*.quantity': 'required|string',
                'data.*.variety_id': 'required|integer',
                'data.*.user_id': 'required|integer'
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
                    year: data.year,
                    season: data.season,
                    crop_code: data.crop_code,
                    bsp4_id: data.bsp4_id,
                    variety_id: data.variety_id,
                    plant_id: data.plant_id,
                    quantity: data.quantity,
                    user_id: data.user_id
                }
            }));

            const data = await bsp4ToPlant.bulkCreate(result);
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
            const plant_id = req.body.plant_id;
            const formData = req.body.plantData;

            if (plant_id && plant_id.length > 0) {
                plant_id.forEach(async element => {
                    let condition = {
                        where: {
                            id: element,
                        }
                    }
                    await bsp4ToPlant.destroy(condition);
                });
            }

            const result = await Promise.all(formData.map(data => {
                return {
                    year: data.year,
                    season: data.season,
                    crop_code: data.crop_code,
                    bsp4_id: data.bsp4_id,
                    variety_id: data.variety_id,
                    plant_id: data.plant_id,
                    quantity: data.quantity,
                    user_id: data.user_id
                }
            }));

            const data = await bsp4ToPlant.bulkCreate(result);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getSPPDataForLotNumber = async (req, res) => {
        try {
            const { year, season, crop_code, user_id } = req.body;

            const condition = {
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp4_to_plants.plant_id')), 'plant_id'],
                ],
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    user_id: Number(user_id)
                }
            };

            let data = await bsp4ToPlant.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const rows = await Promise.all(data.map(async plant => {
                var id = plant.dataValues.plant_id;

                const plant_data = await plantDetails.findAll({
                    attributes: ['id', 'plant_name'],
                    where: {
                        id: id
                    }
                });

                if (!plant_data) {
                    return response(res, status.DATA_NOT_AVAILABLE, 404);
                }

                return plant_data;
            }));

            return response(res, status.DATA_AVAILABLE, 200, rows);

        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getQuantityOfSPPDataForLotNumber = async (req, res) => {
        try {
            const { year, season, crop_code, plant_id, bsp4_id, variety_id, user_id } = req.body;

            const condition = {
                attributes: ['id', 'quantity'],
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    plant_id: plant_id,
                    bsp4_id: bsp4_id,
                    variety_id: variety_id,
                    user_id: user_id
                }
            };

            let data = await bsp4ToPlant.findAll(condition);

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

    static getVarietyData = async (req, res) => {
        try {
            const { loginedUserid, year, season, crop_code, plant_id } = req.body;
            console.log("Body: ", req.body)
            let innerCondition = {}
            if (loginedUserid && loginedUserid.id) {
                innerCondition = {
                    where: {
                        production_center_id: loginedUserid.id
                    }
                }

            }
            const condition = {
                attributes: ["id", "bsp4_id", 'variety_id'],
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    plant_id: plant_id
                },
                include: [
                    {
                        model: bsp4Model,
                        ...innerCondition
                    }
                ]
            };

            let data = await bsp4ToPlant.findAll(condition);

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

    static getData = async (req, res) => {
        try {
            const { year, season, crop_code, bsp4_id, variety_id } = req.body;
            const condition = {
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    id: bsp4_id,
                    variety_id: variety_id
                },
                include: [
                    {
                        model: varietyModel,
                    }
                ]
            };

            let data = await bsp4Model.findAll(condition);

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

    static getPlantsData = async (req, res) => {
        try {
            const { year, season, crop_code, bsp4_id, variety_id, user_id } = req.body;
            const condition = {
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    bsp4_id: bsp4_id,
                    variety_id: variety_id,
                    user_id: user_id
                },
                include: [
                    {
                        model: plantDetails,
                        left: true,
                        attributes: ['plant_name', 'id']
                    },
                ],
                raw: true,
            };

            let data = await bsp4ToPlant.findAll(condition);

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

module.exports = Bsp4ToPlantsController;
