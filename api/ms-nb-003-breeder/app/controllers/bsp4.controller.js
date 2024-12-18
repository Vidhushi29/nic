const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, designationModel, cropModel, bsp1Model, bsp2Model, bsp4Model, bsp3Model, userModel, varietyModel, bsp1ProductionCenterModel, seasonModel, bsp4ToPlant } = require('../models');
const FileUpload = require('../_helpers/upload');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');

class Bsp4Controller {

    static bsp4Proforma = async (req, res) => {
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
                            model: bsp3Model,
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
            console.log('plainUser', plainUser);
            const uniqueCrops = [];
            const crops = [];
            const uniqueYear = [];
            const years = [];
            // const uniqueVariety = [];

            const data = await plainUser.bsp_3s.filter(element => {
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
            delete plainUser.bsp_3s;
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
        const bsp4Data = await bsp4Model.findAll(condition);
        if (!(bsp4Data && bsp4Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp4Data.filter(element => {
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
        const bsp4Data = await bsp4Model.findAll(condition);
        if (!(bsp4Data && bsp4Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp4Data.filter(element => {
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

    static bsp4ProformaVariety = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName, userId,season } = req.query;
            const condition = {
                attributes: ['id', 'year', 'crop_code', 'variety_id', 'createdAt', 'created_at'],
                include: [
                    {
                        model: bsp2Model,
                        left: true,
                        attributes: ['id', 'createdAt', 'created_at', 'bsp1ids'],
                        include: [
                            {
                                model: bsp1Model,
                                left: true,
                                attributes: ['id', 'createdAt', 'created_at'],
                            },
                        ],
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
                    is_active: 1,
                    monitor_report: "Satisfactory",
                    season:season
                },
                raw: true,
                nest: true,
            };
            const varietyData = await bsp3Model.findAll(condition);

            if (!varietyData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data = await Promise.all(varietyData.map(async variety => {
                // console.log('variety.bsp_2.bsp1ids.spli230',varietyData)
                
                const productionCenter = await bsp1ProductionCenterModel.findAll({
                    attributes: ['quantity_of_seed_produced'],
                    where: {
                        bsp_1_id: variety &&  variety.bsp_2 && variety.bsp_2.bsp1ids && variety.bsp_2.bsp1ids.length ? variety.bsp_2.bsp1ids.split(',') : variety.bsp_2.bsp_1.id,
                        production_center_id: userId,
                    }
                })
                const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                    return prevVal + Number(currVal.quantity_of_seed_produced, 10)
                }, 0);
                
                variety.bsp_2.bsp_1.quantity_of_seed_produced = quantityProduced;
                return variety;
            }));

            
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            console.log(error,'get-bsp4-variety-list')
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
                        model: bsp3Model,
                        left: true,
                        attributes: ['id'],
                        include: [
                            {
                                model: bsp2Model,
                                left: true,
                                attributes: ['id', 'createdAt', 'created_at', 'bsp1ids'],
                                include: [
                                    {
                                        model: bsp1Model,
                                        left: true,
                                        attributes: ['id',],
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
                ],
                raw: true,
                nest: true,
            };

            // condition.attributes = ['id', 'crop_code', 'crop_group_code', 'year', 'variety_id', 'bsp_3_id', 'actual_seed_production', 'carry_over_seed_amount', 'user_id', 'is_freeze', 'isdraft', 'season'];

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };

            const varietyData = await bsp4Model.findAndCountAll(dataToSend);
            if (!varietyData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const rows = await Promise.all(varietyData.rows.map(async variety => {
            
                console.log('variety.bsp_2.fetch.spli324',variety.bsp_3.bsp_2)
               
                const productionCenter = await bsp1ProductionCenterModel.findAll({
                    attributes: ['quantity_of_seed_produced'],
                    where: {
                        bsp_1_id:variety && variety.bsp_3 && variety.bsp_3.bsp_2.bsp1ids && variety.bsp_3.bsp_2.bsp1ids.length && variety.bsp_3.bsp_2.bsp1ids.length ? variety.bsp_3.bsp_2.bsp1ids.split(',') :  variety.bsp_3.bsp_2.bsp_1.id,
                        production_center_id:req.body.search.userId,
                        // bsp_1_id: variety.bsp_3.bsp_2.bsp_1.id,
                        // production_center_id: req.body.search.userId,
                    },
                    raw: true,
                });

                // const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                //     return prevVal + Number(currVal.quantity_of_seed_produced, 10)
                // }, 0);
                // variety.bsp_3.bsp_2.bsp_1.quantity_of_seed_produced = quantityProduced % 1 === 0 ? quantityProduced : quantityProduced.toFixed(2);
                // return variety;

                     const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                       
                    return prevVal + Number(currVal.quantity_of_seed_produced, 10)
                }, 0);
               
                variety.bsp_3.bsp_2.bsp_1.quantity_of_seed_produced = quantityProduced;
                return variety;
            }));

            // const rows = await Promise.all(varietyData.rows.map(async variety => {
            //     const productionCenter = await bsp1ProductionCenterModel.findAll({
            //         attributes: ['quantity_of_seed_produced'],
            //         where: {
            //             bsp_1_id: ariety.bsp_3.bsp_2.bsp_1.id,
            //             production_center_id: userId,
            //         }
            //     })
            //     const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
            //         return prevVal + Number(currVal.quantity_of_seed_produced, 10)
            //     }, 0);
            //     variety.bsp_2.bsp_1.quantity_of_seed_produced = quantityProduced;
            //     return variety;
            // }));


            const data = { rows: rows, count: varietyData.count };

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            console.log('error',error)
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
                // include: [
                // {
                //     model: bsp3Model,
                //     left: true,
                //     attributes: ['id', 'created_at'],
                //     include: [
                //         {
                //             model: bsp2Model,
                //             left: true,
                //             attributes: ['id', 'created_at'],
                //             include: [
                //                 {
                //                     model: bsp1Model,
                //                     left: true,
                //                     attributes: ['id', 'created_at'],
                //                 },
                //             ],
                //         },
                //     ],
                // },
                //     {
                //         attributes: ['id', 'variety_name'],
                //         model: varietyModel,
                //         left: true,
                //     },
                // ],
                // attributes: ['id', 'expected_production', 'area', 'field_location', 'year', 'crop_code'],
                where: {
                    id,
                },
            };
            const data = await bsp4Model.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // if (data.document) {
            //     const extension = data.document.split('.').pop();
            //     const allowedFile = ['jpg', 'png', 'gif', 'jpeg', 'pdf'];
            //     let document;
            //     if (allowedFile.includes(extension)) {
            //         const fileType = FileUpload.allowedFile({ extension });
            //         document = await FileUpload.download({ name: data.document, extension });
            //         console.log(document);
            //         data.document = document || "";
            //     }
            //     data.document = document || "";
            // }

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
                'data.*.variety_id': 'required|integer',
                'data.*.pd_letter_number': 'required|string',
                'data.*.actual_seed_production': 'required|string',
                'data.*.production_year': 'required|string',
                'data.*.carry_over_seed_amount': 'required|integer',
                'data.*.carry_over_last_year_germination': 'required|string',
                'data.*.carry_over_current_year_germination': 'required|string',
                'data.*.isdraft': 'required|integer',
                'data.*.number_of_sample': 'required|integer',
                'data.*.shor_fall_reason': 'required|string',
                'data.*.reason_for_dificit': 'required|string',
                'data.*.short_fall_document': 'required|string',
                'data.*.document': 'required|string',
                'data.*.production_center_id': 'required|integer',
                'data.*.year': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.crop_code': 'required|integer',
                'data.*.production_surplus': 'required|integer',
                'data.*.total_availability': 'required|integer',
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

            console.log(formData)

            const data = await Promise.all(formData.map(async (data) => {
                const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);
                const dataToInsert = {
                    actual_seed_production: data.actual_seed_production,
                    bsp_3_id: data.bsp_3_id,
                    carry_over_current_year_germination: data.carry_over_current_year_germination,
                    carry_over_last_year_germination: data.carry_over_last_year_germination,
                    carry_over_seed_amount: data.carry_over_seed_amount,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    document: data.document,
                    isdraft: data.isdraft || 0,
                    number_of_sample: data.number_of_sample,
                    pd_letter_number: data.pd_letter_number,
                    production_center_id: data.production_center_id,
                    production_surplus: data.production_surplus,
                    production_year: data.production_year,
                    reason_for_dificit: data.reason_for_dificit,
                    shor_fall_reason: data.shor_fall_reason,
                    short_fall_document: data.short_fall_document,
                    total_availability: data.total_availability,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season,
                    harvest_date: data.harvest_date,
                };

                const isExist = await bsp4Model.findOne({
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

                // if (!(data.hasOwnProperty("document") && data.document.hasOwnProperty("photo") && Object.keys(data.document).length)) {
                //     dataToInsert.document = "";
                // } else {
                //     const document = await FileUpload.uploadImage({ upload: data.document });
                //     dataToInsert.document = document || "";
                // }
                const row = await bsp4Model.create(dataToInsert);
                if (row) {
                    await bsp3Model.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.bsp_3_id,
                        }
                    });
                }
                return { id: row.id, variety_id: data.variety_id };
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

            // const rules = {
            //     'actual_seed_production': 'required|string',
            //     'carry_over_current_year_germination': 'required|string',
            //     'carry_over_last_year_germination': 'required|string',
            //     'carry_over_seed_amount': 'required|integer',
            //     'crop_code': 'required|string',
            //     'document': 'string',
            //     'id': 'required|integer',
            //     'number_of_sample': 'required|integer',
            //     'pd_letter_number': 'required|string',
            //     'production_center_id': 'required|integer',
            //     'production_surplus': 'required|integer',
            //     'production_year': 'required|string',
            //     'reason_for_dificit': 'required|string',
            //     'shor_fall_reason': 'required|string',
            //     'short_fall_document': 'required|string',
            //     'total_availability': 'required|integer',
            //     'user_id': 'required|integer',
            //     'variety_id': 'required|integer',
            //     'year': 'required|integer',
            //     'isdraft': 'integer',
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
            const isExist = await bsp4Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                actual_seed_production: formData.actual_seed_production,
                carry_over_current_year_germination: formData.carry_over_current_year_germination,
                carry_over_last_year_germination: formData.carry_over_last_year_germination,
                carry_over_seed_amount: formData.carry_over_seed_amount,
                crop_code: formData.crop_code,
                document: formData.document,
                number_of_sample: formData.number_of_sample,
                pd_letter_number: formData.pd_letter_number,
                production_center_id: formData.production_center_id,
                production_surplus: formData.production_surplus,
                production_year: formData.production_year,
                reason_for_dificit: formData.reason_for_dificit,
                shor_fall_reason: formData.shor_fall_reason,
                short_fall_document: formData.short_fall_document,
                total_availability: formData.total_availability,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                isdraft: formData.isdraft || 0,
                season: formData.season,
                harvest_date: formData.harvest_date,
            };
            const data = await bsp4Model.update(dataToUpdate, condition);

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
            const isExist = await bsp4Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const formData = await bsp4Model.findOne(condition)

            const conditionToRemovePlantsData = {
                where: {
                    year: formData.dataValues.year,
                    season: formData.dataValues.season,
                    crop_code: formData.dataValues.crop_code,
                    variety_id: formData.dataValues.variety_id,
                    bsp4_id: formData.dataValues.id,
                }
            }

            const isPlantExist = await bsp4ToPlant.count(conditionToRemovePlantsData);
            const data = await bsp4Model.destroy(condition);

            if (isPlantExist) {
                await bsp4ToPlant.destroy(conditionToRemovePlantsData);
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

    static getYearDataForBSPForm = async (req, res) => {
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

    static getSeasonDataForBSPForm = async (req, res) => {
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

    static getCropDataForBSPForm = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const user_id = req.query.user_id;

            const data = await bsp3Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_3s.crop_code')), 'crop_code'],
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

    static getYearDataForBSP4List = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.year')), 'year'],
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

    static getSeasonDataForBSP4List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;
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

    static getCropGroupDataForBSP4List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.crop_group_code')), 'crop_group_code']
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

    static getCropsDataForBSP4List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.crop_code')), 'crop_code'],
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

    static getVarietiesDataForBSP4List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.variety_id')), 'variety_id'],
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

module.exports = Bsp4Controller;