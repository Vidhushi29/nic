const Validator = require('validatorjs');
const response = require('../_helpers/response');
const Sequelize = require('sequelize');
const status = require('../_helpers/status.conf');
const { bsp4Model, cropModel, varietyModel, seasonModel, indenterModel, bsp1Model, bsp1ProductionCenterModel, bsp2Model, bsp3Model, userModel, labelNumberForBreederseed, seedTestingReportsModel, allocationToIndentorSeed, allocationToIndentorProductionCenterSeed, lotNumberModel, allocationToSPASeed, allocationToSPAProductionCenterSeed, indenterSPAModel, agencyDetailModel, generateBills, stateModel, districtModel, generatedLabelNumberModel } = require('../models');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');
const indentorHelper = require('../_helpers/indentor');
const sequelize = require('sequelize');
const db = require("../models");

const Op = require('sequelize').Op;

class AllocationToSPA {

    // API for List Data

    static yearData = async (req, res) => {
        try {
            const data = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.body.loginedUserid.id
                        },
                        attributes: []
                    }
                ],
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.year')), 'year'],
                ],
                where: {
                    is_active: 1,

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

    static seasonData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const data = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.body.loginedUserid.id
                        },
                        attributes: []
                    }
                ],
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },

                where: {
                    year: year,
                    is_active: 1
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

    static cropGroupData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await allocationToIndentorSeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_group_code')), 'crop_group_code']
                ],

                where: {
                    year,
                    season,
                    is_active: 1
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

    static cropData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await allocationToIndentorSeed.findAll({
                required:true,
                include: [
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.body.loginedUserid.id
                        },
                        attributes: []
                    }
                ],

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                    // where: {
                    //     group_code: cropGroup
                    // },
                },
                where: {
                    year,
                    season,
                    is_active: 1
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

    static varietiesDatav1 = async (req, res) => {
        try {
            const { year, season, cropCode, user_id } = req.query;

            const data = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        left: true,
                        attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation'],
                        // where: {
                        //     production_center_id: user_id
                        // }
                    },
                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    is_active: 1
                    // user_id: user_id
                },
                order: [['created_at', 'DESC']],
                raw: true,
                nest: true,
            });

            const dataspa = await allocationToSPASeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },

                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    user_id: user_id
                },
                order: [['created_at', 'DESC']],
                raw: true,
                nest: true,
            });
            const varieties = bsp3Helper.removeDuplicates(data, 'variety_id');
            let sum = 0;
            varieties.forEach(el => {
                sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.quant, 10);
                sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                return sum;
            });

            const totalAllocationQuantity = data.reduce((acc, curr) => acc + Number(curr.allocation_to_indentor_for_lifting_seed_production_cnters.qty, 10), 0);


            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, {
                varieties: varieties,
                totalNumberOfVariety: varieties.length,
                totalIndentQuantity: sum,
                totalAllocationQuantity,
                dataspa: dataspa
            });
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static varietiesData = async (req, res) => {
        try {
            const { year, season, cropCode, user_id } = req.query;

            // const data = await allocationToIndentorSeed.findAll({
            //     include: [
            //         {
            //             model: varietyModel,
            //             left: true,
            //             attributes: ['id', 'variety_name', 'variety_code'],
            //         },
            //         {
            //             model: allocationToIndentorProductionCenterSeed,
            //             left: true,
            //             attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation'],
            //             // where: {
            //             //     production_center_id: user_id
            //             // }
            //         },
            //     ],
            //     where: {
            //         year: Number(year),
            //         season,
            //         crop_code: cropCode,
            //         is_active:1
            //         // user_id: user_id
            //     },
            //     order: [['created_at', 'DESC']],
            //     raw: true,
            //     nest: true,
            // });

            const dataspa = await allocationToSPASeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },

                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    user_id: user_id
                },
                order: [['created_at', 'DESC']],
                raw: true,
                nest: true,
            });
            // const varieties = bsp3Helper.removeDuplicates(data, 'variety_id');
            // let sum = 0;
            // varieties.forEach(el => {
            //     sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.quant, 10);
            //     sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
            //     return sum;
            // });

            // const totalAllocationQuantity = data.reduce((acc, curr) => acc + Number(curr.allocation_to_indentor_for_lifting_seed_production_cnters.qty, 10), 0);

            const data = await db.availabilityOfBreederSeedModel.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    // is_active:1
                    // user_id: user_id
                },
                // order: [['created_at', 'DESC']],
                raw: true,
                nest: true,
            });
            let varietyId = [];
            let varietyCode = []
            if (data && data.length > 0) {
                data.forEach((el) => {
                    varietyId.push({
                        variety_id: el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '',
                        variety_code: el && el.m_crop_variety && el.m_crop_variety.variety_code ? el.m_crop_variety.variety_code : '',
                        variety_line_code: el && el.variety_line_code ? el.variety_line_code : ''
                    });
                    varietyCode.push(el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '');

                })
            }


            let allocatedQuantityparental = await db.allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    variety_id: {
                        [Op.in]: varietyCode
                    }
                },
                raw: true,
                attributes: ['variety_id']
            })
            if (varietyId && allocatedQuantityparental && allocatedQuantityparental.length > 0 && varietyId.length > 0) {
                const secondArrayMap = varietyId.reduce((acc, item) => {
                    acc[item.variety_id] = item;
                    return acc;
                }, {});

                // Merge the arrays based on variety_id
                allocatedQuantityparental = allocatedQuantityparental.map(item => ({
                    ...item,
                    ...(secondArrayMap[item.variety_id] || {})
                }));
            }
            let varieties = allocatedQuantityparental;

            let datas2 = await Promise.all(allocatedQuantityparental.map(async el => {
                let allocatedQuantity2;
                let allocatedQuantityparental
                if (el && el.variety_line_code) {
                    allocatedQuantityparental = await db.indentorBreederSeedModel.findAll({
                        include: [
                            {
                                model: db.indentOfBrseedLines,
                                where: {
                                    variety_code_line: el.variety_line_code
                                },
                                attributes: []
                            }
                        ],
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_brseed_line.quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            user_id: req.query.user_id,
                            season,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id
                        },
                        raw: true,
                        nest: true,
                    });


                } else {
                    allocatedQuantity2 = await db.indentorBreederSeedModel.findAll({
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            season,
                            user_id: req.query.user_id,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id
                        },
                        raw: true,
                        nest: true,
                    });

                }
                let indentQtyData = []
                // indentQtyData.push(allocatedQuantityparental,'allocatedQuantityparental')
                // const combinedArray = allocatedQuantity2.concat(allocatedQuantityparental);
                if (allocatedQuantityparental) {
                    indentQtyData = indentQtyData.concat(allocatedQuantityparental)
                }
                if (allocatedQuantity2) {
                    indentQtyData = indentQtyData.concat(allocatedQuantity2)
                }
                return indentQtyData

                // return el.allocation_to_indentor_for_lifting_seed_production_cnters;
            }));
            let datas = await Promise.all(allocatedQuantityparental.map(async el => {
                let allocatedQuantity2;
                let item = await db.availabilityOfBreederSeedModel.findAll({
                    where: {
                        variety_code: el.variety_code
                    },
                    attributes: [
                        [sequelize.literal("Sum(availability_of_breeder_seed.allocate_qty)"), "allocate_qty"],
                    ],
                    raw: true,

                })
                return item

            }));

            let allocationData = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.query.user_id
                        },
                        attributes: []
                    }
                ],
                attributes: [
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'qty'],
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id'), 'id'],
                    // [sequelize.literal('SUM(allocation_to_indentor_for_lifting_seed_production_cnters.allocated_quantity)'), 'allocated_quantity'],
                ],
                // group:[
                //     'allocation_to_indentor_for_lifting_seed_production_cnters.id'
                // ],
                where: {
                    crop_code: cropCode,
                    year,
                    season,
                    // user_id:req.query.user_id,
                    // crop_group_code: cropGroup,
                    // variety_id: el.variety_id
                },
                raw: true
            })

            const totalAllocationQuantity = allocationData.reduce((acc, current) => acc + current.qty, 0);
            console.log('data', totalAllocationQuantity)

            let sum = 0;
            if (datas2 && datas2.length > 0) {
                datas2 = datas2 ? datas2.flat() : '';
                // console.log(productionCenters,'productionCenters')
                datas2.forEach(el => {
                    sum += Number(el.target_qunatity, 10);
                    // sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                    return sum;
                });
            }
            let allocatedQuantityparental2 = await db.allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    },
                    {
                        required:false,
                        model: allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.query.user_id,
                            qty: {
                                [Op.gte]: 0
                            }
                        },
                        attributes: []
                    }
                ],
                where: {
                    variety_id: {
                        [Op.in]: varietyCode
                    },
                    // user_id: req.query.user_id,
                },
                // raw:true,
                attributes: ['variety_id', 'variety_line_code',]
            })
            let varietyData = await db.allocationToSPASeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    user_id: req.query.user_id,
                },
                raw: true,
                attributes: ['variety_id', 'variety_line_code', 'is_active']
            })
            console.log(allocatedQuantityparental2,'allocatedQuantityparental2')
            console.log(varietyData,'varietyData')
            let exclusiveArray = allocatedQuantityparental2.filter(item => {
                if (item.variety_line_code) {
                    return !varietyData.some(
                        secondItem =>
                            secondItem.variety_id === item.variety_id &&
                            secondItem.variety_line_code === item.variety_line_code
                    );
                } else {
                    return !varietyData.some(secondItem => secondItem.variety_id === item.variety_id);
                }
            });
            let varieties2 = []
            exclusiveArray = this.removeDuplicates(exclusiveArray, 'variety_id')
            varietyData = this.removeDuplicates(varietyData, 'variety_id')
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, {
                // data,
                varieties: exclusiveArray,
                varietiesforedit: varietyData,
                totalNumberOfVariety: allocatedQuantityparental2.length,
                totalIndentQuantity: sum,
                totalAllocationQuantity,
                // dataspa: dataspa
            });
        }
        catch (error) {
            console.log(error, 'error')
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static lotNumber = async (year, cropName, varietyId, userId) => {
        try {
            const lotNumber = await lotNumberModel.findAll({
                attributes: ['id', 'lot_number', 'lot_number_size'],
                include: {
                    attributes: ['id', 'lot_number', 'is_report_pass'],
                    left: true,
                    model: seedTestingReportsModel,
                    where: {
                        is_report_pass: true,
                    },
                },
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                    breeder_production_center_id: userId
                },
                raw: true,
                nest: true,
            });
            return lotNumber;
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static varietyDatav1 = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const { season, cropCode, cropVariety, user_id: userId } = req.query;

            const agencyDetail = await agencyDetailModel.findOne({
                attributes: ['id', 'state_id'],
                where: {
                    id: req.body.loginedUserid.agency_id
                },
                raw: true,
            });
            // console.log('agency_detail', agencyDetail);

            const varietyCode = await varietyModel.findOne({
                where: {
                    id: cropVariety
                },
                raw: true,
            });

            let SPA = await indenterSPAModel.findAll({
                attributes: ['id', 'indent_quantity', 'user_id', 'unit', 'spa_code', 'state_code'],
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,
                    include: {
                        model: agencyDetailModel,
                        left: true
                    },
                    where: {
                        id: {
                            [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agencyDetail.state_id} AND user_type = 'SPA')`)
                        }
                    },
                },
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_code: varietyCode.variety_code,
                    state_code: agencyDetail.state_id,
                },
                raw: true,
                nest: true,
            });
            console.log('SPA', SPA);
            if (!SPA) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            SPA.map(el => {
                el.user.name = el.user.agency_detail.agency_name;
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            const allocationToIndentor = await allocationToIndentorSeed.findAll({
                include: {
                    attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                    model: allocationToIndentorProductionCenterSeed,
                    left: true,
                    where: {
                        indent_of_breeder_id: userId,
                    }
                },
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_id: cropVariety,
                },
                raw: true,
                nest: true,
            });


            if (!allocationToIndentor) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const uniqueIndentors = bsp3Helper.removeDuplicates(allocationToIndentor, 'variety_id');

            let sum = 0;
            uniqueIndentors.forEach(el => {
                sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.quant, 10);
                sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                return sum;
            });

            let totalAllocationQuantity = 0;
            const productionCenters = await Promise.all(allocationToIndentor.map(async el => {

                totalAllocationQuantity += el.allocation_to_indentor_for_lifting_seed_production_cnters.qty;
                const userName = await userModel.findOne({
                    attributes: ['name'],
                    where: {
                        id: el.allocation_to_indentor_for_lifting_seed_production_cnters.produ,
                    },
                    raw: true,
                });
                el.allocation_to_indentor_for_lifting_seed_production_cnters.user = {
                    name: userName.name
                };
                return el.allocation_to_indentor_for_lifting_seed_production_cnters;
            }));

            if (!productionCenters) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const totalIndentQuantity = bsp3Helper.sumOfAllElements(SPA, 'indent_quantity');
            // const totalAllocationQuantity = bsp3Helper.sumOfAllElements(productionCenters, 'alloc');
            let totalLots = [];
            let weight = 0;
            let uniqueProduction = [];
            let productions = [];
            const uniqueData = productionCenters.filter(el => {
                const isExist = uniqueProduction.includes(el.produ);

                if (!isExist) {
                    uniqueProduction.push(el.produ);
                    productions.push(el);
                } else {
                    const index = productions.findIndex(item => item.produ === el.produ);
                    if (index !== -1) {
                        productions[index].alloc += el.alloc;
                        productions[index].qty += el.qty;
                    }
                    // console.log(index);
                }
                // console.log('uniqueProduction', uniqueProduction);
                // console.log('productions', productions);
            });

            let productioncentersecond2 = await allocationToSPASeed.findAll({
                where: {
                    season: season,
                    year: year,
                    user_id: userId,
                    variety_id: cropVariety
                },
                attributes: ['variety_id'],
                include: [{
                    model: allocationToSPAProductionCenterSeed,
                    include: [{
                        model: userModel,
                        attributes: ['id', 'name'],
                    }]
                }]
            })

            let uniqueDataProduction = Array.from(productions.reduce((map, item) => {
                const key = item.production_center_id + item.user.name;
                if (!map.has(key)) {
                    map.set(key, item);
                }
                return map;
            }, new Map()).values());

            // console.log('uniqueData', uniqueData);
            // console.log('uniqueDataProduction', uniqueDataProduction);
            const lablesProduced = await Promise.all(uniqueDataProduction.map(async el => {
                // const labelNumbers = await indentorHelper.labelNumbers(cropCode, year, season, cropVariety, el.production_center_id);
                const lot = await this.lotNumber(parseInt(year), cropCode, cropVariety, el.produ);

                const weights = lot.filter(el => el !== undefined).reduce((total, obj) => total + parseInt(obj.lot_number_size), 0);
                totalLots.push(weights);
                // console.log('weights', weights);
                // console.log('weight', weight);
                weight += Number(weights, 10);
                el.quantityProduced = weight || 0;
                el.quantityAllocated = 0;
                el.quantityLeft = 0;
                weight = 0;
                return el;
            }));
            // const totalAllocationQuantity = totalLots.reduce((acc, curr) => acc + curr, 0);

            uniqueDataProduction = uniqueDataProduction.filter(item => item.qty > 0 || item.qty != '');
            // console.log('uniqueDataProductionuniqueDataProduction',uniqueDataProduction)

            return response(res, status.DATA_AVAILABLE, 200, {
                indentors: SPA,
                productionCenters: uniqueDataProduction,
                totalIndentQuantity: sum,
                totalAllocationQuantity,
                productioncentersecond2: productioncentersecond2
            });
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static varietyDatav3 = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const { season, cropCode, cropVariety, user_id: userId } = req.query;

            const agencyDetail = await agencyDetailModel.findOne({
                attributes: ['id', 'state_id'],
                where: {
                    id: req.body.loginedUserid.agency_id
                },
                raw: true,
            });
            // console.log('agency_detail', agencyDetail);

            const varietyCode = await varietyModel.findOne({
                where: {
                    id: cropVariety
                },
                raw: true,
            });

            console.log(agencyDetail, 'agencyDetail.state_id')
            let SPA = await indenterSPAModel.findAll({
                attributes: ['id', 'indent_quantity', 'user_id', 'unit', 'spa_code', 'state_code'],
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,
                    include: {
                        model: agencyDetailModel,
                        left: true
                    },
                    where: {
                        id: {
                            [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agencyDetail.state_id} AND user_type = 'SPA')`)
                        }
                    },
                },
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_code: varietyCode.variety_code,
                    state_code: agencyDetail.state_id,
                },
                raw: true,
                nest: true,
            });
            console.log('SPA', SPA);
            if (!SPA) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            SPA.map(el => {
                el.user.name = el.user.agency_detail.agency_name;
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            const varietyData = await varietyModel.findAll({
                where: {
                    id: cropVariety
                },
                raw: true,
                attributes: ['variety_code']
            })
            const allocationToIndentor2 = await db.availabilityOfBreederSeedModel.findAll({
                // include: {
                //     attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                //     model: allocationToIndentorProductionCenterSeed,
                //     left: true,
                //     where: {
                //         indent_of_breeder_id: userId,
                //     }
                // },
                attributes: [
                    [sequelize.literal("Sum(availability_of_breeder_seed.allocate_qty)"), "allocate_qty"],
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                },
                raw: true,
                nest: true,
            });

            // let sum2 = 0;



            let totalAllocationQuantity = 0;
            allocationToIndentor2.forEach(el => {
                totalAllocationQuantity += Number(el.allocate_qty, 10);
                // sum2 += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                return totalAllocationQuantity;
            });
            // const productionCenters = await Promise.all(allocationToIndentor.map(async el => {

            //     totalAllocationQuantity += el.allocation_to_indentor_for_lifting_seed_production_cnters.qty;
            //     const userName = await userModel.findOne({
            //         attributes: ['name'],
            //         where: {
            //             id: el.allocation_to_indentor_for_lifting_seed_production_cnters.produ,
            //         },
            //         raw: true,
            //     });
            //     el.allocation_to_indentor_for_lifting_seed_production_cnters.user = {
            //         name: userName.name
            //     };
            //     return el.allocation_to_indentor_for_lifting_seed_production_cnters;
            // }));

            // if (!productionCenters) {
            //     return response(res, status.DATA_NOT_AVAILABLE, 404);
            // }


            let productioncentersecond2 = await allocationToSPASeed.findAll({
                where: {
                    season: season,
                    year: year,
                    user_id: userId,
                    variety_id: cropVariety
                },
                attributes: ['variety_id'],
                include: [{
                    model: allocationToSPAProductionCenterSeed,
                    include: [{
                        model: userModel,
                        attributes: ['id', 'name'],
                    }]
                }]
            })

            // let uniqueDataProduction = Array.from(productions.reduce((map, item) => {
            //     const key = item.production_center_id + item.user.name;
            //     if (!map.has(key)) {
            //         map.set(key, item);
            //     }
            //     return map;
            // }, new Map()).values());
            let productionData = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                        model: allocationToIndentorProductionCenterSeed,

                        left: true,
                        where: {
                            // production_center_id: userId,
                        }
                    },

                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_id: cropVariety,
                },
                raw: true,
                nest: true,
            });
            const allocationToSPAProd = await Promise.all(productionData.map(async (el) => {
                const productionCenters = await userModel.findAll({
                    where: {
                        id: el.allocation_to_indentor_for_lifting_seed_production_cnters.produ,
                    },
                    raw: true
                });
                // console.log(productionCenters,'productionCenters')
                if (productionCenters && productionCenters.length > 0) {
                    let userdata = []
                    productionCenters.forEach((item) => {
                        // userdata.push({
                        //     id:item && item.id ? item.id:'',
                        //     name:item && item.name ? item.name:''
                        // })
                        el.user = {
                            name: item && item.name ? item.name : '', id: item && item.id ? item.id : '', production_center_id: item && item.id ? item.id : '',
                            value: item && item.id ? item.id : '',
                            produ: item && item.id ? item.id : '',
                        }
                    })
                    // el.userdata=userdata;
                }

                // const sum = productionCenters.reduce((prev, curr) => {
                //     return prev + Number(curr.qty, 10);
                // }, 0);

                // console.log('sum', sum);
                // el.quantity = sum;
                return el;
            }));

            productionData = bsp3Helper.removeDuplicates(productionData, 'allocation_to_indentor_for_lifting_seed_production_cnters.produ')
            const variety = await varietyModel.findAll({
                where: {
                    id: cropVariety
                },
                raw: true,
                attributes: ['variety_code']
            })
            const allocationToSPAProd2 = await Promise.all(productionData.map(async (el) => {
                const productionCenters = await db.availabilityOfBreederSeedModel.findAll({
                    where: {
                        year: year,
                        season: season,
                        crop_code: cropCode,
                        variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : ''
                    },
                    raw: true
                });
                console.log(productionCenters, 'productionCenters')
                if (productionCenters && productionCenters.length > 0) {
                    let userdata = []
                    productionCenters.forEach((item) => {
                        el.quantityProduced = item && item.allocate_qty ? el.allocate_qty : 0
                    })
                    // el.userdata=userdata;
                }

                return el;
            }));
            const datav1 = await db.availabilityOfBreederSeedModel.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : ''
                    // is_active:1
                    // user_id: user_id
                },
                // order: [['created_at', 'DESC']],
                raw: true,
                nest: true,
            });
            let varietyId = [];
            let varietyCode3 = []
            if (datav1 && datav1.length > 0) {
                datav1.forEach((el) => {
                    varietyId.push({
                        variety_id: el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '',
                        variety_code: el && el.m_crop_variety && el.m_crop_variety.variety_code ? el.m_crop_variety.variety_code : '',
                        variety_line_code: el && el.variety_line_code ? el.variety_line_code : ''
                    });
                    varietyCode3.push(el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '');

                })
            }


            let allocatedQuantityparental = await db.allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    variety_id: {
                        [Op.in]: varietyCode3
                    }
                },
                raw: true,
                attributes: ['variety_id']
            })
            if (varietyId && allocatedQuantityparental && allocatedQuantityparental.length > 0 && varietyId.length > 0) {
                const secondArrayMap = varietyId.reduce((acc, item) => {
                    acc[item.variety_id] = item;
                    return acc;
                }, {});

                // Merge the arrays based on variety_id
                allocatedQuantityparental = allocatedQuantityparental.map(item => ({
                    ...item,
                    ...(secondArrayMap[item.variety_id] || {})
                }));
            }

            let allocationToSPAProd3 = await Promise.all(allocatedQuantityparental.map(async (el) => {
                let allocatedQuantity2;
                let allocatedQuantityparental
                if (el && el.variety_line_code) {
                    allocatedQuantityparental = await db.indentorBreederSeedModel.findAll({
                        include: [
                            {
                                model: db.indentOfBrseedLines,
                                where: {
                                    variety_code_line: el.variety_line_code
                                },
                                attributes: []
                            }
                        ],
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_brseed_line.quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            season,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id
                        },
                        raw: true,
                        nest: true,
                    });


                } else {
                    allocatedQuantity2 = await db.indentorBreederSeedModel.findAll({
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            season,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id
                        },
                        raw: true,
                        nest: true,
                    });

                }
                let indentQtyData = []
                // indentQtyData.push(allocatedQuantityparental,'allocatedQuantityparental')
                // const combinedArray = allocatedQuantity2.concat(allocatedQuantityparental);
                if (allocatedQuantityparental) {
                    indentQtyData = indentQtyData.concat(allocatedQuantityparental)
                }
                if (allocatedQuantity2) {
                    indentQtyData = indentQtyData.concat(allocatedQuantity2)
                }
                return indentQtyData

            })
            )
            let sumindent = 0;
            if (allocationToSPAProd3 && allocationToSPAProd3.length > 0) {
                allocationToSPAProd3 = allocationToSPAProd3 ? allocationToSPAProd3.flat() : '';
                // console.log(productionCenters,'productionCenters')
                allocationToSPAProd3.forEach(el => {
                    sumindent += Number(el.target_qunatity, 10);
                    // sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                    return sumindent;
                });
            }

            return response(res, status.DATA_AVAILABLE, 200, {
                indentors: SPA,
                productionCenters: productionData,
                totalIndentQuantity: sumindent,
                totalAllocationQuantity,
                productioncentersecond2: productioncentersecond2
            });
        }
        catch (error) {
            console.log(error)
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
                        attributes: ['id', 'crop_name', 'crop_code'],
                        model: cropModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'variety_name', 'variety_code'],
                        model: varietyModel,
                        left: true,
                    }
                ],
                raw: true,
                nest: true
            }

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };
            const allocationToSPA = await allocationToSPASeed.findAndCountAll(dataToSend);
            const allocationToSPAProd = await Promise.all(allocationToSPA.rows.map(async (el) => {
                const productionCenters = await allocationToSPAProductionCenterSeed.findAll({
                    where: {
                        allocation_to_spa_for_lifting_seed_id: el.id,
                    },
                    raw: true
                });
                console.log('productionCenters', productionCenters);
                const sum = productionCenters.reduce((prev, curr) => {
                    return prev + Number(curr.qty, 10);
                }, 0);
                console.log('sum', sum);
                el.quantity = sum;
                return el;
            }));
            console.log('allocationToSPAProd', allocationToSPAProd);
            const data = { rows: allocationToSPAProd, count: allocationToSPA.count };

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static fetchsecond = async (req, res) => {
        try {
            const condition = {
                include: [
                    {
                        attributes: ['id', 'crop_name', 'crop_code'],
                        model: cropModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'variety_name', 'variety_code'],
                        model: varietyModel,
                        left: true,
                    },
                    {
                        model: allocationToSPAProductionCenterSeed,
                        left: true
                    }
                ],
                raw: true,
                nest: true
            }

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };
            const allocationToSPA = await allocationToSPASeed.findAndCountAll(dataToSend);

            const data = []
            allocationToSPA.rows.forEach(element => {
                const index = data.findIndex(x => x.id == element.id)

                if (index > -1) {
                    data[index]['allocationData'].push(element['allocation_to_spa_for_lifting_seed_production_cnters'])

                } else {
                    let arr = [];
                    arr.push(element.allocation_to_spa_for_lifting_seed_production_cnters)
                    // console.log(element,'6000')
                    let object = {
                        id: element.id,
                        year: element.year,
                        season: element.season,
                        crop: element.m_crop,
                        variety: element.m_crop_variety,
                        indentquantity: element.qty,
                        producedquantity: element.producedquantity,
                        allocationQuantity: 0,
                        allocationData: arr
                    }
                    data.push(object)
                }

            });

            const result = []
            data.forEach(element => {
                // console.log(element)
                element.allocationData.forEach(data => {
                    element.allocationQuantity += data.qty
                });

                const index = result.findIndex(x => {
                    if (x.year == element.year && x.season == element.season && x.crop.crop_code == element.crop.crop_code) {
                        return x
                    }
                })


                if (index > -1) {
                    result[index]['indentquantity'] = Number(result[index]['indentquantity']) + Number(element.qty);
                    result[index]['producedquantity'] = Number(result[index]['producedquantity']) + Number(element.producedquantity);
                    result[index]['allocationQuantity'] = Number(result[index]['allocationQuantity']) + Number(element.allocationQuantity);

                } else {
                    let object = {
                        id: element.id,
                        year: element.year,
                        season: element.season,
                        crop: element.crop,
                        indentquantity: element.qty,
                        producedquantity: element.producedquantity,
                        allocationQuantity: element.allocationQuantity
                    }

                    result.push(object)
                }
            });



            const temp = { rows: result, count: result.count };


            return response(res, status.DATA_AVAILABLE, 200, temp, allocationToSPA);
            // const allocationToSPAProd = await Promise.all(allocationToSPA.rows.map(async (el) => {
            //     const productionCenters = await allocationToSPAProductionCenterSeed.findAll({
            //         where: {
            //             allocation_to_spa_for_lifting_seed_id: el.id,
            //         },
            //         raw: true
            //     });

            //     const data = []
            //     allocationToIndentor.rows.forEach(element => {
            //         const index = data.findIndex(x => x.id == element.id)

            //         if (index > -1) {
            //             data[index]['allocationData'].push(element['allocation_to_indentor_for_lifting_seed_production_cnters'])

            //         } else {
            //             let arr = [];
            //             arr.push(element.allocation_to_indentor_for_lifting_seed_production_cnters)
            //             let object = {
            //                 id: element.id,
            //                 year: element.year,
            //                 season: element.season,
            //                 crop: element.m_crop,
            //                 variety: element.m_crop_variety,
            //                 indentquantity: element.indentquantity,
            //                 producedquantity: element.producedquantity,
            //                 allocationQuantity: 0,
            //                 allocationData: arr
            //             }
            //             data.push(object)
            //         }

            //     });

            //     const result = []
            //     data.forEach(element => {
            //         // console.log(element)
            //         element.allocationData.forEach(data => {
            //             element.allocationQuantity += data.qty
            //         });

            //         const index = result.findIndex(x => {
            //             if (x.year == element.year && x.season == element.season && x.crop.crop_code == element.crop.crop_code) {
            //                 return x
            //             }
            //         })

            //         console.log(index)

            //         if (index > -1) {
            //             result[index]['indentquantity'] = Number(result[index]['indentquantity']) + Number(element.indentquantity);
            //             result[index]['producedquantity'] = Number(result[index]['producedquantity']) + Number(element.producedquantity);
            //             result[index]['allocationQuantity'] = Number(result[index]['allocationQuantity']) + Number(element.allocationQuantity);

            //         } else {
            //             let object = {
            //                 id: element.id,
            //                 year: element.year,
            //                 season: element.season,
            //                 crop: element.crop,
            //                 indentquantity: element.indentquantity,
            //                 producedquantity: element.producedquantity,
            //                 allocationQuantity: element.allocationQuantity
            //             }

            //             result.push(object)
            //         }
            //     });


            //     const temp = { rows: result, count: result.count };

            //     return response(res, status.DATA_AVAILABLE, 200, temp);

            //     // console.log('productionCenters', productionCenters);
            //     // const sum = productionCenters.reduce((prev, curr) => {
            //     //     return prev + Number(curr.qty, 10);
            //     // }, 0);
            //     // console.log('sum', sum);
            //     // el.quantity = sum;
            //     // return el;
            // }));
            // console.log('allocationToSPAProd', allocationToSPAProd);
            // const data = { rows: allocationToSPAProd, count: allocationToSPA.count };

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getByID = async (req, res) => {
        try {
            const { id = "" } = req.params;
            console.log('id', id);
            const allocationToSPA = await allocationToSPASeed.findOne({
                include: [
                    {
                        attributes: ['id', 'crop_name', 'crop_code'],
                        model: cropModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'variety_name', 'variety_code'],
                        model: varietyModel,
                        left: true,
                    }
                ],
                where: {
                    id,
                },
                raw: true,
                nest: true
            });
            console.log('allocationToSPA', allocationToSPA);
            const productionCenters = await allocationToSPAProductionCenterSeed.findAll({
                include: [
                    {
                        attributes: ['id', 'name'],
                        model: userModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'user_id', 'indent_quantity', 'unit', 'spa_code'],
                        model: indenterSPAModel,
                        left: true,
                        include: {
                            // attributes: ['id', 'name'],
                            // model: userModel,
                            // include: {
                            attributes: ['agency_name'],
                            model: agencyDetailModel,
                            left: true,
                            // },
                            // left: true,
                        },
                        where: {
                            crop_code: allocationToSPA.crop_code,
                            variety_id: allocationToSPA.variety_id,
                            year: allocationToSPA.year
                        }
                    }
                ],
                where: {
                    allocation_to_spa_for_lifting_seed_id: allocationToSPA.id
                },
                raw: true,
                nest: true,
            });
            console.log('productionCenters', JSON.stringify(productionCenters));

            const uniqueDataProduction = Array.from(productionCenters.reduce((map, item) => {
                const key = item.production_center_id + item.user.name;
                if (!map.has(key)) {
                    map.set(key, item);
                }
                return map;
            }, new Map()).values());
            console.log('uniqueDataProduction', uniqueDataProduction);
            let productionCenterAll = [];
            let indentors = [];
            let uniqueIndentors = [];
            const productionCenterData = await Promise.all(productionCenters.map(async (el, index) => {
                console.log('el', el);
                productionCenterAll.push({
                    id: el.id,
                    qty: el.qty,
                    produ: el.production_center_id,
                    user: {
                        name: el.user.name
                    },
                    alloc: el.allocated_quantity,
                    quantityLeft: el.quantity_left_for_allocation
                });
                const indentor = uniqueIndentors.includes(el.spa_code);
                console.log('indentor', indentor);
                const indentorsData = {
                    id: el.id,
                    indentor_id: el.spa_code,
                    indent_quantity: el.indent_of_spas.indent_quantity,
                    user_id: el.indent_of_spas.user_id,
                    unit: el.indent_of_spas.unit,
                    user: {
                        name: el.indent_of_spas.agency_detail.agency_name
                    },
                    allocated_quantity: el.allocated_quantity,
                    quantity_left_for_allocation: el.quantity_left_for_allocation,
                    productions: [
                        {
                            id: el.id,
                            qty: el.qty,
                            productionCenter: {
                                id: el.production_center_id,
                                text: el.user.name
                            }
                        }
                    ]
                };
                console.log('indentorsData', indentorsData);
                if (!indentor) {
                    uniqueIndentors.push(el.spa_code);
                    indentors.push(indentorsData);
                } else {
                    const index = indentors.findIndex((data) => data.indentor_id === el.spa_code);
                    console.log('index', index);
                    if (index !== -1) {
                        indentors[index].productions.push({
                            id: el.id,
                            qty: el.qty,
                            productionCenter: {
                                id: el.production_center_id,
                                text: el.user.name
                            }
                        })
                    }
                }
            }));


            allocationToSPA.indentors = indentors;
            allocationToSPA.productionCenters = productionCenterAll;
            return response(res, status.DATA_AVAILABLE, 200, allocationToSPA);
        }
        catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static create = async (req, res) => {
        try {
            const formData = req.body.formData;
            const user = req.body.loginedUserid;
            let data;
            if (formData && formData[0] && formData[0].indenter && formData[0].indenter[0] && formData[0].indenter[0].spa_code) {
                if (formData && formData[0] && formData[0].variety_line_code) {

                    data = await allocationToSPASeed.findOne({
                        where: {
                            year: formData[0].year,
                            season: formData[0].season,
                            crop_code: formData[0].crop_code,
                            variety_id: formData[0].variety_id,
                            user_id: user.id,
                            variety_line_code: formData[0].variety_line_code,
                        },
                        include: [
                            {
                                model: allocationToSPAProductionCenterSeed,
                                where: {
                                    spa_code: formData[0].indenter[0].spa_code,
                                    state_code: formData[0].indenter[0].state_code,
                                }

                            }
                        ]

                    })
                } else {

                    data = await allocationToSPASeed.findOne({
                        where: {
                            year: formData[0].year,
                            season: formData[0].season,
                            crop_code: formData[0].crop_code,
                            variety_id: formData[0].variety_id,
                            user_id: user.id,
                            // variety_line_code: formData[0].variety_line_code,
                        },
                        include: [
                            {
                                model: allocationToSPAProductionCenterSeed,
                                where: {
                                    spa_code: formData[0].indenter[0].spa_code,
                                    state_code: formData[0].indenter[0].state_code,
                                }

                            }
                        ]

                    })
                }

                if (data) {
                    await allocationToSPAProductionCenterSeed.destroy({
                        where: {
                            allocation_to_spa_for_lifting_seed_id: data.id
                        }
                    })

                    await allocationToSPASeed.destroy({
                        where: {
                            id: data.id
                        }
                    })
                }
            } else {
                if (formData && formData[0] && formData[0].variety_line_code) {
                    data = await allocationToSPASeed.findOne({
                        where: {
                            year: formData[0].year,
                            season: formData[0].season,
                            crop_code: formData[0].crop_code,
                            variety_id: formData[0].variety_id,
                            user_id: user.id,
                            variety_line_code: formData[0].variety_line_code,
                        },
                        // include:[
                        //     {
                        //         model:allocationToSPAProductionCenterSeed,
                        //         where:{
                        //             allocation_to_spa_for_lifting_seed_id:formData[0].indenter[0].allocation_ids
                        //         }

                        //     }
                        // ]

                    })
                }
                else {
                    data = await allocationToSPASeed.findOne({
                        where: {
                            year: formData[0].year,
                            season: formData[0].season,
                            crop_code: formData[0].crop_code,
                            variety_id: formData[0].variety_id,
                            user_id: user.id,
                            // variety_line_code: formData[0].variety_line_code,
                        },
                        // include:[
                        //     {
                        //         model:allocationToSPAProductionCenterSeed,
                        //         where:{
                        //             allocation_to_spa_for_lifting_seed_id:formData[0].indenter[0].allocation_ids
                        //         }

                        //     }
                        // ]

                    })
                }

                // if (data) {
                //     await allocationToSPAProductionCenterSeed.destroy({
                //         where: {
                //             allocation_to_spa_for_lifting_seed_id: data.id
                //         }
                //     })

                //     await allocationToSPASeed.destroy({
                //         where: {
                //             id: data.id
                //         }
                //     })
                // }
            }

            const indentorDatas = await Promise.all(formData.map(async element => {

                const cropGroupCode = await bsp3Helper.getGroupCode(element.crop_code);
                const dataToInsert = {
                    year: element.year,
                    is_active: 0,
                    is_freeze: 0,
                    isdraft: 0,
                    season: element.season,
                    variety_id: element.variety_id,
                    user_id: user.id,
                    crop_code: element.crop_code,
                    crop_group_code: cropGroupCode || "",
                    indentquantity: element.totalIndentQuantity.toString(),
                    producedquantity: element.totalAllocationQuantity.toString(),
                    variety_line_code: element && element.variety_line_code ? element.variety_line_code : null,
                };

                const row = await allocationToSPASeed.create(dataToInsert, {
                    raw: true,
                    nest: true,
                })

                element.indenter.map(async identor => {
                    const productionCenterData = {
                        spa_code: identor.spa_code,
                        state_code: identor.state_code,
                        allocated_quantity: identor.allocated_quantity,
                        indent_qty: identor.indent_quantity,
                        quantity_left_for_allocation: identor.quantity_left_for_allocation < 0 ? 0 : identor.quantity_left_for_allocation,
                    };

                    identor.productions.map(async el => {
                        productionCenterData.qty = el.quantity;
                        productionCenterData.allocation_to_spa_for_lifting_seed_id = row.id;
                        productionCenterData.production_center_id = el.bspc_id,
                            await allocationToSPAProductionCenterSeed.create(productionCenterData, {
                                raw: true,
                                nest: true,
                            })
                    });
                });
                if (!row) {
                    return response(res, status.DATA_NOT_SAVE, 404);
                }
                return response(res, status.DATA_AVAILABLE, 200, row);
                // return row.id;
            }));

        }
        catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static update = async (req, res) => {
        try {
            const formData = req.body;
            console.log('formData', formData);
            console.log(JSON.stringify(formData));
            const dataToUpdate = {
                year: formData.year,
                is_active: formData.is_active,
                is_freeze: formData.is_freeze || 0,
                isdraft: formData.isdraft || 0,
                season: formData.season,
                variety_id: formData.veriety_id,
                user_id: formData.user_id,
                crop_code: formData.crop_code,
                crop_group_code: formData.crop_group_code || "",
            };
            const condition = {
                where: {
                    id: formData.id
                }
            };

            const isExist = await allocationToSPASeed.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            console.log('isExist', isExist);

            const row = await allocationToSPASeed.update(dataToUpdate, condition);

            if (row.length) {
                console.log('row', row);
                const productionCenters = await Promise.all(formData.indentors && formData.indentors.map(async indentor => {
                    let productionCenterData = {
                        spa_code: indentor.indentor_id,
                        allocated_quantity: indentor.allocated_quantity,
                        quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                    };
                    console.log('indentor', indentor);
                    await allocationToSPAProductionCenterSeed.destroy({
                        where: {
                            allocation_to_spa_for_lifting_seed_id: formData.id
                        },
                    });
                    const isUpdate = await Promise.all(indentor.productions && indentor.productions.map(async el => {
                        console.log('el', el);
                        productionCenterData.qty = el.qty;
                        productionCenterData.allocation_to_spa_for_lifting_seed_id = formData.id;
                        productionCenterData.production_center_id = el.productionCenter.id
                        console.log('productionCenterData', productionCenterData);

                        const row = await allocationToSPAProductionCenterSeed.create(productionCenterData);
                        return row.id;

                    }));
                    return isUpdate;
                }));
                console.log('productionCenters', productionCenters);
                return response(res, status.DATA_AVAILABLE, 200, productionCenters);
            }
        }
        catch (error) {
            console.log('error: ' + error);
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
            const isExist = await allocationToSPASeed.count(condition);

            // if data not found
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            //else
            const data = await allocationToSPASeed.destroy(condition);
            const allocationData = await allocationToSPAProductionCenterSeed.destroy({
                where: {
                    allocation_to_spa_for_lifting_seed_id: req.params.id
                }
            });
            console.log('allocationData', allocationData);
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    //API for listing

    static getYearData = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            const data = await allocationToSPASeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_spa_for_lifting_seeds.year')), 'year'],
                ],
                where: {
                    user_id,
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

    static getSeasonData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;
            const data = await allocationToSPASeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_spa_for_lifting_seeds.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },
                where: {
                    year,
                    user_id,
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

    static getCropGroupData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const user_id = req.query.user_id

            const data = await allocationToSPASeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_spa_for_lifting_seeds.crop_group_code')), 'crop_group_code']
                ],

                where: {
                    year,
                    season,
                    user_id
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

    static getCropsData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            // const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await allocationToSPASeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_spa_for_lifting_seeds.crop_code')), 'crop_code'],
                ],
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                    // where: {
                    //     group_code: cropGroup
                    // },
                },
                where: {
                    year: year,
                    season: season,
                    user_id: user_id,
                    // crop_group_code: cropGroup
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

    static getVarietiesData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            // const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await allocationToSPASeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_spa_for_lifting_seeds.variety_id')), 'variety_id'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },
                where: {
                    year: year,
                    season: season,
                    // crop_group_code: cropGroup,
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

    static getReportLifting = async (req, res) => {
        try {
            const formData = req.body;
            console.log('>>>>', formData);

            const rules = {
                'indent_year': 'required|string',
                'season': 'required|string',
                'crop_type': 'required|string',
                'crop_code': 'array',
                'variety_id': 'array',
                'state_code': 'integer',
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
                console.log('isValidData', isValidData);
                console.log('errorResponse', errorResponse);
                return response(res, status.BAD_REQUEST, 400, ((errorResponse && errorResponse.length) || isValidData));
            }

            formData.indent_year = formData.indent_year && formData.indent_year.split("-")[0].toString();
            formData.season = formData.season && formData.season.slice(0, 1).toUpperCase();
            formData.crop_type = formData.crop_type && formData.crop_type.toLowerCase();
            console.log('formData', formData);
            const { indent_year: year, season, crop_type, crop_code = [], variety_id = [], loginedUserid } = formData;
            const state_code = loginedUserid.state_id;
            let condition = {
                attributes: ['id', 'user_id', 'indent_quantity', 'crop_type', 'crop_code', 'variety_id', 'spa_code', 'state_code'],
                include: [
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['id', 'crop_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    {
                        model: userModel,
                        left: true,
                        attributes: ['id', 'name'],
                    }
                ],
                raw: true,
                nest: true,
            };
            condition.where = {
                year,
                season: season,
                crop_type,
                state_code
            };

            if (crop_code.length) {
                condition.where = {
                    year,
                    season: season,
                    crop_type,
                    crop_code,
                    state_code
                };
            }

            if (variety_id.length) {
                condition.where = {
                    year,
                    season: season,
                    crop_type,
                    variety_id,
                    state_code
                };
            }

            if (variety_id.length && crop_code.length) {
                condition.where = {
                    year,
                    season: season,
                    crop_type,
                    variety_id,
                    crop_code,
                    state_code
                };
            }

            console.log('condition', condition);

            const data = await indenterSPAModel.findAll(condition);
            console.log('data', data);
            const uniqueCrop = [];
            const uniqueVariety = [];
            const uniqueSPA = [];
            const filteredData = [];

            data.forEach(el => {
                const isCrop = uniqueCrop.push(el.crop_code);
                // const isSPA = uniqueSPA.push({ state_code: el.state_code, spa_code: el.spa_code });
                const cropIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
                console.log('cropIndex', cropIndex);
                // const isVariety = uniqueVariety.includes(el.variety_id);
                // console.log('isVariety', isVariety);
                if (cropIndex === -1) {
                    console.log('>>>1058');
                    uniqueCrop.push(el.crop_code);
                    // uniqueVariety.push(el.variety_id);
                    filteredData.push({
                        "crop_name": el.m_crop.crop_name,
                        "crop_code": el.crop_code,
                        "total_indent": 0,
                        "total_allocate_quantity": 0,
                        "total_lifted_quantity": 0,
                        "total_bspc": 0,
                        "total_variety": 0,
                        "total_crop": 0,
                        "total_spa": 0,
                        "variety": [
                            {
                                "name": el.m_crop_variety.variety_name,
                                "variety_id": el.variety_id,
                                "variety_code": el.m_crop_variety.variety_code,
                                "total_indent": 0,
                                "total_allocate_quantity": 0,
                                "total_lifted_quantity": 0,
                                "total_spa": 0,
                                "total_bspc": 0,
                                "spa": [
                                    {
                                        "name": el.user.name,
                                        "SPA_code": el.spa_code,
                                        "state_code": el.state_code,
                                        "indent_quantity": 0,
                                        "allocate_quantity": 0,
                                        "lifted_quantity": 0,
                                        "total_bspc": 0,
                                        "bspcs": []
                                    },
                                ]
                            }
                        ]
                    });
                } else {
                    console.log('filteredData', filteredData[cropIndex]);
                    const varietyIndex = filteredData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
                    console.log('varietyIndex', varietyIndex);
                    if (varietyIndex !== -1) {
                        console.log('>>>>', varietyIndex);
                        filteredData[cropIndex].variety[varietyIndex].spa.push(
                            {
                                "name": el.user.name,
                                "SPA_code": el.spa_code,
                                "state_code": el.state_code,
                                "indent_quantity": 0,
                                "allocate_quantity": 0,
                                "lifted_quantity": 0,
                                "total_bspc": 0,
                                "bspcs": []
                            },
                        );
                    } else {
                        filteredData[cropIndex].variety.push({
                            "name": el.m_crop_variety.variety_name,
                            "variety_id": el.variety_id,
                            "variety_code": el.m_crop_variety.variety_code,
                            "total_indent": 0,
                            "total_allocate_quantity": 0,
                            "total_lifted_quantity": 0,
                            "total_spa": 0,
                            "total_bspc": 0,
                            "spa": [
                                {
                                    "name": el.user.name,
                                    "SPA_code": el.spa_code,
                                    "state_code": el.state_code,
                                    "indent_quantity": 0,
                                    "allocate_quantity": 0,
                                    "lifted_quantity": 0,
                                    "total_bspc": 0,
                                    "bspcs": []
                                },
                            ]
                        });
                    }
                }
            });

            console.log('filteredData', JSON.stringify(filteredData));

            const updatedData = await Promise.all(filteredData.map(async el => {
                const indentCondition = { ...condition.where };

                const liftedCondition = { ...condition.where };
                delete liftedCondition.crop_type;
                delete liftedCondition.state_code;

                console.log('lifted condition', liftedCondition);

                const totalIndent = await indenterSPAModel.findAll({
                    attributes: ['indent_quantity', 'crop_code', 'id', 'spa_code'],
                    where: { ...indentCondition },
                    raw: true
                });
                const totalLiftedQuantity = await generateBills.findAll({
                    attributes: ['total_quantity'],
                    where: { ...liftedCondition, state_code },
                    raw: true
                });

                const totalAllocateQuantity = await allocationToSPASeed.findAll({
                    attributes: ['id', 'year', 'season', 'crop_code',],
                    include: {
                        attributes: ['id', 'allocation_to_spa_for_lifting_seed_id', 'qty'],
                        model: allocationToSPAProductionCenterSeed,
                        left: true,
                        where: {
                            state_code
                        }
                    },
                    where: { ...liftedCondition },
                    raw: true,
                    nest: true,
                });
                console.log('totalIndent', totalIndent);
                console.log('totalAllocateQuantity', totalAllocateQuantity);
                const total = totalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                const totalLifted = totalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                const totalAllocation = totalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                const variety = await Promise.all(el.variety.map(async item => {

                    const varietyTotalIndent = await indenterSPAModel.findAll({
                        attributes: ['indent_quantity'],
                        where: {
                            ...indentCondition,
                            variety_id: item.variety_id
                        },
                        raw: true
                    });

                    const varietyTotalLiftedQuantity = await generateBills.findAll({
                        attributes: ['total_quantity'],
                        where: {
                            ...liftedCondition,
                            variety_id: item.variety_id
                        },
                        raw: true
                    });

                    const varietyTotalAllocateQuantity = await allocationToSPASeed.findAll({
                        attributes: ['id', 'year', 'season', 'crop_code'],
                        include: {
                            attributes: ['id', 'qty', 'allocated_quantity'],
                            model: allocationToSPAProductionCenterSeed,
                            left: true,
                            where: {
                                state_code
                            }
                        },
                        where: {
                            ...liftedCondition,
                            variety_id: item.variety_id
                        },
                        raw: true,
                        nest: true,
                    });
                    console.log('varietyTotalIndent', varietyTotalIndent);
                    console.log('varietyTotalLiftedQuantity', varietyTotalLiftedQuantity);
                    console.log('varietyTotalAllocateQuantity', varietyTotalAllocateQuantity);

                    const varietyTotal = varietyTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                    const varietyTotalLifted = varietyTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                    const varietyTotalAllocation = varietyTotalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                    console.log('varietyTotalLifted', varietyTotalLifted);
                    console.log('varietyTotalAllocation', varietyTotalAllocation);

                    const spa = await Promise.all(item.spa.map(async spa => {
                        const spaTotalIndent = await indenterSPAModel.findAll({
                            attributes: ['indent_quantity'],
                            where: {
                                spa_code: spa.SPA_code,
                                state_code: spa.state_code.toString(),
                                ...indentCondition,
                                crop_code: el.crop_code,
                                variety_id: item.variety_id
                            },
                            raw: true
                        });

                        const spaTotalLiftedQuantity = await generateBills.findAll({
                            attributes: ['total_quantity'],
                            where: {
                                spa_code: spa.SPA_code,
                                state_code: spa.state_code.toString(),
                                ...liftedCondition,
                                crop_code: el.crop_code,
                                variety_id: item.variety_id
                            },
                            raw: true
                        });

                        const spaTotalAllocateQuantity = await allocationToSPASeed.findAll({
                            attributes: ['id', 'crop_code'],
                            where: {
                                crop_code: el.crop_code,
                                ...liftedCondition,
                                variety_id: item.variety_id
                            },
                            raw: true,
                            nest: true,
                        });
                        let spaProductionCenters = [];
                        console.log('spaTotalAllocateQuantity', spaTotalAllocateQuantity);
                        const alloc = await Promise.all(spaTotalAllocateQuantity.map(async (__item) => {
                            const productionCenter = await allocationToSPAProductionCenterSeed.findAll({
                                attributes: ['id', 'allocation_to_spa_for_lifting_seed_id', 'allocated_quantity', 'production_center_id', 'qty'],
                                include: {
                                    model: userModel,
                                    include: {
                                        model: agencyDetailModel,
                                        include: [
                                            {
                                                attributes: ['district_name'],
                                                model: districtModel,
                                                left: true,
                                            },
                                            {
                                                attributes: ['state_short_name', 'state_name'],
                                                model: stateModel,
                                                left: true,
                                            }
                                        ],
                                        left: true,
                                    },
                                    left: true,
                                },
                                where: {
                                    allocation_to_spa_for_lifting_seed_id: __item.id,
                                    spa_code: spa.SPA_code,
                                    state_code,
                                },
                                raw: true,
                                nest: true,
                            });

                            await Promise.all(productionCenter.map(async element => {
                                const quan = await generateBills.findAll({
                                    attributes: ['region', 'total_quantity'],
                                    where: {
                                        production_center_id: element.production_center_id,
                                        year,
                                        season: season,
                                        crop_code: el.crop_code,
                                        variety_id: item.variety_id,
                                        spa_code: spa.SPA_code,
                                        state_code,
                                    },
                                    raw: true
                                });
                                console.log('quan', quan);
                                const lifting = quan.reduce((arr, curr) => arr + Number(curr.total_quantity, 10), 0);
                                const items = {
                                    "name": element.user.name,
                                    "code": element.user.code,
                                    "state": element.user.agency_detail.m_state.state_name,
                                    "district": element.user.agency_detail.m_district.district_name,
                                    "allocation": element.qty,
                                    "lifting": lifting,
                                    "unlifted": (element.qty - lifting),
                                    "reason_for_short_supply": quan[0]?.region || ""
                                }
                                spaProductionCenters.push(items);
                            }));
                        }));
                        console.log('spaTotalIndent', spaTotalIndent);
                        console.log('spaTotalLiftedQuantity', spaTotalLiftedQuantity);
                        console.log('spaProductionCenters', spaProductionCenters);

                        const spaTotal = spaTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                        const spaTotalLifted = spaTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                        const spaTotalAllocation = spaProductionCenters.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation, 10), 0);

                        console.log('spaTotalAllocation', spaTotalAllocation);
                        console.log('spaTotal', spaTotal);

                        spa.indent_quantity = spaTotal;
                        spa.lifted_quantity = spaTotalLifted;
                        spa.allocate_quantity = spaTotalAllocation;
                        spa.total_bspc = spaProductionCenters.length;
                        spa.bspcs = spaProductionCenters;
                        return spa;
                    }));

                    item.spa = spa;
                    item.total_indent = varietyTotal;
                    item.total_lifted_quantity = varietyTotalLifted;
                    item.total_bspc = varietyTotalAllocateQuantity.length;
                    item.total_spa = spa.length;
                    item.total_allocate_quantity = varietyTotalAllocation;
                    return item;
                }));

                const crops = bsp3Helper.removeDuplicates(totalIndent, 'crop_code');
                // const spas = bsp3Helper.removeDuplicates(totalIndent, 'spa_code');
                el.variety = variety;
                el.total_indent = Number(total.toFixed(2), 10);
                el.total_lifted_quantity = totalLifted;
                el.total_bspc = totalAllocateQuantity.length;
                el.total_variety = variety.length;
                el.total_crop = crops.length;
                el.total_spa = totalIndent.length;
                el.total_allocate_quantity = totalAllocation;
                return el;
            }));

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, updatedData);
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getReportSPA = async (req, res) => {
        try {
            console.log('>>>>');
            const formData = req.body;

            const rules = {
                'indent_year': 'required|string',
                'season': 'required|string',
                'crop_type': 'required|string',
                'spa_code': 'array',
                'state': 'integer',
                'sector': 'string'
            };

            if (formData.spa_code && formData.spa_code.length >= 0) {
                if (!(formData.state || formData.sector)) {
                    return response(res, status.BAD_REQUEST, 400, 'State code or Sector is required');
                }
            }
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

            // if (!formData.state) {
            if (formData.sector) {
                let stateCodeData = bsp3Helper.stateCode(formData.sector);
                formData.state = stateCodeData ? stateCodeData : formData.state
            }
            formData.indent_year = formData.indent_year && formData.indent_year.split("-")[0].toString();
            formData.season = formData.season && formData.season.slice(0, 1).toUpperCase();
            formData.crop_type = formData.crop_type && formData.crop_type.toLowerCase();
            console.log('formData', formData);
            const { indent_year, season, crop_type, spa_code = [], sector = "", state = 0 } = formData;
            let condition = {
                attributes: ['id', 'user_id', 'indent_quantity', 'crop_type', 'crop_code', 'variety_id', 'spa_code', 'state_code'],
                include: [
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['id', 'crop_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    {
                        model: userModel,
                        left: true,
                        attributes: ['id', 'name'],
                    }
                ],
                raw: true,
                nest: true,
            };
            condition.where = {
                year: indent_year,
                season: season,
                crop_type,
            };

            if (spa_code.length && state) {
                condition.where = {
                    year: indent_year,
                    season: season,
                    crop_type,
                    spa_code,
                    state_code: state
                };
            }

            console.log('condition', condition);

            const data = await indenterSPAModel.findAll(condition);

            const uniqueCrop = [];
            const uniqueVariety = [];
            const uniqueSPA = [];
            const filteredData = [];

            data.forEach(el => {
                // const isCrop = uniqueCrop.includes(el.crop_code);
                const isSPA = uniqueSPA.push({ state_code: el.state_code, spa_code: el.spa_code });
                const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code);
                console.log('spaIndex', spaIndex);
                // const isVariety = uniqueVariety.includes(el.variety_id);
                // console.log('isVariety', isVariety);
                if (spaIndex === -1) {
                    console.log('>>>1058');
                    // uniqueCrop.push(el.crop_code);
                    // uniqueVariety.push(el.variety_id);
                    filteredData.push({
                        "spa_name": el.user.name,
                        "spa_code": el.spa_code,
                        "state_code": el.state_code,
                        "total_indent": el.indent_quantity,
                        "total_allocate_quantity": 0,
                        "total_lifted_quantity": 0,
                        "crop": [
                            {
                                "name": el.m_crop.crop_name,
                                "crop_code": el.crop_code,
                                "total_indent": el.indent_quantity,
                                "total_allocate_quantity": 0,
                                "total_lifted_quantity": 0,
                                "variety": [
                                    {
                                        "name": el.m_crop_variety.variety_name,
                                        "variety_id": el.variety_id,
                                        "variety_code": el.m_crop_variety.variety_code,
                                        "indent_quantity": el.indent_quantity,
                                        "allocate_quantity": 0,
                                        "lifted_quantity": 0,
                                    }
                                ]
                            }
                        ]
                    });
                } else {
                    console.log('filteredData', filteredData[spaIndex]);
                    const cropIndex = filteredData[spaIndex].crop.findIndex(item => item.crop_code === el.crop_code);
                    console.log('cropIndex', cropIndex);
                    if (cropIndex !== -1) {
                        console.log('>>>>', cropIndex);
                        filteredData[spaIndex].crop[cropIndex].variety.push(
                            {
                                "name": el.m_crop_variety.variety_name,
                                "variety_id": el.variety_id,
                                "variety_code": el.m_crop_variety.variety_code,
                                "indent_quantity": el.indent_quantity,
                                "allocate_quantity": 0,
                                "lifted_quantity": 0,
                            }
                        );
                    } else {
                        filteredData[spaIndex].crop.push({
                            "name": el.m_crop.crop_name,
                            "crop_code": el.crop_code,
                            "total_indent": 0,
                            "total_allocate_quantity": 0,
                            "total_lifted_quantity": 0,
                            "variety": [
                                {
                                    "name": el.m_crop_variety.variety_name,
                                    "variety_id": el.variety_id,
                                    "variety_code": el.m_crop_variety.variety_code,
                                    "indent_quantity": el.indent_quantity,
                                    "allocate_quantity": 0,
                                    "lifted_quantity": 0,
                                }
                            ]
                        });
                    }
                }
            });
            console.log('filteredData', JSON.stringify(filteredData));

            const updatedData = await Promise.all(filteredData.map(async el => {

                const indentCondition = {
                    year: indent_year,
                    season: season,
                    crop_type
                };

                const liftedCondition = {
                    year: indent_year,
                    season: season,
                };

                const totalIndent = await indenterSPAModel.findAll({
                    attributes: ['indent_quantity'],
                    where: {
                        ...indentCondition,
                        spa_code: el.spa_code,
                        state_code: el.state_code,
                    },
                    raw: true
                });

                const totalLiftedQuantity = await generateBills.findAll({
                    attributes: ['total_quantity'],
                    where: {
                        ...liftedCondition,
                        spa_code: el.spa_code,
                        state_code: el.state_code.toString(),
                    },
                    raw: true
                });

                const totalAllocateQuantity = await allocationToSPASeed.findAll({
                    attributes: ['id', 'year', 'season', 'crop_code'],
                    include: {
                        attributes: ['id', 'qty', 'allocated_quantity'],
                        model: allocationToSPAProductionCenterSeed,
                        left: true,
                        where: {
                            spa_code: el.spa_code,
                            state_code: el.state_code,
                        },
                    },
                    where: {
                        ...liftedCondition,
                    },
                    raw: true,
                    nest: true,
                });
                const total = totalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                const totalLifted = totalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                const totalAllocation = totalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                const crop = await Promise.all(el.crop.map(async item => {

                    const cropTotalIndent = await indenterSPAModel.findAll({
                        attributes: ['indent_quantity'],
                        where: {
                            spa_code: el.spa_code,
                            state_code: el.state_code,
                            ...indentCondition,
                            crop_code: item.crop_code,
                        },
                        raw: true
                    });

                    const cropTotalLiftedQuantity = await generateBills.findAll({
                        attributes: ['total_quantity'],
                        where: {
                            ...liftedCondition,
                            spa_code: el.spa_code,
                            state_code: el.state_code.toString(),
                            crop_code: item.crop_code,
                        },
                        raw: true
                    });

                    const cropTotalAllocateQuantity = await allocationToSPASeed.findAll({
                        attributes: ['id', 'year', 'season', 'crop_code'],
                        include: {
                            attributes: ['id', 'qty', 'allocated_quantity'],
                            model: allocationToSPAProductionCenterSeed,
                            left: true,
                            where: {
                                spa_code: el.spa_code,
                                state_code: el.state_code.toString(),
                            },
                        },
                        where: {
                            ...liftedCondition,
                            crop_code: item.crop_code,
                        },
                        raw: true,
                        nest: true,
                    });

                    console.log('cropTotalIndent', cropTotalIndent);
                    console.log('cropTotalLiftedQuantity', cropTotalLiftedQuantity);
                    console.log('cropTotalAllocateQuantity', cropTotalAllocateQuantity);

                    const cropTotal = cropTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                    const cropTotalLifted = cropTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                    const cropTotalAllocation = cropTotalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                    console.log('cropTotalLifted', cropTotalLifted);

                    const variety = await Promise.all(item.variety.map(async varities => {

                        const varietyTotalIndent = await indenterSPAModel.findAll({
                            attributes: ['indent_quantity'],
                            where: {
                                spa_code: el.spa_code,
                                state_code: el.state_code,
                                crop_code: item.crop_code,
                                ...indentCondition,
                                variety_id: varities.variety_id
                            },
                            raw: true
                        });

                        const varietyTotalLiftedQuantity = await generateBills.findAll({
                            attributes: ['total_quantity'],
                            where: {
                                spa_code: el.spa_code,
                                state_code: el.state_code.toString(),
                                crop_code: item.crop_code,
                                ...liftedCondition,
                                variety_id: varities.variety_id
                            },
                            raw: true
                        });

                        const varietyTotalAllocateQuantity = await allocationToSPASeed.findAll({
                            attributes: ['id', 'year', 'season', 'crop_code'],
                            include: {
                                attributes: ['id', 'qty', 'allocated_quantity'],
                                model: allocationToSPAProductionCenterSeed,
                                left: true,
                                where: {
                                    spa_code: el.spa_code,
                                    state_code: el.state_code.toString(),
                                },
                            },
                            where: {
                                ...liftedCondition,
                                crop_code: item.crop_code,
                                variety_id: varities.variety_id
                            },
                            raw: true,
                            nest: true,
                        });

                        console.log('varietyTotalIndent', varietyTotalIndent);
                        console.log('varietyTotalLiftedQuantity', varietyTotalLiftedQuantity);
                        console.log('varietyTotalAllocateQuantity', varietyTotalAllocateQuantity);

                        const varietyTotal = varietyTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                        const varietyTotalLifted = varietyTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                        const varietyTotalAllocation = varietyTotalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                        console.log('varietyTotalAllocation', varietyTotalAllocation);

                        varities.indent_quantity = varietyTotal.toFixed(2);
                        varities.lifted_quantity = varietyTotalLifted.toFixed(2);
                        varities.allocate_quantity = varietyTotalAllocation.toFixed(2);
                        return varities;
                    }));
                    item.variety = variety;
                    item.total_indent = cropTotal.toFixed(2);
                    item.total_lifted_quantity = cropTotalLifted.toFixed(2);
                    item.total_allocate_quantity = cropTotalAllocation.toFixed(2);
                    return item;
                }));

                el.crop = crop;
                el.total_indent = total.toFixed(2);
                el.total_lifted_quantity = totalLifted.toFixed(2);
                el.total_allocate_quantity = totalAllocation.toFixed(2);
                return el;
            }));

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, updatedData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static liftingNonLifitngReportSPA = async (req, res) => {
        try {
            console.log('>>>>');
            const formData = req.body;

            const rules = {
                'indent_year': 'required|string',
                'season': 'required|string',
                'crop_type': 'required|string',
                'spa_code': 'array'
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

            formData.indent_year = formData.indent_year && formData.indent_year.split("-")[0].toString();
            formData.season = formData.season && formData.season.slice(0, 1).toUpperCase();
            formData.crop_type = formData.crop_type && formData.crop_type.toLowerCase();
            console.log('formData', formData);

            const { indent_year, season, crop_type, spa_code = [], crop_code = [], loginedUserid = {} } = formData;
            const state_code = loginedUserid.state_id;

            let condition = {
                attributes: ['id', 'season', 'user_id', 'indent_quantity', 'crop_type', 'crop_code', 'variety_id', 'spa_code', 'state_code'],
                include: [
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['id', 'crop_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    {
                        model: userModel,
                        left: true,
                        attributes: ['id', 'name'],
                    }
                ],
                where: {
                    year: indent_year,
                    season: season,
                    crop_type,
                    state_code
                },
                raw: true,
                nest: true,
            };


            if (spa_code.length && crop_code.length) {
                condition.where = {
                    year: indent_year,
                    season: season,
                    crop_type,
                    crop_code,
                    spa_code,
                    state_code
                };
            } else if (crop_code.length) {
                condition.where = {
                    year: indent_year,
                    season: season,
                    crop_type,
                    crop_code,
                    state_code
                };
            } else if (spa_code.length) {
                condition.where = {
                    year: indent_year,
                    season: season,
                    crop_type,
                    spa_code,
                    state_code
                };
            } else {
                condition.where = {
                    year: indent_year,
                    season: season,
                    crop_type,
                    state_code
                }
            }

            console.log('condition', condition);

            const data = await indenterSPAModel.findAll(condition);

            const uniqueSPA = [];
            const filteredData = [];
            console.log('data', data);
            data.forEach(el => {
                uniqueSPA.push({ state_code: el.state_code, spa_code: el.spa_code, user_id: el.user.id });
                const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code && item.spa_id === el.user.id);
                console.log('spaIndex', spaIndex);
                if (spaIndex === -1) {
                    console.log('>>>1058');
                    filteredData.push({
                        "spa_name": el?.user?.name || "",
                        "spa_id": el?.user?.id || "",
                        "spa_code": el.spa_code,
                        "state_code": el.state_code,
                        "total_indent": el.indent_quantity,
                        "total_allocate_quantity": 0,
                        "total_lifted_quantity": 0,
                        "total_bspc": 0,
                        "total_variety": 0,
                        "total_crop": 0,
                        "crop": [
                            {
                                "name": el.m_crop.crop_name,
                                "crop_code": el.crop_code,
                                "total_indent": el.indent_quantity,
                                "total_allocate_quantity": 0,
                                "total_lifted_quantity": 0,
                                "total_bspc": 0,
                                "total_variety": 0,
                                "variety": [
                                    {
                                        "name": el.m_crop_variety.variety_name,
                                        "variety_id": el.variety_id,
                                        "variety_code": el.m_crop_variety.variety_code,
                                        "indent_quantity": el.indent_quantity,
                                        "allocate_quantity": 0,
                                        "lifted_quantity": 0,
                                        "total_bspc": 0,
                                        "bspcs": [],
                                    }
                                ]
                            }
                        ]
                    });
                } else {
                    console.log('filteredData', filteredData[spaIndex]);
                    const cropIndex = filteredData[spaIndex].crop.findIndex(item => item.crop_code === el.crop_code);
                    console.log('cropIndex', cropIndex);
                    if (cropIndex !== -1) {
                        console.log('>>>>', cropIndex);
                        filteredData[spaIndex].crop[cropIndex].variety.push(
                            {
                                "name": el.m_crop_variety.variety_name,
                                "variety_id": el.variety_id,
                                "variety_code": el.m_crop_variety.variety_code,
                                "indent_quantity": el.indent_quantity,
                                "allocate_quantity": 0,
                                "lifted_quantity": 0,
                                "total_bspc": 0,
                                "bspcs": [],
                            }
                        );
                    } else {
                        filteredData[spaIndex].crop.push({
                            "name": el.m_crop.crop_name,
                            "crop_code": el.crop_code,
                            "total_indent": 0,
                            "total_allocate_quantity": 0,
                            "total_lifted_quantity": 0,
                            "total_bspc": 0,
                            "total_variety": 0,
                            "variety": [
                                {
                                    "name": el.m_crop_variety.variety_name,
                                    "variety_id": el.variety_id,
                                    "variety_code": el.m_crop_variety.variety_code,
                                    "indent_quantity": el.indent_quantity,
                                    "allocate_quantity": 0,
                                    "lifted_quantity": 0,
                                    "total_bspc": 0,
                                    "bspcs": [],
                                }
                            ]
                        });
                    }
                }
            });
            console.log('filteredData', JSON.stringify(filteredData));

            const updatedData = await Promise.all(filteredData.map(async el => {
                const indentCondition = {
                    year: indent_year,
                    season: season,
                    crop_type
                };

                const liftedCondition = {
                    year: indent_year,
                    season: season,
                };

                const totalIndent = await indenterSPAModel.findAll({
                    attributes: ['indent_quantity', 'crop_code', 'variety_id'],
                    where: {
                        ...indentCondition,
                        spa_code: el.spa_code,
                        state_code,
                    },
                    raw: true
                });
                console.log('totalIndent', totalIndent);

                const totalLiftedQuantity = await generateBills.findAll({
                    attributes: ['total_quantity'],
                    where: {
                        ...liftedCondition,
                        spa_code: el.spa_code,
                        state_code,
                    },
                    raw: true
                });

                const totalAllocateQuantity = await allocationToSPASeed.findAll({
                    attributes: ['id', 'year', 'season', 'crop_code'],
                    include: {
                        attributes: ['id', 'qty', 'allocated_quantity'],
                        model: allocationToSPAProductionCenterSeed,
                        left: true,
                        where: {
                            spa_code: el.spa_code,
                            state_code,
                        },
                    },
                    where: {
                        ...liftedCondition,
                    },
                    raw: true,
                    nest: true,
                });

                console.log('totalAllocateQuantity', totalAllocateQuantity);
                // Usage
                const totalCrop = bsp3Helper.removeDuplicates(totalIndent, 'crop_code');
                console.log(totalCrop);
                const total = totalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                const totalLifted = totalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                const totalAllocation = totalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                const crop = await Promise.all(el.crop.map(async item => {

                    const cropTotalIndent = await indenterSPAModel.findAll({
                        attributes: ['indent_quantity', 'variety_id'],
                        where: {
                            spa_code: el.spa_code,
                            state_code,
                            ...indentCondition,
                            crop_code: item.crop_code,
                        },
                        raw: true
                    });

                    console.log('cropTotalIndent', cropTotalIndent);

                    const cropTotalLiftedQuantity = await generateBills.findAll({
                        attributes: ['total_quantity'],
                        where: {
                            spa_code: el.spa_code,
                            state_code,
                            ...liftedCondition,
                            crop_code: item.crop_code,
                        },
                        raw: true
                    });

                    const cropTotalAllocateQuantity = await allocationToSPASeed.findAll({
                        attributes: ['id', 'year', 'season', 'crop_code'],
                        include: {
                            attributes: ['id', 'qty', 'allocated_quantity'],
                            model: allocationToSPAProductionCenterSeed,
                            left: true,
                            where: {
                                spa_code: el.spa_code,
                                state_code,
                            },
                        },
                        where: {
                            ...liftedCondition,
                            crop_code: item.crop_code,
                        },
                        raw: true,
                        nest: true,
                    });

                    console.log('cropTotalIndent', cropTotalIndent);
                    console.log('cropTotalLiftedQuantity', cropTotalLiftedQuantity);
                    console.log('cropTotalAllocateQuantity', cropTotalAllocateQuantity);

                    const cropTotal = cropTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                    const totalVariety = bsp3Helper.removeDuplicates(cropTotalIndent, 'variety_id');
                    console.log(totalVariety);
                    const cropTotalLifted = cropTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                    const cropTotalAllocation = cropTotalAllocateQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation_to_spa_for_lifting_seed_production_cnters.qty, 10), 0);

                    console.log('cropTotalLifted', cropTotalLifted);

                    const variety = await Promise.all(item.variety.map(async varities => {

                        const varietyTotalIndent = await indenterSPAModel.findAll({
                            attributes: ['indent_quantity'],
                            where: {
                                spa_code: el.spa_code,
                                state_code,
                                crop_code: item.crop_code,
                                ...indentCondition,
                                variety_id: varities.variety_id
                            },
                            raw: true
                        });

                        const varietyTotalLiftedQuantity = await generateBills.findAll({
                            attributes: ['total_quantity'],
                            where: {
                                spa_code: el.spa_code,
                                state_code,
                                crop_code: item.crop_code,
                                ...liftedCondition,
                                variety_id: varities.variety_id
                            },
                            raw: true
                        });

                        const varietyTotalAllocateQuantity = await allocationToSPASeed.findAll({
                            attributes: ['id', 'crop_code'],
                            where: {
                                ...liftedCondition,
                                crop_code: item.crop_code,
                                variety_id: varities.variety_id
                            },
                            raw: true,
                            nest: true,
                        });

                        let spaProductionCenters = [];
                        const alloc = await Promise.all(varietyTotalAllocateQuantity.map(async (__item) => {
                            const productionCenter = await allocationToSPAProductionCenterSeed.findAll({
                                attributes: ['id', 'allocation_to_spa_for_lifting_seed_id', 'allocated_quantity', 'production_center_id', 'qty'],
                                include: {
                                    model: userModel,
                                    include: {
                                        model: agencyDetailModel,
                                        include: [
                                            {
                                                attributes: ['district_name'],
                                                model: districtModel,
                                                left: true,
                                            },
                                            {
                                                attributes: ['state_short_name', 'state_name'],
                                                model: stateModel,
                                                left: true,
                                            }
                                        ],
                                        left: true,
                                    },
                                    left: true,
                                },
                                where: {
                                    allocation_to_spa_for_lifting_seed_id: __item.id,
                                    spa_code: el.spa_code,
                                    state_code,
                                },
                                raw: true,
                                nest: true,
                            });

                            await Promise.all(productionCenter.map(async element => {
                                console.log('elemtn', element);
                                const quan = await generateBills.findAll({
                                    attributes: ['region', 'total_quantity'],
                                    where: {
                                        production_center_id: element.production_center_id,
                                        year: indent_year,
                                        season: season,
                                        crop_code: item.crop_code,
                                        variety_id: varities.variety_id,
                                        spa_code: el.spa_code,
                                        state_code,
                                    },
                                    raw: true
                                });

                                const lifting = quan.reduce((arr, curr) => arr + Number(curr.total_quantity, 10), 0);
                                const items = {
                                    "name": element.user.name,
                                    "code": element.user.code,
                                    "state": element.user.agency_detail.m_state.state_name,
                                    "district": element.user.agency_detail.m_district.district_name,
                                    "allocation": element.qty,
                                    "lifting": lifting,
                                    "unlifted": (element.qty - lifting),
                                    "reason_for_short_supply": quan[0]?.region || ""
                                }
                                spaProductionCenters.push(items);
                            }));
                        }));

                        const varietyTotal = varietyTotalIndent.reduce((acc, curr) => acc + curr.indent_quantity, 0);
                        const varietyTotalLifted = varietyTotalLiftedQuantity.reduce((acc, curr) => Number(acc, 10) + Number(curr.total_quantity, 10), 0);
                        const varietyTotalAllocation = spaProductionCenters.reduce((acc, curr) => Number(acc, 10) + Number(curr.allocation, 10), 0);

                        varities.indent_quantity = varietyTotal;
                        varities.lifted_quantity = varietyTotalLifted;
                        varities.allocate_quantity = varietyTotalAllocation;
                        varities.total_bspc = spaProductionCenters.length || 0;
                        varities.bspcs = spaProductionCenters;
                        return varities;
                    }));

                    item.variety = variety;
                    item.total_indent = Number(cropTotal.toFixed(2), 10);
                    item.total_lifted_quantity = cropTotalLifted;
                    item.total_bspc = cropTotalAllocateQuantity.length || 0;
                    item.total_variety = totalVariety.length;
                    item.total_allocate_quantity = cropTotalAllocation
                    return item;
                }));

                const varieties = bsp3Helper.removeDuplicates(totalIndent, 'variety_id');

                el.crop = crop;
                el.total_indent = Number(total.toFixed(2), 10);
                el.total_lifted_quantity = totalLifted;
                el.total_crop = totalCrop.length;
                el.total_bspc = totalAllocateQuantity.length || 0;
                el.total_variety = varieties.length;
                el.total_allocate_quantity = totalAllocation;
                return el;
            }));

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, filteredData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static cropWiseAllocationSubmission = async (req, res) => {
        try {
            const year = req.query.year;
            const season = req.query.season;
            const crop_code = req.query.cropCode;

            const condition = {
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    is_active: 0
                }
            };

            const data = await allocationToSPASeed.findAll(condition);

            if (data && data.length > 0) {
                const result = await Promise.all(data.map(async element => {
                    const dataToUpdate = {
                        is_active: 1,
                    };

                    const row = await allocationToSPASeed.update(dataToUpdate, {
                        where: {
                            id: element.id
                        }
                    });
                    return row;
                }));

                return response(res, status.DATA_AVAILABLE, 200, result);
            } else if (data && data.length == 0) {
                return response(res, "Already submitted", 201, data);

            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }


        } catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }


    // Have to work for update
    static getVarietyDataForEdit = async (req, res) => {
        try {
            const formData = req.body.formData;

            const agencyDetail = await agencyDetailModel.findOne({
                attributes: ['id', 'state_id'],
                where: {
                    id: req.body.loginedUserid.agency_id
                },
                raw: true,
            });

            const condition = {
                where: {
                    year: formData.year,
                    season: formData.season,
                    crop_code: formData.crop_code,
                    user_id: formData.user_id
                },
                include: {
                    model: allocationToSPAProductionCenterSeed,
                    attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'allocation_to_spa_for_lifting_seed_id', 'spa_code', 'state_code', 'production_center_id'],
                    where: {
                        state_code: agencyDetail.state_id
                    },
                    left: true,
                },

                raw: true,
            };

            const data = await allocationToSPASeed.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const result = []

            data.forEach(element => {
                if (result.length == 0) {
                    let object = {
                        id: element.id,
                        variety_id: element.variety_id,
                        variety_line_code: element.variety_line_code,
                        totalIndentQuantity: element.indentquantity,
                        productionQuantity: element.producedquantity,
                        indentor: [],
                        is_active: element.is_active
                    }

                    let indentor = {
                        spa_code: element['allocation_to_spa_for_lifting_seed_production_cnters.spa_code'],
                        state_code: element['allocation_to_spa_for_lifting_seed_production_cnters.state_code'],
                        production_center_id: element['allocation_to_spa_for_lifting_seed_production_cnters.production'],
                        qty: element['allocation_to_spa_for_lifting_seed_production_cnters.qty'],

                    }

                    object.indentor.push(indentor);
                    result.push(object)
                } else {
                    const index = result.findIndex(x => x.id == element.id);

                    if (index > -1) {
                        let indentor = {
                            spa_code: element['allocation_to_spa_for_lifting_seed_production_cnters.spa_code'],
                            state_code: element['allocation_to_spa_for_lifting_seed_production_cnters.state_code'],
                            production_center_id: element['allocation_to_spa_for_lifting_seed_production_cnters.production'],
                            qty: element['allocation_to_spa_for_lifting_seed_production_cnters.qty'],

                        }
                        result[index].indentor.push(indentor)
                    } else {
                        let object = {
                            id: element.id,
                            variety_id: element.variety_id,
                            totalIndentQuantity: element.indentquantity,
                            productionQuantity: element.producedquantity,
                            indentor: []
                        }

                        let indentor = {
                            spa_code: element['allocation_to_spa_for_lifting_seed_production_cnters.spa_code'],
                            state_code: element['allocation_to_spa_for_lifting_seed_production_cnters.state_code'],
                            production_center_id: element['allocation_to_spa_for_lifting_seed_production_cnters.production'],
                            qty: element['allocation_to_spa_for_lifting_seed_production_cnters.qty'],

                        }

                        object.indentor.push(indentor);
                        result.push(object)
                    }
                }
            });

            result.forEach(element => {
                const tempIndentor = []
                element.indentor.forEach(indentor => {
                    if (tempIndentor.length == 0) {
                        const obj = {
                            spa_code: indentor.spa_code,
                            productions: []
                        }

                        const prod = {
                            production_center_id: indentor.production_center_id,
                            qty: indentor.qty
                        }

                        obj.productions.push(prod)

                        tempIndentor.push(obj)
                    } else {
                        const index = tempIndentor.findIndex(x => x.spa_code == indentor.spa_code)

                        if (index > -1) {
                            const prod = {
                                production_center_id: indentor.production_center_id,
                                qty: indentor.qty
                            }

                            tempIndentor[index].productions.push(prod)
                        } else {
                            const obj = {
                                spa_code: indentor.spa_code,
                                productions: []
                            }

                            const prod = {
                                production_center_id: indentor.production_center_id,
                                qty: indentor.qty
                            }

                            obj.productions.push(prod)

                            tempIndentor.push(obj)
                        }

                    }
                });

                element.indentor = tempIndentor
            });

            return response(res, status.DATA_AVAILABLE, 200, result);


        } catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static indentorReport = async (req, res) => {
        try {
            const formData = req.body;

            const rules = {
                'year': 'required|string',
                'season': 'required|string',
                'crop_code': 'required|string',
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

            const { year, season, crop_code, loginedUserid = {} } = formData;
            const state_code = loginedUserid.state_id;
            console.log('state_code', state_code);
            const isAgricuture = crop_code && crop_code.slice(0, 1).toUpperCase();
            let condition = {
                attributes: ['id', 'user_id', 'indent_quantity', 'variety_id', 'spa_code', 'variety_notification_year'],
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    {
                        model: userModel,
                        left: true,
                        attributes: ['id', 'name'],
                        include: {
                            attributes: ['id', 'agency_name'],
                            model: agencyDetailModel,
                            left: true,
                        }
                    }
                ],
                where: {
                    year,
                    season,
                    crop_code,
                    state_code,

                },
                raw: true,
                nest: true,
            };

            const data = await indenterSPAModel.findAll(condition);
            let getSPA = bsp3Helper.removeDuplicates(data, 'spa_code');
            getSPA = getSPA.map(el => el.spa_code);
            const uniqueVariety = [];
            const filteredData = [];


            const uniqueUsers = {};
            const uniqueUserObjects = [];

            for (const item of data) {
                const userId = item.user_id;
                if (!uniqueUsers[userId]) {
                    uniqueUsers[userId] = item.user;
                    uniqueUserObjects.push(item.user);
                }
            }

            console.log('data', data);
            console.log('getSPA', getSPA);
            console.log('uniqueUserObjects', uniqueUserObjects);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            data.forEach(el => {
                uniqueVariety.push({ variety_code: el.m_crop_variety.variety_code });
                const varietyIndex = filteredData.findIndex(item => item.variety_code === el.m_crop_variety.variety_code);
                // console.log('varietyIndex', varietyIndex);

                if (varietyIndex === -1) {
                    console.log('>>>1058');
                    filteredData.push({
                        "variety_id": el.variety_id,
                        "variety_code": el.m_crop_variety.variety_code,
                        "variety_name": el.m_crop_variety.variety_name,
                        "notification_year": el.variety_notification_year,
                        "surplus_dificit": "-200/+100",
                        "indenter": [
                            {
                                "id": el.user_id,
                                "spa_code": el.spa_code,
                                "name": el.user.name,
                                "full_name": el.user.agency_detail.agency_name
                            }
                        ],
                        "indent_quantity": [
                            {
                                "indent_quantity": el.indent_quantity
                            }
                        ],
                        "allocation": [],
                        "total_allocation": []
                    });
                } else {
                    // console.log('filteredData', filteredData[varietyIndex]);
                    filteredData[varietyIndex].indenter.push({
                        "id": el.user_id,
                        "name": el.user.name,
                        "spa_code": el.spa_code,
                        "full_name": el.user.agency_detail.agency_name
                    });
                    filteredData[varietyIndex].indent_quantity.push({
                        "indent_quantity": el.indent_quantity
                    });
                }
            });

            // console.log('filteredData', JSON.stringify(filteredData));

            console.log('filteredData', JSON.stringify(filteredData));

            const filteredData1 = filteredData.map(el => {
                const { indenter, indent_quantity } = el;
                const missingObjects = uniqueUserObjects.filter(user => !indenter.some(indent => indent.id === user.id)).map(v => {
                    return {
                        id: v.id,
                        name: v.name,
                        full_name: v.agency_detail.agency_name
                    }
                });
                console.log('missingObjects', missingObjects);
                indenter.push(...missingObjects);
                missingObjects.forEach(i => indent_quantity.push({ indent_quantity: 0 }));

                // Sort array1 and array2 using the custom comparison function
                return el;
            });

            const filteredData2 = filteredData1.map(el => {
                const { indenter, indent_quantity } = el;

                // Create a mapping of indenter indices and names
                const nameMap = indenter.map((obj, index) => ({ index, name: obj.name }));

                // Sort the nameMap based on the "name" property
                nameMap.sort((a, b) => a.name.localeCompare(b.name));

                // Reorder indenter and indent_quantity based on the sorted nameMap
                const sortedArray1 = nameMap.map(({ index }) => indenter[index]);
                const sortedArray2 = nameMap.map(({ index }) => indent_quantity[index]);
                el.indenter = sortedArray1;
                el.indent_quantity = sortedArray2;
                return el;
            });

            console.log('filteredData1', JSON.stringify(filteredData1));
            // console.log('filteredData2', JSON.stringify(filteredData2));

            const updatedData = await Promise.all(filteredData2.map(async item => {
                let bspcAllocation = [];
                let totalAllocation = [];
                let totalIndentQuantity = 0;
                item.indent_quantity.forEach(quan => totalIndentQuantity += quan.indent_quantity);
                const productionCenterAll = await allocationToSPASeed.findAll({
                    attributes: ['id', 'year', 'season', 'crop_code', 'variety_id'],
                    include: {
                        attributes: ['id', 'qty', 'production_center_id'],
                        model: allocationToSPAProductionCenterSeed,
                        left: true,
                        where: {
                            spa_code: getSPA,
                            state_code,
                        },
                        include: {
                            attributes: ['id', 'name'],
                            model: userModel,
                            left: true,
                        }
                    },
                    where: {
                        crop_code,
                        "variety_id": item.variety_id,
                        season,
                        year,
                    },
                    raw: true,
                    nest: true,
                });
                console.log('productionCenterAll', productionCenterAll);

                let removeDuplicateProd = bsp3Helper.removeNestedDuplicates(productionCenterAll, 'allocation_to_spa_for_lifting_seed_production_cnters.production');
                // console.log('productionCenterAll', productionCenterAll);
                // removeDuplicateProd = removeDuplicateProd.map(el => el.allocation_to_spa_for_lifting_seed_production_cnters.production);
                // console.log('removeDuplicateProd', removeDuplicateProd);
                const productionCenters = await Promise.all(item.indenter.map(async el => {
                    // console.log('el', el);
                    let productionCenter = await allocationToSPASeed.findAll({
                        attributes: ['id', 'year', 'season', 'crop_code', 'variety_id'],
                        include: {
                            attributes: ['id', 'qty', 'production_center_id'],
                            model: allocationToSPAProductionCenterSeed,
                            left: true,
                            where: {
                                spa_code: el.spa_code || "",
                                state_code,
                            },
                            include: {
                                attributes: ['id', 'name'],
                                model: userModel,
                                left: true,
                            }
                        },
                        where: {
                            crop_code,
                            "variety_id": item.variety_id,
                            season,
                            year,
                        },
                        raw: true,
                        nest: true,
                    });

                    let sumOfQuantity = 0;
                    console.log('productionCenter', productionCenter);
                    if (productionCenter.length !== item.indenter.length) {
                        console.log('productionCenter less', productionCenter);
                        // console.log('SPA less', el.spa_code);
                        // console.log('removeDuplicateProd', removeDuplicateProd);
                        productionCenter = removeDuplicateProd.map(i => {
                            const res = productionCenter.find(el => el.allocation_to_spa_for_lifting_seed_production_cnters.production === i.allocation_to_spa_for_lifting_seed_production_cnters.production);
                            if (res === undefined) {
                                // console.log('i', i);
                                return {
                                    year: i.year,
                                    season: i.season,
                                    crop_code: i.crop_code,
                                    variety_id: i.variety_id,
                                    allocation_to_spa_for_lifting_seed_production_cnters: {
                                        qty: 0,
                                        production: i.allocation_to_spa_for_lifting_seed_production_cnters.production,
                                        user: i.allocation_to_spa_for_lifting_seed_production_cnters.user
                                    }
                                }

                            } else {
                                return res
                            }
                        });
                    }
                    // console.log('productionCenter', productionCenter);
                    for (const center of productionCenter) {
                        const allocation = center.allocation_to_spa_for_lifting_seed_production_cnters;
                        sumOfQuantity += allocation.qty;
                    }
                    totalAllocation.push({ "total_allocation": sumOfQuantity })
                    await productionCenter.forEach(element => {
                        // console.log('element', element);
                        // console.log('item', item);
                        // console.log('bspcAllocation', bspcAllocation);
                        const indentorProductionCentersIndex = bspcAllocation.findIndex(items => items.bspc_id === element.allocation_to_spa_for_lifting_seed_production_cnters.production && items.variety_id === item.variety_id);
                        if (indentorProductionCentersIndex === -1) {
                            console.log('indentorProductionCentersIndex', indentorProductionCentersIndex);
                            // console.log('el', el);
                            bspcAllocation.push({
                                "variety_id": item.variety_id,
                                "bspc_id": element.allocation_to_spa_for_lifting_seed_production_cnters?.production,
                                "quantity": [element.allocation_to_spa_for_lifting_seed_production_cnters?.qty],
                                // "total_quantity": element.allocation_to_spa_for_lifting_seed_production_cnters?.production,
                                "total_quantity": sumOfQuantity ? sumOfQuantity : 0,
                                "bspc_name": element?.allocation_to_spa_for_lifting_seed_production_cnters?.user?.name,
                                "bspc_produced": 0,
                            });
                        } else {
                            console.log('indentorProductionCentersIndex else', indentorProductionCentersIndex);
                            bspcAllocation[indentorProductionCentersIndex].quantity.push(element.allocation_to_spa_for_lifting_seed_production_cnters.qty);
                            bspcAllocation[indentorProductionCentersIndex].total_quantity = bspcAllocation[indentorProductionCentersIndex].quantity.reduce((acc, curr) => acc + curr, 0);
                        }
                    });
                }));
                // console.log('bspcAllocation', bspcAllocation);
                await Promise.all(bspcAllocation.map(async __item => {
                    // console.log('__item', __item);
                    const labels = await generatedLabelNumberModel.findAll({
                        attributes: ['id', 'weight'],
                        include: {
                            attributes: ['id', 'user_id', 'variety_id'],
                            model: labelNumberForBreederseed,
                            left: true,
                            where: {
                                crop_code,
                                year_of_indent: year,
                                season,
                                variety_id: __item.variety_id,
                                user_id: __item.bspc_id || 0,
                            },
                        },
                        where: {
                            user_id: __item.bspc_id || 0,
                        },
                        raw: true,
                        nest: true,
                    });
                    // console.log('labels', labels);
                    let totalLabels = labels.reduce((acc, label) => acc + Number(label.weight, 10), 0)
                    isAgricuture === 'A' ? totalLabels = totalLabels / 100 : totalLabels = totalLabels;

                    __item.bspc_produced = totalLabels;
                }));
                item.indent_quantity.push({
                    "indent_quantity": totalIndentQuantity
                });
                item.allocation = bspcAllocation;
                item.total_allocation = totalAllocation;
                item.total_allocation.push({
                    "total_allocation": item.total_allocation.reduce((acc, curr) => acc + curr.total_allocation, 0)
                });
                bspcAllocation = [];
                return item;
                // console.log('productionCenters', JSON.stringify(productionCenters));
            }));

            updatedData.map(deficit => {
                const totalAllocation = deficit.total_allocation[deficit.total_allocation.length - 1];
                let totalBspcProduced = deficit.allocation.reduce((acc, curr) => acc + curr.bspc_produced, 0);
                // console.log('isAgricuture', isAgricuture === 'A');
                // isAgricuture === 'A' ? totalBspcProduced = totalBspcProduced / 100 : totalBspcProduced = totalBspcProduced;
                // console.log('totalBspcProduced', totalBspcProduced);
                deficit.surplus_dificit = (totalBspcProduced - totalAllocation.total_allocation).toFixed(2);
            });
            const sortedData = bsp3Helper.sortArray(updatedData);
            const modifiedData = {
                grandTotalProduction: 0,
                totalDificit: 0,
                grandAllocation: [],
                grandIndent: [],
                allocations: []
            };

            const reportData = updatedData.map(el => {
                modifiedData.grandTotalProduction += el.allocation.reduce((acc, curr) => acc + curr.bspc_produced, 0);
                modifiedData.totalDificit += Number(el.surplus_dificit, 10);
                modifiedData.allocations.push(el);
            });


            // const reportData = sortedData.map(el => {
            //     let grandAllocationSum = 0;
            //     let grandIndentSum = 0;
            //     let indentQuantity = [...el.indent_quantity];
            //     indentQuantity.pop();
            //     let totalAllocation = [...el.total_allocation];
            //     totalAllocation.pop();
            //     modifiedData.grandTotalProduction += el.allocation.reduce((acc, curr) => acc + curr.bspc_produced, 0);
            //     grandAllocationSum += totalAllocation.reduce((acc, curr) => acc + curr.total_allocation, 0);
            //     grandIndentSum += indentQuantity.reduce((acc, curr) => acc + curr.indent_quantity, 0);
            //     modifiedData.totalDificit += Number(el.surplus_dificit, 10);
            //     modifiedData.grandAllocation.push({ total_allocation: grandAllocationSum });
            //     modifiedData.grandIndent.push({ indent_quantity: grandIndentSum });
            //     modifiedData.allocations.push(el);
            // })

            // modifiedData.grandAllocation.push({
            //     total_allocation: modifiedData.grandAllocation.reduce((acc, curr) => acc + Number(curr.total_allocation, 10), 0).toFixed(2),
            // });

            // modifiedData.grandIndent.push({
            //     indent_quantity: modifiedData.grandIndent.reduce((acc, curr) => acc + Number(curr.indent_quantity, 10), 0).toFixed(2),
            // });

            modifiedData.allocations.forEach((allocation) => {
                allocation.indent_quantity.forEach((quantityObj, index) => {
                    const sum = modifiedData.grandIndent[index]?.indent_quantity || 0;
                    modifiedData.grandIndent[index] = { indent_quantity: sum + quantityObj.indent_quantity };
                });
            });

            modifiedData.allocations.forEach((allocation) => {
                allocation.total_allocation.forEach((quantityObj, index) => {
                    const sum = modifiedData.grandAllocation[index]?.total_allocation || 0;
                    modifiedData.grandAllocation[index] = { total_allocation: sum + quantityObj.total_allocation };
                });
            });

            return response(res, status.DATA_AVAILABLE, 200, [modifiedData]);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static varietyWiseSubmissionIndentor = async (req, res) => {
        try {
            const formData = req.body['formData'];

            if (!formData) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const condition = {
                where: {
                    year: formData.year,
                    season: formData.season,
                    crop_code: formData.crop_code,
                    variety_id: formData.selectedVariety
                },

                raw: true,
            };

            const data = await allocationToSPASeed.findOne(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                is_variety_submitted: 1,
            };

            const row = await allocationToSPASeed.update(dataToUpdate, condition);

            if (!row) {
                return response(res, status.DATA_NOT_SAVE, 404);
            }

            return response(res, status.DATA_UPDATED, 200);

        } catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static cropWiseSubmissionIndentor = async (req, res) => {
        try {
            const year = req.query.year;
            const season = req.query.season;
            const crop_code = req.query.cropCode;

            const condition = {
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    is_active: 0
                }
            };

            const data = await allocationToSPASeed.findAll(condition);

            if (data && data.length > 0) {
                const result = await Promise.all(data.map(async element => {
                    const dataToUpdate = {
                        is_active: 1,
                    };

                    const row = await allocationToSPASeed.update(dataToUpdate, {
                        where: {
                            id: element.id
                        }
                    });
                    return row;
                }));

                return response(res, status.DATA_AVAILABLE, 200, result);
            } else if (data && data.length == 0) {
                return response(res, "Already submitted", 201, data);

            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }


        } catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static allocationToSpaLineData = async (req, res) => {
        try {
            const { year, season, crop_code, variety } = req.body.search;
            const dataspa = await allocationToSPASeed.findAll({
                where: {
                    year,
                    season,
                    crop_code,
                    user_id: req.body.loginedUserid.id,
                    variety_id: {
                        [Op.in]: variety
                    },
                },
                attributes: ['variety_line_code'],
                raw: true
            })
            let dataline = [];
            if (dataspa && dataspa.length > 0) {
                dataspa.forEach((el) => {
                    dataline.push(el && el.variety_line_code ? el.variety_line_code : '')
                })
            }
            console.log(dataline, 'dataline')
            const data = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: db.lineVariety,
                        attributes: []
                    },
                    {
                        model: db.allocationToIndentorProductionCenterSeed,
                        where: {
                            indent_of_breeder_id: req.body.loginedUserid.id
                        },
                        attributes: []
                    }
                ],

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_line_code')), 'variety_line_code'],
                    [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
                ],
                // include: {
                //     attributes: ['season'],
                //     model: seasonModel,
                //     left: true,
                // },

                where: {
                    [Op.and]: [
                        {
                            variety_line_code: {
                                [Op.ne]: ''
                            }

                        },
                        {
                            variety_line_code: {
                                [Op.ne]: null
                            }

                        },
                        {
                            variety_line_code: {
                                [Op.ne]: 'NA'
                            }

                        },
                        {
                            variety_line_code: {
                                [Op.notIn]: dataline
                            },

                        }

                    ],

                    year: year,
                    season,
                    crop_code,
                    // user_id:req.body.loginedUserid.id,
                    variety_id: {
                        [Op.in]: variety
                    },
                    // variety_line_code: {
                    //     [Op.notIn]: dataline
                    // },

                    is_active: 1
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

    static varietyData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const { season, cropCode, cropVariety, user_id: userId, line_code } = req.query;

            const agencyDetail = await agencyDetailModel.findOne({
                attributes: ['id', 'state_id'],
                where: {
                    id: req.body.loginedUserid.agency_id
                },
                raw: true,
            });
            // console.log('agency_detail', agencyDetail);

            const varietyCode = await varietyModel.findOne({
                where: {
                    id: cropVariety
                },
                raw: true,
            });
            let SPA;
            if (line_code) {

                SPA = await indenterSPAModel.findAll({
                    // attributes:[],
                    attributes: ['id', 'indent_quantity', 'user_id', 'unit', 'spa_code', 'state_code'],
                    include: [{
                        //    attributes: ['name','id'],
                        attributes: [],
                        model: userModel,
                        left: true,
                        include: [{
                            model: agencyDetailModel,
                            //    attributes:[],
                            left: true
                        },
                        ],
                        where: {
                            id: {
                                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agencyDetail.state_id} AND user_type = 'SPA')`)
                            }
                        },
                    },
                    {
                        model: db.indentOfSpaLinesModel,
                        where: {
                            variety_code_line: line_code,
                            quantity: {
                                [Op.gt]: 0
                            }
                        },
                        // attributes:[]
                    }
                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_code: varietyCode.variety_code,
                        state_code: agencyDetail.state_id,

                        // variety_line_code:line_code
                    },
                    raw: true,
                    nest: true,
                    //    attributes:[
                    //     [sequelize.col('indent_of_spa_line.quantity'),'indent_quantity']
                    //    ]
                });
            } else {

                SPA = await indenterSPAModel.findAll({
                    attributes: ['id', 'indent_quantity', 'user_id', 'unit', 'spa_code', 'state_code'],
                    include: {
                        attributes: ['name', 'id'],
                        model: userModel,
                        left: true,
                        include: [{
                            model: agencyDetailModel,
                            left: true
                        },
                            // {
                            //     model:db.indentOfSpaLinesModel,
                            //     attributes:[]
                            // }

                        ],
                        where: {
                            id: {
                                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agencyDetail.state_id} AND user_type = 'SPA')`)
                            }
                        },
                    },
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_code: varietyCode.variety_code,
                        state_code: agencyDetail.state_id,
                        indent_quantity: {
                            [Op.gt]: 0
                        }
                        // variety_line_code:line_code
                    },
                    raw: true,
                    nest: true,
                });
            }
            if (line_code) {
                if (SPA && SPA.length > 0) {
                    SPA.forEach(el => {
                        el['indent_quantity'] = el && el['indent_of_spa_line'] && el['indent_of_spa_line']['quantity'] ? el['indent_of_spa_line']['quantity'] : 0
                    })
                }

            }

            console.log('SPA', SPA);
            if (!SPA) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            SPA.map(el => {
                el.user.name = el.user.agency_detail.agency_name;
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            const varietyData = await varietyModel.findAll({
                where: {
                    id: cropVariety
                },
                raw: true,
                attributes: ['variety_code']
            })
            let allocationToIndentor2;
            if (line_code) {
                allocationToIndentor2 = await db.allocationToIndentorSeed.findAll({
                    include: {
                        // attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                        model: allocationToIndentorProductionCenterSeed,
                        left: true,
                        where: {
                            indent_of_breeder_id: userId,
                        }
                    },

                    attributes: [
                        [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'allocated_quantity']
                        // [sequelize.literal("Sum(availability_of_breeder_seed.allocate_qty)"), "allocate_qty"],
                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety,
                        variety_line_code: line_code
                    },
                    raw: true,
                    nest: true,
                });
            } else {
                allocationToIndentor2 = await db.allocationToIndentorSeed.findAll({
                    include: {
                        // attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                        model: allocationToIndentorProductionCenterSeed,
                        left: true,
                        where: {
                            indent_of_breeder_id: userId,
                        }
                    },
                    attributes: [
                        [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'allocated_quantity']
                        //     [sequelize.literal("Sum(availability_of_breeder_seed.allocate_qty)"), "allocate_qty"],
                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety
                        // variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                    },
                    raw: true,
                    nest: true,
                });
            }

            // let totalAllocationQuantity = 0;
            const totalAllocationQuantity = allocationToIndentor2.reduce((acc, current) => acc + current.allocated_quantity, 0);

            console.log(allocationToIndentor2, 'totalAllocationQuantity'); // Output: 535.34
            // allocationToIndentor2.forEach(el => {
            //     totalAllocationQuantity += Number(el.allocate_qty, 10);
            //     // sum2 += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
            //     return totalAllocationQuantity;
            // });

            let productioncentersecond2;
            if (line_code) {
                productioncentersecond2 = await allocationToSPASeed.findAll({
                    where: {
                        season: season,
                        year: year,
                        user_id: userId,
                        variety_id: cropVariety,
                        variety_line_code: line_code
                    },
                    attributes: ['variety_id'],
                    include: [{
                        model: allocationToSPAProductionCenterSeed,
                        include: [{
                            model: userModel,
                            attributes: ['id', 'name'],
                        }]
                    }]
                })
            } else {
                productioncentersecond2 = await allocationToSPASeed.findAll({
                    where: {
                        season: season,
                        year: year,
                        user_id: userId,
                        variety_id: cropVariety,
                        // variety_line_code:line_code
                    },
                    attributes: ['variety_id'],
                    include: [{
                        model: allocationToSPAProductionCenterSeed,
                        include: [{
                            model: userModel,
                            attributes: ['id', 'name'],
                        }]
                    }]
                })
            }

            let productionData;
            let productionDatas = [];
            let bspcData = [];
            if (line_code) {
                productionData = await allocationToIndentorSeed.findAll({
                    include: [
                        {
                            attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                            model: allocationToIndentorProductionCenterSeed,
                            required:false,
                            left: true,
                            where: {
                                indent_of_breeder_id: userId
                                // production_center_id: userId,
                            }
                        },

                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety,
                        variety_line_code: line_code
                    },
                    raw: true,
                    nest: true,
                });
            } else {
                productionData = await allocationToIndentorSeed.findAll({
                    include: [
                        {
                            required:false,
                            attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
                            model: allocationToIndentorProductionCenterSeed,

                            left: true,
                            where: {
                                indent_of_breeder_id: userId
                                // production_center_id: userId,
                            }
                        },

                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety,

                    },
                    raw: true,
                    nest: true,
                });
            }
            console.log(productionData, 'productionDataproductionData')
            const allocationToSPAProd = await Promise.all(productionData.map(async (el) => {
                const productionCenters = await userModel.findAll({
                    include: [
                        {
                            model: db.agencyDetailModel,
                            attributes: ['agency_name']
                        }
                    ],
                    where: {
                        id: el.allocation_to_indentor_for_lifting_seed_production_cnters.produ,
                    },
                    raw: true
                });
                if (productionCenters && productionCenters.length > 0) {
                    let userdata = []
                    productionCenters.forEach((item) => {
                        // userdata.push({
                        console.log(item, 'elelelelelel')
                        //     id:item && item.id ? item.id:'',
                        //     name:item && item.name ? item.name:''
                        // })
                        el.user = {
                            name: item && item.name ? item.name : '',
                            id: item && item.id ? item.id : '',
                            production_center_id: item && item.id ? item.id : '',
                            value: item && item.id ? item.id : '',
                            produ: item && item.id ? item.id : '',
                            agency_name: item && item['agency_detail.agency_name'] ? item['agency_detail.agency_name'] : ''

                        }
                    })
                    // el.userdata=userdata;
                }

                return el;
            }));

            // productionData = bsp3Helper.removeDuplicates(productionData, 'allocation_to_indentor_for_lifting_seed_production_cnters.produ')
            const variety = await varietyModel.findAll({
                where: {
                    id: cropVariety
                },
                raw: true,
                attributes: ['variety_code']
            })
            const allocationToSPAProd2 = await Promise.all(productionData.map(async (el) => {
                const productionCenters = await db.availabilityOfBreederSeedModel.findAll({
                    where: {
                        year: year,
                        season: season,
                        crop_code: cropCode,
                        variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : ''
                    },
                    raw: true
                });
                console.log(productionCenters, 'productionCenters')
                if (productionCenters && productionCenters.length > 0) {
                    let userdata = []
                    productionCenters.forEach((item) => {
                        el.quantityProduced = item && item.allocate_qty ? el.allocate_qty : 0
                    })
                    // el.userdata=userdata;
                }

                return el;
            }));
            let datas = []
            let availableData;
            if (line_code) {

                availableData = await db.availabilityOfBreederSeedModel.findAll({
                    include: [
                        {
                            model: varietyModel,
                            attributes: ['id', 'variety_code', 'variety_name']
                        }
                    ],
                    where: {
                        year: Number(year),
                        season,
                        crop_code: cropCode,
                        variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : '',
                        variety_line_code: line_code
                        // is_active:1
                        // user_id: user_id
                    },
                    raw: true,
                    nest: true,
                });
                datas.push(availableData)
            } else {
                availableData = await db.availabilityOfBreederSeedModel.findAll({
                    include: [
                        {
                            model: varietyModel,
                            attributes: ['id', 'variety_code', 'variety_name']
                        }
                    ],
                    where: {
                        year: Number(year),
                        season,
                        crop_code: cropCode,
                        variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : '',

                        // is_active:1
                        // user_id: user_id
                    },
                    raw: true,
                    nest: true,
                });
                datas.push(availableData)
            }
            if (datas && datas.length > 0) {
                datas = datas ? datas.flat() : '';
            }
            console.log('datas', datas)
            const datav1 = await db.availabilityOfBreederSeedModel.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    year: Number(year),
                    season,
                    crop_code: cropCode,
                    variety_code: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : ''
                    // is_active:1
                    // user_id: user_id
                },
                raw: true,
                nest: true,
            });
            let varietyId = [];
            let varietyCode3 = []
            if (datav1 && datav1.length > 0) {
                datav1.forEach((el) => {
                    varietyId.push({
                        variety_id: el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '',
                        variety_code: el && el.m_crop_variety && el.m_crop_variety.variety_code ? el.m_crop_variety.variety_code : '',
                        variety_line_code: el && el.variety_line_code ? el.variety_line_code : ''
                    });
                    varietyCode3.push(el && el.m_crop_variety && el.m_crop_variety.id ? el.m_crop_variety.id : '');

                })
            }


            let allocatedQuantityparental = await db.allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: varietyModel,
                        attributes: ['id', 'variety_code', 'variety_name']
                    }
                ],
                where: {
                    variety_id: {
                        [Op.in]: varietyCode3
                    }
                },
                raw: true,
                attributes: ['variety_id']
            })
            if (varietyId && allocatedQuantityparental && allocatedQuantityparental.length > 0 && varietyId.length > 0) {
                const secondArrayMap = varietyId.reduce((acc, item) => {
                    acc[item.variety_id] = item;
                    return acc;
                }, {});

                // Merge the arrays based on variety_id
                allocatedQuantityparental = allocatedQuantityparental.map(item => ({
                    ...item,
                    ...(secondArrayMap[item.variety_id] || {})
                }));
            }
            let allocationToSPAProd3;

            allocationToSPAProd3 = await Promise.all(allocatedQuantityparental.map(async (el) => {
                let allocatedQuantity2;
                let allocatedQuantityparental
                if (el && el.variety_line_code) {
                    allocatedQuantityparental = await db.indentorBreederSeedModel.findAll({
                        include: [
                            {
                                model: db.indentOfBrseedLines,
                                where: {
                                    variety_code_line: el.variety_line_code
                                },
                                attributes: []
                            }
                        ],
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_brseed_line.quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            season,
                            user_id: req.query.user_id,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id
                        },
                        raw: true,
                        nest: true,
                    });


                } else {
                    allocatedQuantity2 = await db.indentorBreederSeedModel.findAll({
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'target_qunatity'],
                            // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                            // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                        ],
                        where: {
                            crop_code: cropCode,
                            year,
                            season,
                            // crop_group_code: cropGroup,
                            variety_id: el.variety_id,
                            user_id: req.query.user_id,
                        },
                        raw: true,
                        nest: true,
                    });

                }
                let indentQtyData = [];
                if (allocatedQuantityparental) {
                    indentQtyData = indentQtyData.concat(allocatedQuantityparental)
                }
                if (allocatedQuantity2) {
                    indentQtyData = indentQtyData.concat(allocatedQuantity2)
                }
                return indentQtyData

            })
            )
            let sumindent = 0;
            if (allocationToSPAProd3 && allocationToSPAProd3.length > 0) {
                allocationToSPAProd3 = allocationToSPAProd3 ? allocationToSPAProd3.flat() : '';
                // console.log(productionCenters,'productionCenters')
                allocationToSPAProd3.forEach(el => {
                    sumindent += Number(el.target_qunatity, 10);
                    // sum += Number(el.allocation_to_indentor_for_lifting_seed_production_cnters.alloc, 10);
                    return sumindent;
                });
            }
            console.log('SPA', datas)
            // console.log('productionData', productionData)
            let producedQuantityMap = {};
            if(datas && datas.length>0){

                datas.forEach(item => {
                    if(item.user_id){
                        producedQuantityMap[item.user_id] = item.breeder_see_qty;
                    }
                });
            }
            if(productionData && productionData.length>0){

              
                // Update dataset1 with producedquantity from dataset2
                productionData.forEach(item => {
                    if(item && item.user && item.user.id){
                        if (producedQuantityMap[item.user.id]) {
                            item.producedquantity = producedQuantityMap[item.user.id];
                        }
                    }
                });
            }

            console.log(productionData,'productionDataproductionDataproductionData');


            return response(res, status.DATA_AVAILABLE, 200, {
                indentors: SPA,
                productionCenters: productionData,
                totalIndentQuantity: sumindent,
                totalAllocationQuantity,
                productioncentersecond2: productioncentersecond2
            });
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static allocationToSpaLineDataforEdit = async (req, res) => {
        try {
            const { year, season, crop_code, variety_id, } = req.body;
            let data = await db.allocationToSPASeed.findAll({
                where: {
                    year,
                    season,
                    crop_code,
                    variety_id: variety_id,
                    variety_line_code: {
                        [Op.ne]: null
                    }
                },
                include: [
                    {
                        model: db.VarietyLines,
                        attributes: []
                    }
                ],
                attributes: [
                    [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_line_code'), 'value'],
                    [sequelize.col('m_variety_line.line_variety_name'), 'name']
                ],
                raw: true
            })


            console.log(data)
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
    static getAllocationSpaData = async (req, res) => {
        try {
            const { year, season, crop_code, variety_id, variety_line } = req.body;
            let whereClause = {}
            if (year) {
                whereClause.year = year;
            }
            if (season) {
                whereClause.season = season;
            }
            if (crop_code) {
                whereClause.crop_code = crop_code;
            }

            if (variety_id) {
                whereClause.variety_id = variety_id;
            }
            if (variety_line) {
                whereClause.variety_line_code = variety_line
            }

            let datas = await db.allocationToSPASeed.findAll({
                include: [

                    {
                        model: db.allocationToSPAProductionCenterSeed,
                        // where:{
                        //     production_center_id:req.body.loginedUserid.id
                        // },
                        attributes: []
                    }
                ],
                attributes: [
                    [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code']

                ],
                where: {
                    ...whereClause,
                    user_id: req.body.loginedUserid.id

                },
                raw: true
            })
            let data;
            let allocationData = [];

            for (let key of datas) {
                data = await db.allocationToSPASeed.findAll({
                    where: {
                        ...whereClause,
                        // where:{
                        user_id: req.body.loginedUserid.id
                        // production_center_id:req.body.loginedUserid.id
                        // },
                        // variety_line_code: {
                        //     [Op.ne]: null
                        // }
                    },
                    include: [
                        {
                            model: db.varietyModel,
                            attributes: ['variety_name']
                        },
                        {
                            model: db.allocationToSPAProductionCenterSeed,

                            // as:'userData',
                            include: [{
                                model: db.userModel,
                                include: [{
                                    model: db.agencyDetailModel,
                                    where: {
                                        state_id: key.state_code
                                    },
                                },

                                ],

                                attributes: ['name', 'id'],
                            }],
                            // attributes: []
                        },
                        {
                            model: db.mVarietyLines,
                            attributes: ['line_variety_name', 'line_variety_code']
                        },

                    ],

                })
                // console.log(data[0].allocation_to_spa_for_lifting_seed_production_cnters[0].user,'data')
                allocationData.push(data)
            }
            if (allocationData && allocationData.length > 0) {
                allocationData = allocationData ? allocationData.flat() : ''
            }
            allocationData = this.removeDuplicates(allocationData, 'id')
            const totalVarietyData = await Promise.all(allocationData.map(async item => {
                let data = await Promise.all(item.dataValues.allocation_to_spa_for_lifting_seed_production_cnters.map(async val => {
                    // console.log('vall=====>',val.dataValues.production)
                    let items = await db.agencyDetailModel2.findAll({
                        where: {
                            user_id: val.dataValues.production
                        },
                        attributes: ['agency_name']

                    })
                    return items
                }))
                return item
            }))
            let bspcData = await db.allocationToSPASeed.findAll({
                include: [

                    {
                        model: db.allocationToSPAProductionCenterSeed,
                        attributes: []
                    }
                ],
                attributes: [
                    [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id']

                ],
                where: {
                    ...whereClause
                    // year,
                    // season,
                    // crop_code,
                    // variety_id: variety_id,
                    // variety_line_code: variety_line,
                    // variety_line_code: {
                    //     [Op.ne]: null
                    // }
                },
                raw: true
            })
            let production_center_id = []
            if (bspcData && bspcData.length > 0) {
                bspcData.forEach(el => {
                    production_center_id.push(el && el.production_center_id ? el.production_center_id : '');
                })
            }
            let user = await userModel.findAll({
                include: [
                    {
                        model: agencyDetailModel,
                        attributes: ['agency_name']
                    }
                ],
                where: {
                    id: {
                        [Op.in]: production_center_id
                    }
                },
                raw: true,
                attributes: ['name', 'id']
            })
            let filterData = {
                allocationData,
                user

            }


            if (!allocationData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, filterData);
        }
        catch (error) {
            console.log(error, 'error')
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static removeDuplicates(array, key) {
        const uniqueValues = new Set();
        return array.filter(obj => {
            if (!uniqueValues.has(obj[key])) {
                uniqueValues.add(obj[key]);
                return true;
            }
            return false;
        });
    }
    static updateAllocationSpaData = async (req, res) => {
        try {
            const { year, season, cropName, variety_id, variety_line, varietyData, id } = req.body;
            let whereClause = {}
            if (year) {
                whereClause.year = year
            }
            if (season) {
                whereClause.season = season
            }
            if (cropName) {
                whereClause.crop_code = cropName
            }
            if (variety_id) {
                whereClause.variety_id = variety_id
            }
            if (variety_line) {
                whereClause.variety_line_code = variety_line
            }
            if (id) {
                let data = await allocationToSPAProductionCenterSeed.destroy({
                    where: {
                        allocation_to_spa_for_lifting_seed_id: id
                    }
                })
            }
            let datas;
            for (let key of varietyData) {

                datas = await allocationToSPAProductionCenterSeed.create({
                    allocation_to_spa_for_lifting_seed_id: id,
                    production_center_id: key.bspc_id,
                    qty: key.quantity,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    quantity_left_for_allocation: key.quantity_left_for_allocation,
                    allocated_quantity: key.quantity,
                    spa_code: key.spa_code,
                    state_code: key.state_code,
                    indent_qty: key.indent_quantity
                })
            }

            // let data/
            if (!datas) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, datas);
        }
        catch (error) {
            console.log(error, 'error')
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static updateSpaStatus = async (req, res) => {
        try {
            const { year, season, cropName, variety_id, variety_line, varietyData, id } = req.body;
            let whereClause = {}
            if (year) {
                whereClause.year = year
            }
            if (season) {
                whereClause.season = season
            }
            if (cropName) {
                whereClause.crop_code = cropName
            }
            if (variety_id) {
                whereClause.variety_id = variety_id
            }
            if (variety_line) {
                whereClause.variety_line_code = variety_line
            }
            const dataRow = {
                is_active: 1
            }
            let data = await allocationToSPASeed.update(dataRow, {
                where: {
                    ...whereClause
                }
            },
            )

            // let data/
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log(error, 'error')
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
};

module.exports = AllocationToSPA;
