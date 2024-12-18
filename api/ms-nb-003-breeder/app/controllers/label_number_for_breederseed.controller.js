const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const db = require("../models");
const {generatedLabelNumber, cropModel, varietyModel, lotNumberModel, seasonModel, seedTestingReportsModel } = require('../models');
const labelNumberForBreederseed = db.labelNumberForBreederseed
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');

class LabelNumberForBreederSeedController {
    static fetch = async (req, res) => {
        try {
            const { page, pageSize, search } = req.body;
            let condition = {
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_code', 'variety_name']
                    },
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['id', 'crop_code', 'crop_name']
                    },
                    {
                        model: seasonModel,
                        left: true,
                        attributes: ['season']
                    },
                    {
                        model: lotNumberModel
                    }
                ],
                where: {
                    // user_id: user_id
                }
            }

            if (page === undefined) page = 1;
            if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

            if (page > 0 && pageSize > 0) {
                condition.limit = pageSize;
                condition.offset = (page * pageSize) - pageSize;
            }
            //implement sort
            const sortOrder = req.body.sort ? req.body.sort : 'id';
            const sortDirection = req.body.order ? req.body.order : 'DESC';
            //sort condition
            condition.order = [[sortOrder, sortDirection]];
            if(req.body){
                if(req.body.user_id){
                    condition.where.user_id = req.body.user_id ;
                }
                if (req.body.search) {
                    if (req.body.search.crop_code) {
                        condition.where.crop_code = (req.body.search.crop_code);
                    }
                    if (req.body.search.variety_code) {
                        condition.where.variety_id = (req.body.search.variety_code);
                    }
                    if (req.body.search.season) {
                        condition.where.season = (req.body.search.season);
                    }
                    if (req.body.search.year) {
                        condition.where.year_of_indent = (req.body.search.year);
                    }
                }   
            }
           
            // const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition };

            const data = await labelNumberForBreederseed.findAndCountAll(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error',error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static fetchwithLotNumber = async (req, res) => {
        try {
            const { year_of_indent = "", crop_code, variety_id, lot_number, user_id } = req.query;
            let condition = {
                where: {
                    year_of_indent: year_of_indent,
                    crop_code: crop_code,
                    variety_id: variety_id,
                    lot_number_creation_id: lot_number,
                    user_id: user_id
                },
            };
            const data = await labelNumberForBreederseed.findAll(condition);
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
                    id
                },
                include: [
                    {
                        model: lotNumberModel,
                        left: true,
                        attributes: ['id', 'lot_number', 'lot_number_size'],
                    },
                ],
            };
            let data = await labelNumberForBreederseed.findOne(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

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

    static getQuantityOfAllLabelNumber = async (req, res) => {
        try {

            const { user_id = "", lot_number_creation_id = "" } = req.query;
            const condition = {
                where: {
                    user_id: user_id,
                    lot_number_creation_id: lot_number_creation_id
                },
                attributes: ['id', 'weight', 'number_of_bags', 'crop_code']
            };
            let data = await labelNumberForBreederseed.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

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

    static create = async (req, res) => {
        try {
            const formData = req.body;
            const rules = {
                'data.*.year_of_indent': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.variety_id': 'required|string',
                'data.*.lot_number_creation_id': 'required|integer',
                'data.*.pure_seed': 'required|string',
                'data.*.inert_matter': 'required|string',
                'data.*.germination': 'required|string',
                'data.*.total_production': 'required|string',
                'data.*.quantity': 'required|string',
                'data.*.date_of_test': 'required|string',
                'data.*.weight': 'required|string',
                'data.*.number_of_bags': 'required|integer',
                'data.*.valid_upto': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.season': 'required|string',
                'data.*.seed_testing_reports_id': 'required|integer',
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

            const dataToInsert = {
                year_of_indent: formData.year_of_indent,
                crop_code: formData.crop_code,
                variety_id: formData.variety_id,
                lot_number_creation_id: formData.lot_number_creation_id,
                pure_seed: formData.pure_seed,
                inert_matter: formData.inert_matter,
                germination: formData.germination,
                total_production: formData.total_production,
                quantity: formData.quantity_for_labels_generated,
                date_of_test: formData.date_of_test,
                weight: formData.weight,
                number_of_bags: formData.number_of_bags,
                valid_upto: formData.valid_upto,
                is_active: formData.is_active,
                user_id: formData.user_id,
                season: formData.season,
                seed_testing_reports_id: formData.seed_testing_reports_id,
            };
            const data = await labelNumberForBreederseed.create(dataToInsert);

            const condition = {
                where: {
                    id: formData.seed_testing_reports_id
                }
            };

            const isExist = await seedTestingReportsModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                is_occupied: true
            };

            const data2 = await seedTestingReportsModel.update(dataToUpdate, condition);

            return response(res, status.DATA_AVAILABLE, 200, data, data2);
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
                'id': 'required|integer',
                'year_of_indent': 'required|integer',
                'crop_code': 'required|string',
                'variety_id': 'required|integer',
                'lot_number': 'required|integer',
                'pure_seed': 'required|string',
                'inert_matter': 'required|string',
                'germination': 'required|string',
                'total_production': 'required',
                'quantity_for_labels_generated': 'required',
                'date_of_test': 'required|string',
                'weight': 'required|string',
                'number_of_bags': 'required',
                // 'label_number': 'required|string',
                'valid_upto': 'required|string',
                'is_active': 'required|integer',
                'user_id': 'required|integer',
                'season': 'required|string',
                'seed_testing_reports_id': 'required|integer',
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

            const isExist = await labelNumberForBreederseed.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                year_of_indent: formData.year_of_indent,
                crop_code: formData.crop_code,
                variety_id: formData.variety_id,
                lot_number_creation_id: formData.lot_number,
                pure_seed: formData.pure_seed,
                inert_matter: formData.inert_matter,
                germination: formData.germination,
                total_production: formData.total_production,
                quantity: formData.quantity_for_labels_generated,
                date_of_test: formData.date_of_test,
                weight: formData.weight,
                number_of_bags: formData.number_of_bags,
                valid_upto: formData.valid_upto,
                is_active: formData.is_active,
                user_id: formData.user_id,
                season: formData.season,
                seed_testing_reports_id: formData.seed_testing_reports_id,
            };

            const data = await labelNumberForBreederseed.update(dataToUpdate, condition);


            const seedCondition = {
                where: {
                    id: formData.seed_testing_reports_id
                }
            };

            const isSeedExist = await seedTestingReportsModel.count(seedCondition);

            if (isSeedExist) {
                const dataToUpdate = {
                    is_occupied: true
                };

                await seedTestingReportsModel.update(dataToUpdate, seedCondition);
            }

            if (formData.is_lot_changed && formData.is_lot_changed == true) {

                const seedCondition2 = {
                    where: {
                        id: formData.previous_seed_testing_reports_id
                    }
                };

                const isSeedExist2 = await seedTestingReportsModel.count(seedCondition2);

                if (isSeedExist2) {
                    const previousDataToUpdate = {
                        is_occupied: false
                    };

                    await seedTestingReportsModel.update(previousDataToUpdate, seedCondition2);
                }
            }


            if (formData.removePreviousLabelData == true) {
                const condition2 = {
                    where: {
                        label_number_for_breeder_seeds: formData.id,
                    }
                };

                const isExist2 = await generatedLabelNumber.count(condition2);
                if (isExist2) {
                    await generatedLabelNumber.destroy(condition2);
                }
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

    static delete = async (req, res) => {
        try {
            const condition = {
                where: {
                    id: req.params.id,
                }
            };

            const isExist = await labelNumberForBreederseed.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataForSeed = await labelNumberForBreederseed.findOne(condition);
            let seed_testing_reports_id = dataForSeed['seed_testing_reports_id'];

            const seedCondition = {
                where: {
                    id: seed_testing_reports_id
                }
            }

            const data = await labelNumberForBreederseed.destroy(condition);

            const isSeedExist = await seedTestingReportsModel.count(seedCondition);

            if (isSeedExist) {

                const dataToUpdate = {
                    is_occupied: false
                };

                var data2 = await seedTestingReportsModel.update(dataToUpdate, seedCondition);
            }

            const labelCondition = {
                where: {
                    label_number_for_breeder_seeds: req.params.id,
                }
            };

            const labelIsExist = await generatedLabelNumber.count(labelCondition);
            if (labelIsExist) {
                var labelData = await generatedLabelNumber.destroy(labelCondition);
            }


            return response(res, status.DATA_AVAILABLE, 200, {
                data: data,
                labelData: labelData,
                seedData: data2
            });
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }


    // API for List Data

    static getYearDataForLabelNumber = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await labelNumberForBreederseed.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.year_of_indent')), 'year_of_indent'],
                ],
                where: {
                    user_id: user_id
                },
                raw: true,
                order: [['year_of_indent', 'DESC']]
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

    static getSeasonDataForLabelNumber = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const user_id = req.query.user_id;

            const data = await labelNumberForBreederseed.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },

                where: {
                    year_of_indent: year_of_indent,
                    user_id: user_id
                },
                raw: true,
                order: [['season', 'ASC']]
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

    static getCropsDataForLabelNumber = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const season = req.query.season;
            const user_id = req.query.user_id;

            const data = await labelNumberForBreederseed.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                },

                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    user_id: user_id
                },
                raw: true,
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

    static getVarietiesDataForLabelNumber = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const season = req.query.season;
            const crop_code = req.query.crop_code;
            const user_id = req.query.user_id;

            const data = await labelNumberForBreederseed.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.variety_id')), 'variety_id'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },
                order:[[Sequelize.col('m_crop_variety.variety_name'),'ASC']],
                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    crop_code: crop_code,
                    user_id: user_id
                },
                raw: true,
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
    static getVarietiesDataForLabelNumberSecond = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const season = req.query.season;
            const crop_code = req.query.crop_code;
            const user_id = req.query.user_id;

            const data = await labelNumberForBreederseed.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.variety_id')), 'variety_id'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },

                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    crop_code: crop_code,
                    user_id: user_id
                },
                raw: true,
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

module.exports = LabelNumberForBreederSeedController;