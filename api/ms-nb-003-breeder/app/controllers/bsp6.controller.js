const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const {
    agencyDetailModel,
    allocationToIndentorSeed,
    bsp1Model,
    bsp2Model,
    bsp3Model,
    bsp4Model,
    bsp5aModel,
    bsp5bModel,
    bsp6Model,
    cropModel,
    indenterModel,
    userModel,
    varietyModel,
    seasonModel,
    bsp1ProductionCenterModel,
    allocationToIndentorProductionCenterSeed
} = require('../models');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');

class Bsp6Controller {

    static bsp6Proforma = async (req, res) => {
        try {
            const { userId } = req.query;
            let condition = {};
            if (userId) {
                condition = {
                    attributes: ['id', 'crop_code', 'year'],
                    include: {
                        attributes: ['crop_name'],
                        model: cropModel,
                        left: true,
                    },
                    raw: true,
                    nest: true,
                };
            }
            const allocationToIndentorData = await allocationToIndentorSeed.findAll(condition);
            const uniqueCrops = [];
            const crops = [];
            const uniqueYear = [];
            const years = [];
            const data = await allocationToIndentorData.filter((element, index) => {
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
                delete element.m_crop;
                delete element.quantity;
                delete element.id;
                delete element.crop_code;
                delete element.year;
                return false;
            });
            allocationToIndentorData[0]['year'] = years;
            allocationToIndentorData[0]['crop_code'] = crops;

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, allocationToIndentorData[0]);
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
        const bsp6Data = await bsp6Model.findAll(condition);
        if (!(bsp6Data && bsp6Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp6Data.filter(element => {
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
        const bsp6Data = await bsp6Model.findAll(condition);
        if (!(bsp6Data && bsp6Data.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp6Data.filter(element => {
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

    static bsp6ProformaVariety = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName,season } = req.query;
            const condition = {
                // attributes: ['id', 'crop_code', 'indent_of_breeder_id', 'variety_id', 'year'],
                include: [
                    {
                        attributes: ['id', 'variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                ],
                where: {
                    crop_code: cropName,
                    year: year,
                    season:season
                },
                nest: true,
                raw: true,
            };

            const allocationToIndentorData = await allocationToIndentorSeed.findAll(condition);
            console.log('allocationToIndentorData', allocationToIndentorData);
            if (!allocationToIndentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const varietyRows = await Promise.all(allocationToIndentorData.map(async data => {
                // quantityToLift += parseInt(data.quantity);
                const productionCenter = await allocationToIndentorProductionCenterSeed.findAll({
                    attributes: ['id', 'qty'],
                    where: {
                        allocation_to_indentor_for_lifting_seed_id: data.id
                    }
                });
                const quantity = productionCenter.reduce((prevVal, currVal) => {
                    return prevVal + Number(currVal.qty, 10)
                }, 0);
                data.quantity = quantity;
                const indentors = await this.indentors(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp4Data = await this.bsp4Data(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp1Data = await this.bsp1Data(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp5bData = await this.bsp5bData(parseFloat(data.year), data.crop_code, data.variety_id);
                console.log('bsp5bData', bsp5bData);
                data.quantity_of_seed_produced = bsp1Data;
                data.actualProduction = bsp4Data;
                data.quantityAlloted = bsp1Data;
                data.quantityBreederLifted = bsp5bData.quantityBreederLifted;
                data.quantityBreederBalance = bsp5bData.quantityBreederBalance;
                data.totalIndentQuantity = indentors;
                return data;
            }));

            return response(res, status.DATA_AVAILABLE, 200, allocationToIndentorData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static indentors = async (year, cropName, varietyId) => {
        try {
            const indentorData = await indenterModel.findAll({
                attributes: ['id', 'indent_quantity'],
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
            });
            let totalIndentQuantity = 0
            indentorData.forEach(data => totalIndentQuantity += parseFloat(data.indent_quantity));
            return totalIndentQuantity;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static bsp4Data = async (year, cropName, varietyId) => {
        try {
            const bsp4Data = await bsp4Model.findAll({
                attributes: ['id', 'actual_seed_production'],
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
            });
            let actualProduction = 0
            bsp4Data.forEach(data => actualProduction += parseInt(data.actual_seed_production));
            return actualProduction;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static bsp1Data = async (year, cropName, varietyId) => {
        try {
            const bsp1Data = await bsp1Model.findAll({
                attributes: ['id'],
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
            });
            console.log('bsp1Data', bsp1Data);
            let quantityOfSeedProduced;
            const data = await Promise.all(bsp1Data.map(async variety => {
                const productionCenter = await bsp1ProductionCenterModel.findAll({
                    attributes: ['quantity_of_seed_produced'],
                    where: {
                        bsp_1_id: variety.id,
                    },
                    raw: true,
                });
                console.log('productionCenter', productionCenter);
                const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                    return prevVal + Number(currVal.quantity_of_seed_produced, 10)
                }, 0);
                console.log('quantityProduced', quantityProduced);
                quantityOfSeedProduced = quantityProduced
                return true;
            }));
            return quantityOfSeedProduced;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static bsp5bData = async (year, cropName, varietyId) => {
        try {
            const bsp5bData = await bsp5bModel.findAll({
                attributes: ['id', 'lifting_quantity', 'breeder_seed_balance'],
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
            });

            const bsp5Obj = {
                quantityBreederLifted: 0,
                quantityBreederBalance: 0
            };

            bsp5bData.forEach(data => {
                bsp5Obj.quantityBreederLifted += parseFloat(data.lifting_quantity);
                bsp5Obj.quantityBreederBalance += parseFloat(data.breeder_seed_balance);
            });
            return bsp5Obj;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static allocationBreederLifting = async (year, cropName, varietyId) => {
        try {
            const allocationToIndentorData = await allocationToIndentorSeed.findAll({
                attributes: ['id', 'quantity'],
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
            });

            let allocationBreederSeedLifting = 0;

            allocationToIndentorData.forEach(data => {
                allocationBreederSeedLifting += parseInt(data.quantity);
            });
            return allocationBreederSeedLifting;
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static fetch = async (req, res) => {
        try {
            let condition = {
                include: [
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

            const bsp6Data = await bsp6Model.findAndCountAll(dataToSend);
            if (!bsp6Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const bsp6UpdatedData = await Promise.all(bsp6Data.rows.map(async data => {
                const allocationBreederLifting = await this.allocationBreederLifting(parseInt(data.year), data.crop_code, data.variety_id);
                const indentors = await this.indentors(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp4Data = await this.bsp4Data(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp1Data = await this.bsp1Data(parseInt(data.year), data.crop_code, data.variety_id);
                const bsp5bData = await this.bsp5bData(parseInt(data.year), data.crop_code, data.variety_id);
                data.actualProduction = bsp4Data;
                data.allocatbsp6UpdatedDataionBreederLifting = allocationBreederLifting;
                data.quantityAlloted = bsp1Data;
                data.quantityBreederLifted = bsp5bData.quantityBreederLifted;
                data.quantityBreederBalance = bsp5bData.quantityBreederBalance;
                data.totalIndentQuantity = indentors;
                console.log('data', data);
                return data;
            }));

            const data = { rows: bsp6UpdatedData, count: bsp6Data.count };

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
                attributes: ['id', 'allocation_to_indentor_id', 'target', 'address', 'variety_id', 'crop_code', 'year','season'],
                where: {
                    id,
                },
                raw: true,
                nest: true,
            };
            const data = await bsp6Model.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const allocationBreederLifting = await this.allocationBreederLifting(parseInt(data.year), data.crop_code, data.variety_id);
            const indentors = await this.indentors(parseInt(data.year), data.crop_code, data.variety_id);
            const bsp4Data = await this.bsp4Data(parseInt(data.year), data.crop_code, data.variety_id);
            const bsp1Data = await this.bsp1Data(parseInt(data.year), data.crop_code, data.variety_id);
            const bsp5bData = await this.bsp5bData(parseInt(data.year), data.crop_code, data.variety_id);
            data.actualProduction = bsp4Data;
            data.allocationBreederLifting = allocationBreederLifting;
            data.quantityAlloted = bsp1Data;
            data.quantityBreederLifted = bsp5bData.quantityBreederLifted;
            data.quantityBreederBalance = bsp5bData.quantityBreederBalance;
            data.totalIndentQuantity = indentors;

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
                'data.*.address': 'required|string',
                'data.*.allocation_to_indentor_id': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.target': 'required|string',
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
                    address: data.address,
                    allocation_to_indentor_id: data.allocation_to_indentor_id,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    target: data.target,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: data.year,
                    season: data.season
                };

                const isExist = await bsp6Model.findOne({
                    where: {
                        user_id: data.user_id.toString(),
                        season: data.season,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                        year: data.year,
                    }
                });

                if (isExist && Object.keys(isExist).length) {
                    throw new Error(status.DATA_ALREADY_EXIST);
                }

                const row = await bsp6Model.create(dataToInsert);
                if (row) {
                    await allocationToIndentorSeed.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.allocation_to_indentor_id,
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

            // const rules = {
            //     'address': 'required|string',
            //     'allocation_to_indentor_id': 'required|integer',
            //     'crop_code': 'required|string',
            //     'is_active': 'required|integer',
            //     'isdraft': 'integer',
            //     'target': 'required|string',
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
            const isExist = await bsp6Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                address: formData.address,
                allocation_to_indentor_id: formData.allocation_to_indentor_id,
                crop_code: formData.crop_code,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                target: formData.target,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                season: formData.season
            };
            const data = await bsp6Model.update(dataToUpdate, condition);

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
            const isExist = await bsp6Model.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await bsp6Model.destroy(condition);

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
            const data = await bsp5bModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_bs.year')), 'year'],
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
            const data = await bsp5bModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_bs.season')), 'season'],
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
            const season = req.query.season

            const data = await bsp5bModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_bs.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
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
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }


    // API for List Data

    static getYearDataForBSP6List = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await bsp6Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_6s.year')), 'year'],
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

    static getSeasonDataForBSP6List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;
            const data = await bsp6Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_6s.season')), 'season'],
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

    static getCropGroupDataForBSP6List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp6Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_6s.crop_group_code')), 'crop_group_code']
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

    static getCropsDataForBSP6List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            if(req.query && (req.query.user_id != undefined)){
                const user_id = req.query.user_id;
            }

            let condition = {
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_6s.crop_code')), 'crop_code'],
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
                    crop_group_code: cropGroup
                },

                raw: true,
            }

            if (req.query.user_id != undefined) {
                condition.where.user_id = req.query.user_id;
            }

            const data = await bsp6Model.findAll(condition);

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

    static getVarietiesDataForBSP6List = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id;

            const data = await bsp6Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_6s.variety_id')), 'variety_id'],
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

module.exports = Bsp6Controller;
