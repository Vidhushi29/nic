const moment = require('moment');
const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { bsp1ProductionCenterModel, bsp2Model, userModel, agencyDetailModel, designationModel, indenterModel, bsp1Model, varietyModel, bsp3Model, cropModel, seasonModel, cropGroupModel, sequelize } = require('../models');
const FileUpload = require('../_helpers/upload');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');
const { request } = require('http');
const Op = require('sequelize').Op;

class Bsp2Controller {
    static bsp1Proforma = async (req, res) => {
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
                        // {
                        //     model: bsp1Model,
                        //     left: true,
                        //     attributes: ['id', 'crop_code', 'year', 'variety_id'],
                        //     include: [
                        //         {
                        //             model: cropModel,
                        //             left: true,
                        //             attributes: ['id', 'crop_name'],
                        //         },
                        //     ],
                        // },
                    ],
                    raw: true,
                    nest: true,
                };
            }
            const userData = await userModel.findOne(condition);
            const productionCenter = await bsp1ProductionCenterModel.findAll({
                attributes: ['id'],
                include: [
                    {
                        attributes: ['id', 'year', 'crop_code', 'variety_id', 'indent_of_breederseed_id', 'agency_detail_id'],
                        model: bsp1Model,
                        left: true,
                        include: [
                            {
                                model: cropModel,
                                left: true,
                                attributes: ['id', 'crop_name'],
                            },
                        ],
                    }
                ],
                where: {
                    production_center_id: userData.id
                },
                raw: true,
                nest: true,
            });
            const userUpdateData = productionCenter.map(production => production.bsp_1);
            console.log('userUpdateData', userUpdateData);
            const uniqueCrops = [];
            const crops = [];
            const uniqueYear = [];
            const years = [];
            // const uniqueVariety = [];

            const data = await userUpdateData.filter(element => {
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
            userData['year'] = years;
            userData['crop_code'] = crops;
            // plainUser['variety_id'] = uniqueVariety;
            return response(res, status.DATA_AVAILABLE, 200, userData);
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
        const bsp2Data = await bsp2Model.findAll(condition);
        if (!(bsp2Data && bsp2Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp2Data.filter(element => {
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
        const bsp2Data = await bsp2Model.findAll(condition);
        if (!(bsp2Data && bsp2Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp2Data.filter(element => {
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

    static bsp1Data = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName, userId,season } = req.query;
            const condition = {
                attributes: ['id', 'variety_id', 'year', 'crop_code', 'season'],
                include: [
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
                    year: year,
                    season:season
                },
                raw: true,
                nest: true,
            };
            const bsp1s = await bsp1Model.findAll(condition);
            const bsp1Data = [];
            // const data = bsp1Data && bsp1Data.get({ plain: true });
            const bsp1Data1 = await Promise.all(bsp1s.map(async bsp1 => {
                const productionCenter = await bsp1ProductionCenterModel.findAll({
                    attributes: ['quantity_of_seed_produced', 'bsp_1_id'],
                    where: {
                        bsp_1_id: bsp1.id,
                        production_center_id: userId,
                    },
                    raw: true,
                });
                bsp1.productionCenter = productionCenter;
                const isExist = await productionCenter.findIndex(center => center.bsp_1_id === bsp1.id);
                if (isExist !== -1) {
                    bsp1Data.push(bsp1);
                }
                return true;
            }));
            if (!bsp1Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const uniqueRecords = [];
            const records = [];
            bsp1Data.forEach((row, index) => {
                const uniqueRecord = uniqueRecords.includes(row.variety_id);
                if (!uniqueRecord) {
                    const quantity = row.productionCenter.reduce((prevVal, currVal) => {
                        return prevVal + Number(currVal.quantity_of_seed_produced, 10);
                    }, 0);
                    uniqueRecords.push(row.variety_id);
                    row.quantity_of_seed_produced = quantity;
                    row.bsp1ID = [row.id];
                    records.push(row);
                    console.log('records', records);
                } else {
                    //const ind = index - 1;
                    const ind = records.findIndex(el => el.variety_id === row.variety_id);
                    records[ind].bsp1ID.push(row.id);
                    const quantity_of_seed_produced = Number(records[ind].quantity_of_seed_produced, 10) + Number(row.productionCenter[0].quantity_of_seed_produced, 10);
                    records[ind].quantity_of_seed_produced = quantity_of_seed_produced;
                }
            });

            return response(res, status.DATA_AVAILABLE, 200, records);
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
            const condition = {
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
                        model: bsp1Model,
                        left: true,
                        attributes: ['id'],
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
            const bsp2Data = await bsp2Model.findAndCountAll(dataToSend);

            if (!bsp2Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data = { rows: bsp2Data.rows, count: bsp2Data.count };

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

            // fetching data in db
            const { id = "" } = req.params;
            const condition = {
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
                        model: bsp1Model,
                        left: true,
                        attributes: ['id'],
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
                    },
                    {
                        attributes: ['crop_name'],
                        model: cropModel,
                        left: true,
                    }
                ],
                where: {
                    id,
                }
            };
            const data = await bsp2Model.findOne(condition);

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
            // validation on data received from frontend BSP2 proforma
            const rules = {
                'data.*.area': 'required|string',
                'data.*.bsp_1_id': 'required|integer',
                'data.*.bsp1ids': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.lat': 'required|string',
                'data.*.long': 'required|string',
                'data.*.date_of_sowing': 'required|string',
                'data.*.document': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.if_not_being_produced': 'required|boolean',
                'data.*.expected_availbility': 'required|string',
                'data.*.expected_harvest_from': 'required|string',
                'data.*.expected_harvest_to': 'required|string',
                'data.*.expected_inspection_from': 'required|string',
                'data.*.expected_inspection_to': 'required|string',
                'data.*.expected_production': 'required|string',
                'data.*.field_location': 'required|string',
                'data.*.location_availbility_seed': 'required|string',
                'data.*.production_center_id': 'required|integer',
                'data.*.reason': 'required|string',
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
                    area: data.area,
                    bsp_1_id: data.bsp_1_id,
                    bsp1ids: data.bsp1ids,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    date_of_sowing: data.date_of_sowing,
                    document: data.document,
                    lat: data.lat,
                    long: data.long,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    if_not_being_produced: data.if_not_being_produced || 0,
                    expected_availbility: data.expected_availbility,
                    expected_harvest_from: data.expected_harvest_from,
                    expected_harvest_to: data.expected_harvest_to,
                    expected_inspection_from: data.expected_inspection_from,
                    expected_inspection_to: data.expected_inspection_to,
                    expected_production: data.expected_production,
                    field_location: data.field_location,
                    location_availbility_seed: data.location_availbility_seed,
                    production_center_id: data.user_id,
                    reason: data.reason,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season
                }

                const isExist = await bsp2Model.findOne({
                    where: {
                        year: data.year,
                        season: data.season,
                        user_id: req.body.loginedUserid.id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                    }
                });

                if (isExist && Object.keys(isExist).length) {
                    throw new Error(status.DATA_ALREADY_EXIST);
                }

                const row = await bsp2Model.create(dataToInsert, {
                    raw: true,
                    nest: true,
                });
               
                if (row) {
                    await bsp1Model.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: {
                                [Op.in]: (data.bspIdArr)
                              },
                            
                        }
                    });
                }
                return { id: row.id };
            }));

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

    static update = async (req, res) => {
        try {
            const formData = req.body;

            // const rules = {
            //     'id': 'required|integer',
            //     'area': 'required|string',
            //     'bsp_1_id': 'required|integer',
            //     'crop_code': 'required|string',
            //     'date_of_sowing': 'required|string',
            //     'is_active': 'required|integer',
            //     'isdraft': 'integer',
            //     'document': 'string',
            //     'expected_availbility': 'required|string',
            //     'expected_harvest_from': 'required|string',
            //     'expected_harvest_to': 'required|string',
            //     'expected_inspection_from': 'required|string',
            //     'expected_inspection_to': 'required|string',
            //     'expected_production': 'required|string',
            //     'field_location': 'required|string',
            //     'location_availbility_seed': 'required|string',
            //     'production_center_id': 'required|integer',
            //     'reason': 'required|string',
            //     'user_id': 'required|integer',
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

            const condition = {
                where: {
                    id: formData.id
                }
            };

            const isExist = await bsp2Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                area: formData.area,
                bsp_1_id: formData.bsp_1_id,
                bsp1ids: formData.bsp1ids,
                crop_code: formData.crop_code,
                date_of_sowing: formData.date_of_sowing,
                document: formData.document,
                lat: formData.lat,
                long: formData.long,
                expected_availbility: formData.expected_availbility,
                expected_harvest_from: formData.expected_harvest_from,
                expected_harvest_to: formData.expected_harvest_to,
                expected_inspection_from: formData.expected_inspection_from,
                expected_inspection_to: formData.expected_inspection_to,
                expected_production: formData.expected_production,
                field_location: formData.field_location,
                location_availbility_seed: formData.location_availbility_seed,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                if_not_being_produced: formData.if_not_being_produced,
                production_center_id: formData.production_center_id,
                reason: formData.reason,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                season: formData.season
            };

            const data = await bsp2Model.update(dataToUpdate, condition);
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

            // fetching data in db
            const condition = {
                where: {
                    id: req.params.id,
                }
            };
            const isExist = await bsp2Model.count(condition);

            // if data not found
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            //else
            const data = await bsp2Model.destroy(condition);
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

            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.year')), 'year'],
                ],
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
            const year = Number(req.query.year)
            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },
                where: {
                    year: year
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
            const user = req.body.loginedUserid;
            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.crop_code')), 'crop_code'],
                ],
                order:[[sequelize.col('m_crop.crop_name'),'ASC']],
                include: [{
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                },
                {
                    model:bsp1ProductionCenterModel,
                    attributes:[],
                    where:{
                        production_center_id:user.id
                    }
                }
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

    static getYearDataForBSP2List = async (req, res) => {
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

    static getSeasonDataForBSP2List = async (req, res) => {
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

    static getCropGroupDataForBSP2List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.crop_group_code')), 'crop_group_code']
                ],

                where: {
                    year,
                    season
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

    static getCropsDataForBSP2List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.crop_code')), 'crop_code'],
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

    static getVarietiesDataForBSP2List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await bsp2Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_2s.variety_id')), 'variety_id'],
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

module.exports = Bsp2Controller;



