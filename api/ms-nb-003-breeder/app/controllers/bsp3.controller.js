const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, bsp3Model, bsp2Model, designationModel, userModel, cropModel, bsp1Model, monitoringTeamModel, varietyModel, bsp1ProductionCenterModel, seasonModel, cropGroupModel } = require('../models');
const bsp3Helper = require('../_helpers/bsp3');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');

class Bsp3Controller {
    static bsp3Proforma = async (req, res) => {
        try {
            const { userId } = req.query;
            let condition = {};
            if (userId) {
                condition = {
                    attributes: ['id', 'name'],
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
                            model: bsp2Model,
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

            const data = await plainUser.bsp_2s.filter(element => {
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
            delete plainUser.bsp_2s;
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
        const bsp3Data = await bsp3Model.findAll(condition);
        if (!(bsp3Data && bsp3Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp3Data.filter(element => {
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
        const bsp3Data = await bsp3Model.findAll(condition);
        if (!(bsp3Data && bsp3Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp3Data.filter(element => {
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

    static bsp3ProformaFilter = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName, userId,season } = req.query;
            const condition = {
                include: [
                    {
                        attributes: ['id', 'createdAt', 'created_at'],
                        model: bsp1Model,
                        left: true,
                    },
                    {
                        attributes: ['id', 'variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                    {
                        attributes: ['season'],
                        model: seasonModel,
                        left: true,
                    }
                ],
                where: {
                    crop_code: cropName,
                    production_center_id: userId,
                    year: year,
                    if_not_being_produced: false,
                    season:season
                },
                raw: true,
                nest: true,
            };

            const bsp3VarietyData = await bsp3Model.findAll({
                where: {
                    crop_code: cropName,
                    monitor_report: 'Re-monitoring after 15 days',
                    production_center_id: userId,
                    year: year,
                },
                raw: true,
                nest: true,
            });

            const varietyData = await bsp2Model.findAll(condition);
            console.log('varietyData', varietyData);
            if (bsp3VarietyData.length) {
                let result = varietyData.filter(varieties => bsp3VarietyData.some(bsp3Variety => bsp3Variety.bsp_2_id === varieties.id));
                result = await bsp3Helper.quantityProduced(result, userId);
                return response(res, status.DATA_AVAILABLE, 200, result);
            }
            if (!varietyData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await bsp3Helper.quantityProduced(varietyData, userId);
            return response(res, status.DATA_AVAILABLE, 200, data);
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
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: agencyDetailModel,
                                left: true,
                                attributes: ['id', 'agency_name']
                            }
                        ]
                    },
                    {
                        model: monitoringTeamModel,
                        left: true,
                        // attributes: ['id'],
                    },
                    {
                        model: bsp2Model,
                        left: true,
                        attributes: ['id'],
                        include: [
                            {
                                model: bsp1Model,
                                left: true,
                                // attributes: ['id', 'crop_name'],
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
                ],
                raw: true,
                nest: true,
            };

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };

            const bsp3Data = await bsp3Model.findAndCountAll(dataToSend);
            if (!bsp3Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const uniqueRecords = [];
            const uniqueData = [];

            const rows = await bsp3Data.rows.filter(element => {
                const bsp3Record = uniqueRecords.includes(element.id);
                if (!bsp3Record) {
                    uniqueRecords.push(element.id);
                    element.monitoring_teams = [element.monitoring_teams]
                    uniqueData.push(element);

                } else {
                    uniqueData.filter(crop => {
                        if (crop.id === element.id) {
                            crop.monitoring_teams.push(element.monitoring_teams);
                        }
                    })
                }
                return false;
            });

            if (!rows) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = { rows: uniqueData, count: bsp3Data.count };

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
                        model: bsp2Model,
                        left: true,
                        attributes: ['id', 'area', 'expected_production', 'field_location', 'variety_id', 'created_at'],
                        include: [
                            {
                                model: bsp1Model,
                                left: true,
                                attributes: ['id', 'created_at'],
                            },
                        ],
                    },
                    {
                        attributes: ['id', 'variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                ],
                raw: true,
                nest: true,
            };
            const data = await bsp3Model.findOne(condition);
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
                'data.*.bsp_2_id': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.document': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.monitor_report': 'required|string',
                'data.*.monitor_team_report': 'required|integer',
                'data.*.monitoring_team': 'required|string',
                'data.*.production_centre_id': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.year': 'required|integer',
                'data.*.date_of_inspection': 'required|string',
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
            // const userMappingId = await bsp3Helper.maxValueFromColumn(formData[0].user_id, formData[0].crop_code);
            // const memberData = formData.pop();
            const data = await Promise.all(formData.map(async (data) => {
                const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);
                const dataToInsert = {
                    bsp_2_id: data.bsp_2_id,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    date_of_inspection: data.date_of_inspection,
                    document: data.document,
                    lat: data.lat,
                    long: data.long,
                    is_active: data.monitor_report === "Unsatisfactory" || data.monitor_report === "Re-monitoring after 15 days" ? 0 : data.is_active,
                    isdraft: data.isdraft || 0,
                    monitor_report: data.monitor_report,
                    monitor_team_report: data.monitor_team_report,
                    production_center_id: data.production_center_id,
                    user_id: data.user_id,
                    team_member_ids: data.team_member_ids,
                    // user_mapping_id: userMappingId,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season
                }

                const isExist = await bsp3Model.findOne({
                    where: {
                        year: data.year,
                        season: data.season,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                        monitor_report: 'Satisfactory',
                    }
                });

                // console.log(isExist)

                if (isExist && Object.keys(isExist).length) {
                    throw new Error(status.DATA_ALREADY_EXIST);
                }
                // console.log("working")


                const row = await bsp3Model.create(dataToInsert);
                if (row) {
                    await bsp2Model.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.bsp_2_id,
                        }
                    });
                }
                console.log('row', row.id);
                return { id: row.id };
            }));
            // console.log('data', data);
            // if (data) {
            //     console.log('memberData', memberData);
            //     await bsp3Helper.createMembers({ memberData });
            // }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error creating', error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static update = async (req, res) => {
        try {
            const formData = req.body;

            // const rules = {
            //     'bsp_2_id': 'required|integer',
            //     'crop_code': 'required|integer',
            //     'id': 'required|integer',
            //     'is_active': 'required|integer',
            //     'monitor_report': 'required|string',
            //     'monitor_team_report': 'required|integer',
            //     'production_centre_id': 'required|integer',
            //     'user_id': 'requir'required|string',ed|integer',
            //     'user_mapping_id': 'required|integer',
            //     'variety_id': 'required|integer',
            //     'year': 'required|integer'
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
            //     return response(res, status.BAD_REQUEST, 400, errorResponse);
            // }

            // const memberData = formData.pop();
            formData.forEach(async (data) => {
                const condition = {
                    where: {
                        id: data.id
                    }
                };

                const isExist = await bsp3Model.count(condition);
                if (!isExist) {
                    return response(res, status.DATA_NOT_AVAILABLE, 404);
                }
                const dataToUpdate = {
                    bsp_2_id: data.bsp_2_id,
                    crop_code: data.crop_code,
                    date_of_inspection: data.date_of_inspection,
                    document: data.document,
                    lat: data.lat,
                    long: data.long,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    monitor_report: data.monitor_report,
                    monitor_team_report: data.monitor_team_report,
                    production_centre_id: data.production_centre_id,
                    user_id: data.user_id,
                    team_member_ids: data.team_member_ids,
                    // user_mapping_id: data.user_mapping_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season
                };
                const bsp3 = await bsp3Model.update(dataToUpdate, condition);
                // if (bsp3) {
                //     await bsp3Helper.updateMember({ memberData });
                // }
                return response(res, status.DATA_AVAILABLE, 200, bsp3);
            });
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
            const isExist = await bsp3Model.findOne({ ...condition, raw: true });
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await bsp3Model.destroy(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // const member = await monitoringTeamModel.destroy({
            //     where: {
            //         user_mapping_id: isExist.user_mapping_id,
            //     },
            // });
            console.log('member deleted', member);
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
            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.year')), 'year'],
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

    static getSeasonDataForBSPForm = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;

            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.season')), 'season'],
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
            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.crop_code')), 'crop_code'],
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
                order:[
                    [ Sequelize.col('m_crop.crop_name'),'ASC'],
                    // [ Sequelize.col('bsp_2s.crop_code')]
                ]
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

    static getYearDataForBSP3List = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.year')), 'year'],
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

    static getSeasonDataForBSP3List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;
            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.season')), 'season'],
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

    static getCropGroupDataForBSP3List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.crop_group_code')), 'crop_group_code']
                ],

                include: {
                    attributes: ['group_name'],
                    model: cropGroupModel,
                    left: true,
                },
                where: {
                    year: year,
                    season: season
                },

                raw: true,
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);

        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500);
        }
    }

    static getCropsDataForBSP3List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.crop_code')), 'crop_code'],
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

    static getVarietiesDataForBSP3List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.variety_id')), 'variety_id'],
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

module.exports = Bsp3Controller;