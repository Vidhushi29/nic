const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { seedTestingReportsModel, lotNumberModel, cropModel, varietyModel, seasonModel } = require('../models');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
class SeedTestingReportsController {
    static getAll = async (req, res) => {
        try {
            const data = await seedTestingReportsModel.findAll({
                include: [
                    {
                        model: lotNumberModel,
                        left: true,
                        attributes: ['lot_number']
                    },
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['crop_name']
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['variety_name']
                    },
                    {
                        model: seasonModel,
                        left: true,
                        attributes: ['season']
                    }
                ],
                where: {
                    user_id: req.params.id
                }
            });
            if (req.params) {
                console.log('req.params', req.params);
            }

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
                },
            };
            let data = await seedTestingReportsModel.findOne(condition);

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


    static getDataforlabelNumberforBreederSeed = async (req, res) => {
        try {
            const { year_of_indent = "", crop_code, variety_id, user_id, is_occupied = true } = req.body;
            const condition = {
                where: {
                    year_of_indent: year_of_indent,
                    crop_code: crop_code,
                    variety_id: variety_id,
                    is_report_pass: true,
                },
                include: [
                    {
                        model: lotNumberModel,
                        left: true,
                        attributes: ['id', 'lot_number', 'lot_number_size'],
                        where: {
                            breeder_production_center_id: user_id
                        }
                    },
                ],
            };

            if (is_occupied == false) {
                condition.where['is_occupied'] = false;
            }

            let data = await seedTestingReportsModel.findAll(condition);

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
                'data.*.user_id': 'required|integer',
                'data.*.reference_number': 'required|string',
                'data.*.date': 'required|string',
                'data.*.report_recieving_date': 'required|string',
                'data.*.seed_test_lab_id': 'required|integer',
                'data.*.year_of_indent': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.variety_id': 'required|string',
                'data.*.quantity_of_seed_produced': 'required|string',
                'data.*.lot_number': 'required|string',
                'data.*.sample_number': 'required|string',
                'data.*.seed_class_normal': 'required|string',
                'data.*.seed_class_abnormal': 'required|string',
                'data.*.seed_class_hard': 'required|string',
                'data.*.fresh_ungerminated': 'required|string',
                'data.*.dead': 'required|string',
                'data.*.pure_seed': 'required|string',
                'data.*.other_crop_seed': 'required|string',
                'data.*.weed_seed': 'required|string',
                'data.*.inert_matter': 'required|string',
                'data.*.moisture': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.season': 'required|string',
                'data.*.is_report_pass': 'required|boolean',
                'data.*.is_occupied': 'required|boolean',
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

            // const result = await Promise.all(formData.map(async (data, index) => {
            //     return {
            //         user_id: data.user_id,
            //         reference_number: data.reference_number,
            //         date: data.date,
            //         report_recieving_date: data.report_recieving_date,
            //         seed_test_lab_id: data.seed_test_lab_id,
            //         year_of_indent: data.year_of_indent,
            //         crop_code: data.crop_code,
            //         variety_id: data.variety_id,
            //         quantity_of_seed_produced: data.quantity_of_seed_produced,
            //         lot_number: data.lot_number,
            //         sample_number: data.sample_number,
            //         seed_class_normal: data.seed_class_normal,
            //         seed_class_abnormal: data.seed_class_abnormal,
            //         seed_class_hard: data.seed_class_hard,
            //         fresh_ungerminated: data.fresh_ungerminated,
            //         dead: data.dead,
            //         pure_seed: data.pure_seed,
            //         other_crop_seed: data.other_crop_seed,
            //         weed_seed: data.weed_seed,
            //         inert_matter: data.inert_matter,
            //         moisture: data.moisture,
            //         is_active: data.is_active,
            //     }
            // }));

            const data = await seedTestingReportsModel.create(formData);
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
                'user_id': 'required|integer',
                'reference_number': 'required|string',
                'date': 'required|string',
                'report_recieving_date': 'required|string',
                // 'seed_test_lab_id': 'required|string',
                'year_of_indent': 'required|integer',
                'crop_code': 'required|string',
                'variety_id': 'required|integer',
                'quantity_of_seed_produced': 'required|string',
                'lot_number': 'required|integer',
                'sample_number': 'required|string',
                'seed_class_normal': 'required|string',
                'seed_class_abnormal': 'required|string',
                'seed_class_hard': 'required|string',
                'fresh_ungerminated': 'required|string',
                'dead': 'required|string',
                'pure_seed': 'required|string',
                'other_crop_seed': 'required|string',
                'weed_seed': 'required|string',
                'inert_matter': 'required|string',
                'moisture': 'required|string',
                'is_active': 'required|integer',
                'season': 'required|string',
                'is_report_pass': 'required|boolean',
                'is_occupied': 'required|boolean',
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

            const isExist = await seedTestingReportsModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                user_id: formData.user_id,
                reference_number: formData.reference_number,
                date: formData.date,
                report_recieving_date: formData.report_recieving_date,
                seed_test_lab_id: formData.seed_test_lab_id,
                year_of_indent: formData.year_of_indent,
                crop_code: formData.crop_code,
                variety_id: formData.variety_id,
                quantity_of_seed_produced: formData.quantity_of_seed_produced,
                lot_number: formData.lot_number,
                sample_number: formData.sample_number,
                seed_class_normal: formData.seed_class_normal,
                seed_class_abnormal: formData.seed_class_abnormal,
                seed_class_hard: formData.seed_class_hard,
                fresh_ungerminated: formData.fresh_ungerminated,
                dead: formData.dead,
                pure_seed: formData.pure_seed,
                other_crop_seed: formData.other_crop_seed,
                weed_seed: formData.weed_seed,
                inert_matter: formData.inert_matter,
                moisture: formData.moisture,
                is_active: formData.is_active,
                season: formData.season,
                is_report_pass: formData.is_report_pass,
                is_occupied: formData.is_occupied
            };

            const data = await seedTestingReportsModel.update(dataToUpdate, condition);

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
            const isExist = await seedTestingReportsModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data = await seedTestingReportsModel.destroy(condition);
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    // API for List Data

    static getYearDataForSeedTestingReports = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            const data = await seedTestingReportsModel.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.year_of_indent')), 'year_of_indent'],
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

    static getSeasonDataForSeedTestingReports = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const user_id = req.query.user_id;

            const data = await seedTestingReportsModel.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.season')), 'season'],
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

    static getCropsDataForSeedTestingReports = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const season = req.query.season;
            const user_id = req.query.user_id;

            const data = await seedTestingReportsModel.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,

                },
                order: [[Sequelize.col('m_crop.crop_name'), 'ASC']],


                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    user_id: user_id
                },
                raw: true,

                // order: [
                //     [
                //       Sequelize.fn('lower', Sequelize.col('m_crop.crop_name')),
                //       'ASC',
                //     ],
                //     [Sequelize.col('seed_testing_reports.crop_code'),'ASC']
                // ],
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
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getVarietiesDataForSeedTestingReports = async (req, res) => {
        try {
            const year_of_indent = Number(req.query.year_of_indent);
            const season = req.query.season;
            const crop_code = req.query.crop_code;
            const user_id = req.query.user_id;

            const data = await seedTestingReportsModel.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.variety_id')), 'variety_id'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },
                order:[
                    [Sequelize.col('m_crop_variety.variety_name'),'ASC']

                ],

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

    static getReportDataForSeedTestingReports = async (req, res) => {
        try {
            const year_of_indent = Number(req.body.year_of_indent);
            const season = req.body.season;
            const crop_code = req.body.crop_code;
            const user_id = req.body.user_id;
            const variety_id = req.body.variety_id

            const data = await seedTestingReportsModel.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.is_report_pass')), 'is_report_pass'],
                ],

                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    crop_code: crop_code,
                    user_id: user_id,
                    variety_id: variety_id
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
    static getVarietiesDataForSeedTestingReportsSecond = async (req, res) => {
        try {
            const year_of_indent = Number(req.body.year);
            const season = req.body.season;
            const crop_code = req.body.crop_code;
            const user_id = req.body.user_id;
            const type = req.body && req.body.type ? req.body.type : '';
            let data
            const { is_occupied = true } = req.body;
            const condition = {
                where: {
                    year_of_indent: year_of_indent,
                    crop_code: crop_code,
                    // variety_id: variety_id,
                    is_report_pass: true,

                },
                include: [
                    {
                        model: lotNumberModel,
                        left: true,
                        attributes: ['id', 'lot_number', 'lot_number_size'],
                        where: {
                            breeder_production_center_id: user_id
                        }
                    },
                ],
            };
            if (is_occupied == false) {
                condition.where['is_occupied'] = false;
            }
            let varietyData = await seedTestingReportsModel.findAll(condition)
            let labelDataVariety = []
            if (varietyData && varietyData.length > 0) {
                varietyData.forEach(element => {
                    labelDataVariety.push(element.variety_id)
                });
            }
            console.log(labelDataVariety, 'labelDataVarietylabelDataVarietylabelDataVariety')
            if (type) {
                if (labelDataVariety && labelDataVariety.length > 0) {
                    data = await seedTestingReportsModel.findAll({
                        attributes: [
                            [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.variety_id')), 'variety_id'],
                        ],
                        include: {
                            model: varietyModel,
                            left: true,
                            attributes: ['id', 'variety_name', 'variety_code'],
                        },
                        //    if(labelDataVariety){},

                        where: {
                            year_of_indent: year_of_indent,
                            season: season,
                            crop_code: crop_code,
                            user_id: user_id,
                            variety_id: {
                                [Op.in]: labelDataVariety
                            }
                        },
                        order: [
                            [Sequelize.col('m_crop_variety.variety_name'), 'ASC']
                        ],
                        raw: true,
                    });

                } else {
                    return response(res, status.DATA_NOT_AVAILABLE, 200, {});
                    // data = await seedTestingReportsModel.findAll({
                    //     attributes: [
                    //         [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.variety_id')), 'variety_id'],
                    //     ],
                    //     include: {
                    //         model: varietyModel,
                    //         left: true,
                    //         attributes: ['id', 'variety_name', 'variety_code'],
                    //     },
                    //     //    if(labelDataVariety){},

                    //     where: {
                    //         year_of_indent: year_of_indent,
                    //         season: season,
                    //         crop_code: crop_code,
                    //         user_id: user_id,
                    //         //  variety_id: {
                    //         //     [Op.in]:labelDataVariety                           
                    //         //   }
                    //     },
                    //     order: [
                    //         [Sequelize.col('m_crop_variety.variety_name'), 'ASC']
                    //     ],

                    //     raw: true,
                    // });
                }


            } else {
                data = await seedTestingReportsModel.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('seed_testing_reports.variety_id')), 'variety_id'],
                    ],
                    include: {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    order:[
                        [Sequelize.col('m_crop_variety.variety_name'),'ASC']
                    ],

                    where: {
                        year_of_indent: year_of_indent,
                        season: season,
                        crop_code: crop_code,
                        user_id: user_id,

                    },
                    raw: true,
                });
            }


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

module.exports = SeedTestingReportsController;