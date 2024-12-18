const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { bsp1Model, agencyDetailModel, indenterModel, cropModel, varietyModel, BSP1ProductionCenterModel, bsp1ProductionCenterModel, seasonModel, cropGroupModel, userModel } = require('../models');
const indentorHelper = require('../_helpers/indentor');
const pagination = require('../_helpers/bsp');
const Sequelize = require('sequelize');
const bsp3Helper = require('../_helpers/bsp3');
class Bsp1Controller {

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
        const bsp1Data = await bsp1Model.findAll(condition);
        if (!(bsp1Data && bsp1Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp1Data.filter(element => {
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
        const bsp1Data = await bsp1Model.findAll(condition);
        if (!(bsp1Data && bsp1Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp1Data.filter(element => {
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

    static getAll = async (req, res) => {
        try {
            let condition = {
               
                // attributes: ['id', 'year'],
                include: [
                    // {
                    //     model: agencyDetailModel,
                    //     left: true,
                    //     attributes: ['id', 'agency_name'],
                    // },
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
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
           /*         {
                        model:bsp1ProductionCenterModel,
                        left:true,
                        attributes:['id'],
                        include:[
                            {
                                model:userModel,
                                attributes:['name']
                            }
                        ]
                    }*/
                ],

              
                raw: true,
                nest: true,
            };

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };
            const bsp1Data = await bsp1Model.findAndCountAll(dataToSend);
            console.log(bsp1Data,'bsp1Data')
            
            const rows = await Promise.all(bsp1Data.rows.map(async bsp1 => {
                const productionCenter = await bsp1ProductionCenterModel.findAll({
                    attributes: ['quantity_of_seed_produced'],
                    where: {
                        bsp_1_id: bsp1.id,
                    }
                });
                const nucleusSeed = await productionCenter.reduce((prevVal, curVal) => {
                    return prevVal + Number(curVal.quantity_of_seed_produced, 10);
                }, 0);
                bsp1.quantity_of_seed_produced = nucleusSeed;
                return bsp1;
            }));
            const data = { rows: rows, count: bsp1Data.count };
         
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
                include: [
                    {
                        model: agencyDetailModel,
                        left: true,
                        attributes: ['id', 'agency_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'release_date'],
                    },
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                    },
                ],
                where: {
                    id,
                },
                raw: true,
                nest: true
            };
            let data = await bsp1Model.findOne(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            data.production_center_id = await indentorHelper.productionCenterName(data.id, data.user_id, data.variety_id);
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

            // validation on data received from frontend BSP1 proforma
            const rules = {
                'data.*.year': 'required|integer',
                'data.*.crop_code': 'required|integer',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.variety_id': 'required|string',
                'data.*.season': 'required|string'
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
            //

            //creation of bsp1 form
            const bsp1Data = await Promise.all(formData.map(async data => {
                const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);
                const dataToInsert = {
                    year: data.year_of_indent,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    indent_of_breederseed_id: data.indent_of_breederseed_id,
                    agency_detail_id: data.agency_detail_id,
                    season: data.season
                }

                const isExist = await bsp1Model.findOne({
                    where: {
                        year: data.year_of_indent,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
			season: data.season
                    },
                    attributes: ['*'],
                    raw: true,
                });
console.log("isExist",isExist)
                if (isExist && Object.keys(isExist).length) {
                    throw new Error(status.DATA_ALREADY_EXIST);
                }

                const row = await bsp1Model.create(dataToInsert);
                if (row) {
                    data.production_center_details.forEach(async productionCenter => {
                        const dataToInsert = {
                            bsp_1_id: row.id,
                            quantity_of_seed_produced: productionCenter.breeder_seed_quantity,
                            members: productionCenter.monitoring_team_memebers_count,
                            production_center_id: productionCenter.production_center_id
                        };
                        await bsp1ProductionCenterModel.create(dataToInsert);
                    });
                    await indenterModel.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.indent_of_breederseed_id,
                        }
                    });
                }
                return { id: row.id };
            }));
            return response(res, status.DATA_AVAILABLE, 200, bsp1Data);
        }
        catch (error) {
		console.log("error", error);
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

            const isExist = await bsp1Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                year: formData.year_of_indent,
                crop_code: formData.crop_code,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                indent_of_breederseed_id: formData.indent_of_breederseed_id,
                agency_detail_id: formData.agency_detail_id,
                season: formData.season
            };

            const data = await bsp1Model.update(dataToUpdate, condition);
            if (data) {
                formData.production_center_details.forEach(async productionCenter => {
                    const dataToInsert = {
                        bsp_1_id: formData.id,
                        quantity_of_seed_produced: productionCenter.breeder_seed_quantity,
                        members: productionCenter.monitoring_team_memebers_count,
                        production_center_id: productionCenter.production_center_id
                    };
                    await bsp1ProductionCenterModel.update(dataToInsert, {
                        where: {
                            id: productionCenter.id
                        }
                    });
                });
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
            const isExist = await bsp1Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data = await bsp1Model.destroy(condition);
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

    static getYearDataForBSP1List = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            if (!user_id) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.year')), 'year'],
                ],
                where: {
                    user_id: user_id,
                    icar_freeze:1
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

    static getSeasonDataForBSP1List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;

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
                    year: year,
                    user_id: user_id,
                    icar_freeze:1
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

    static getCropGroupDataForBSP1List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const user_id = Number(req.query.user_id);

            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.crop_group_code')), 'crop_group_code']
                ],

                include: {
                    attributes: ['group_name'],
                    model: cropGroupModel,
                    left: true,
                },

                where: {
                    year: year,
                    season: season,
                    user_id: user_id,
                    icar_freeze:1
                },

                raw: true,
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);

        } catch (error) {
            console.log(error);
            return response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    }

    static fetchCropNameByYearAndSeason = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const icar_freeze = req.query.icar_freeze;
            const user = req.body.loginedUserid;
            const data = await indenterModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],

                    'crop_name'
                ],

                where: {
                    year,
                    season,
                    icar_freeze,

                },

                raw: true,
            });
            let crops = [];
            await Promise.all(data.map(async el => {
                const cropCode = await cropModel.findOne({
                    where: {
                        crop_code: el.crop_code,
                        crop_name: el.crop_name,
                        breeder_id: user.id,
                    },
                    raw: true,
                });
                if (cropCode && cropCode.crop_code === el.crop_code) {
                    crops.push(el);
                }
            }));
            response(res, status.DATA_AVAILABLE, 200, crops);
        } catch (error) {
            console.log(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    }

    static getCropsDataForBSP1List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = Number(req.query.user_id);

            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.crop_code')), 'crop_code'],
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
                    crop_group_code: cropGroup,
                    icar_freeze:1
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

    static getVarietiesDataForBSP1List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const icar_freeze = req.query.icar_freeze;

            const user_id = Number(req.query.user_id);
            
            const data = await bsp1Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_1s.variety_id')), 'variety_id'],
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
                    user_id: user_id,
                    icar_freeze:1
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

module.exports = Bsp1Controller;
