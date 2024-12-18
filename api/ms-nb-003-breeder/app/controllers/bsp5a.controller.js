const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, designationModel, cropModel, bsp1Model, bsp2Model, bsp4Model, bsp3Model, userModel, bsp5aModel, varietyModel, seasonModel, indentorBreederSeedModel } = require('../models');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');

class Bsp5AController {

    static bsp5Proforma = async (req, res) => {
        try {
            const { userId } = req.query;
            let condition = {};
            if (userId) {
                condition = {
                    attributes: ['id'],
                    where: {
                        id: userId,
                    },
                    include: [
                        {
                            model: agencyDetailModel,
                            left: true,
                            attributes: ['id', 'agency_name', 'contact_person_name', 'address'],
                            include: [
                                {
                                    model: designationModel,
                                    left: true,
                                    attributes: ['name']
                                },
                            ],
                        },
                        {
                            model: bsp4Model,
                            left: true,
                            attributes: ['id', 'crop_code', 'year'],
                            include: [
                                {
                                    model: cropModel,
                                    left: true,
                                    attributes: ['id', 'crop_name'],
                                },
                            ],
                        },
                    ],
                };
            }
            const userData = await userModel.findOne(condition);
            const plainUser = userData.get({ plain: true });
            const uniqueCrops = [];
            const crops = [];
            const uniqueYear = [];
            const years = [];
            // const uniqueVariety = [];

            const data = await plainUser.bsp_4s.filter(element => {
                const cropCode = uniqueCrops.includes(element.crop_code);
                const year = uniqueYear.includes(element.year);
                // const variety = uniqueVariety.includes(element.m_crop_variety.variety_name);
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
                // if (!variety) {
                //     uniqueVariety.push(element.m_crop_variety.variety_name);
                // }
                return false;
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            delete plainUser.bsp_4s;
            plainUser['year'] = years;
            plainUser['crop_code'] = crops;
            return response(res, status.DATA_AVAILABLE, 200, plainUser);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

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
        const bsp5aData = await bsp5aModel.findAll(condition);
        if (!(bsp5aData && bsp5aData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp5aData.filter(element => {
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
        const bsp5aData = await bsp5aModel.findAll(condition);
        if (!(bsp5aData && bsp5aData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp5aData.filter(element => {
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

    static bsp5ProformaVariety = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName, userId,season } = req.query;
            const condition = {
                include: [
                    {
                        model: bsp3Model,
                        left: true,
                        // attributes: ['id', 'quantity_of_seed_produced', 'contact_person_name', 'address'],
                        include: [
                            {
                                model: bsp2Model,
                                left: true,
                                // attributes: ['id', 'crop_name'],
                                include: [
                                    {
                                        model: bsp1Model,
                                        left: true,
                                        // attributes: ['id', 'crop_name'],
                                        include: [
                                            {
                                                model: indentorBreederSeedModel,
                                                left: true,
                                                attributes: ['indent_quantity'],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                attributes: ['id', 'variety_name'],
                                model: varietyModel,
                                left: true,
                            }

                        ],
                    },
                    {
                        attributes: ['season'],
                        model: seasonModel,
                        left: true,
                    },
                ],
                // attributes: ['id', 'expected_production', 'area', 'field_location', 'year', 'crop_code'],
                where: {
                    crop_code: cropName,
                    production_center_id: userId,
                    year: year,
                    season:season
                },
            };
            const varietyData = await bsp4Model.findAll(condition);

            if (!varietyData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, varietyData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static fetch = async (req, res) => {
        try {

            let condition = {
                include: [
                    {
                        model: userModel,
                        left: true,
                        attributes: ['id'],
                        include: [
                            {
                                model: agencyDetailModel,
                                left: true,
                                attributes: ['id', 'agency_name'],
                            },
                        ],
                    },
                    {
                        model: bsp4Model,
                        left: true,
                        // attributes: ['id'],
                        include: [
                            {
                                model: bsp3Model,
                                left: true,
                                // attributes: ['id'],
                                include: [
                                    {
                                        model: bsp2Model,
                                        left: true,
                                        // attributes: ['id'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['crop_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['variety_name'],
                    },
                    {
                        model: seasonModel,
                        left: true,
                        attributes: ['season'],
                    },
                ]
            };

            condition.attributes = ['id', 'crop_code', 'year', 'variety_id', 'user_id', 'genetic_purity', 'is_freeze', 'isdraft', 'season'];

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };

            const rows = await bsp5aModel.findAndCountAll(dataToSend);
            if (!rows) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = { rows: rows.rows, count: rows.count };


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
                include: [
                    {
                        model: bsp4Model,
                        left: true,
                        // attributes: ['id', 'created_at'],
                        include: [
                            {
                                model: bsp3Model,
                                left: true,
                                // attributes: ['id', 'created_at'],
                                include: [
                                    {
                                        model: bsp2Model,
                                        left: true,
                                        // attributes: ['id', 'quantity_of_seed_produced', 'created_at'],
                                        include: [
                                            {
                                                model: bsp1Model,
                                                left: true,
                                                // attributes: ['id', 'quantity_of_seed_produced', 'created_at'],
                                            },
                                        ],
                                    },
                                    {
                                        attributes: ['id', 'variety_name'],
                                        model: varietyModel,
                                        left: true,
                                    },
                                ],

                            },
                        ],
                    }
                ],
                // attributes: ['id', 'expected_production', 'area', 'field_location', 'year', 'crop_code'],
                where: {
                    id,
                },
            };
            const data = await bsp5aModel.findOne(condition);
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
                'data.*.bsp_4_id': 'required|integer',
                'data.*.crop_code': 'required|integer',
                'data.*.genetic_purity': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.production_center_id': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.variety_id': 'required|integer',
                'data.*.year': 'required|integer',
                'data.*.season': 'required|string',
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

            const data = await Promise.all(formData.map(async (data) => {
                const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);
                const dataToInsert = {
                    bsp_4_id: data.bsp_4_id,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    genetic_purity: data.genetic_purity,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    production_center_id: data.production_center_id,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season
                };

                const isExist = await bsp5aModel.findOne({
                    where: {
                        year: data.year,
                        season: data.season,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                    }
                });

                if (isExist && Object.keys(isExist).length) {
                    throw new Error(status.DATA_ALREADY_EXIST);
                }

                const row = await bsp5aModel.create(dataToInsert);
                if (row) {
                    await bsp4Model.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.bsp_4_id,
                        }
                    });
                }
                return { id: row.id };
            }));

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

            const condition = {
                where: {
                    id: formData.id
                }
            };
            const isExist = await bsp5aModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                bsp_4_id: formData.bsp_4_id,
                crop_code: formData.crop_code,
                genetic_purity: formData.genetic_purity,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                production_center_id: formData.production_center_id,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                season: formData.season
            };
            const data = await bsp5aModel.update(dataToUpdate, condition);

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
            const isExist = await bsp5aModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await bsp5aModel.destroy(condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getYearDataForBSPForm = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.year')), 'year'],
                ],
                where : {
                    user_id: user_id
                },
                raw: true,
                order: [['year', 'DESC']]
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

    static getSeasonDataForBSPForm = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const year = Number(req.query.year)
            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },
                where: {
                    year: year,
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

    static getCropDataForBSPForm = async (req, res) => {
        try {
            const year = Number(req.query.year)
            const season = req.query.season;
            const user_id = req.query.user_id;

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                },
                where: {
                    year: year,
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

    // API for List Data

    static getYearDataForBSP5aList = async (req, res) => {
        try {
            const user_id = req.query.user_id
            const data = await bsp5aModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_as.year')), 'year'],
                ],
                where: {
                    user_id: user_id
                },
                raw: true,
                order: [['year', 'DESC']]
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

    static getSeasonDataForBSP5aList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id
            const data = await bsp5aModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_as.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },

                where: {
                    year: year,
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

    static getCropGroupDataForBSP5aList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp5aModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_as.crop_group_code')), 'crop_group_code']
                ],

                where: {
                    year: year,
                    season: season
                },

                raw: true,
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const groupName = await bsp3Helper.groupName(data);

            response(res, status.DATA_AVAILABLE, 200, groupName);
        } catch (error) {
            console.log(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    }

    static getCropsDataForBSP5aList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await bsp5aModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_as.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                    where: {
                        group_code: cropGroup
                    },
                },
                where: {
                    year: year,
                    season: season,
                    user_id: user_id,
                    crop_group_code: cropGroup
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

    static getVarietiesDataForBSP5aList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await bsp5aModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_as.variety_id')), 'variety_id'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },
                where: {
                    year: year,
                    season: season,
                    crop_group_code: cropGroup,
                    crop_code: cropCode,
                    user_id: user_id
                },

                raw: true,
                nest: true,
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

module.exports = Bsp5AController;