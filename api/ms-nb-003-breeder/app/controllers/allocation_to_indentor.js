const Validator = require('validatorjs');
const response = require('../_helpers/response');
const Sequelize = require('sequelize');
const status = require('../_helpers/status.conf');
const { bsp4Model, cropModel, varietyModel, seasonModel, indenterModel, bsp1Model, bsp1ProductionCenterModel, bsp2Model, bsp3Model, userModel, labelNumberForBreederseed, generatedLabelNumber, allocationToIndentorSeed, allocationToIndentorProductionCenterSeed, allocationToIndentorProductionCenter, lotNumberModel, seedTestingReportsModel, agencyDetailModel, indenterSPAModel, allocationToSPASeed, allocationToSPAProductionCenterSeed, generatedLabelNumberModel } = require('../models');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');
const indentorHelper = require('../_helpers/indentor');
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const db = require("../models");

class AllocationToIndentor {

    // API for List Data

    static yearData = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await db.availabilityOfBreederSeedModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.year')), 'year'],
                ],
                where: {
                    target_qty_national: {
                        [Op.gt]: 0
                    }
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
            const user_id = req.query.user_id;
            const data = await db.availabilityOfBreederSeedModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },

                where: {
                    year: year,
                    target_qty_national: {
                        [Op.gt]: 0
                    }
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

            const data = await bsp4Model.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_4s.crop_group_code')), 'crop_group_code']
                ],

                where: {
                    year,
                    season,

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
            // const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await db.availabilityOfBreederSeedModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.crop_code')), 'crop_code'],
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
                    target_qty_national: {
                        [Op.gt]: 0
                    }
                },

                raw: true,
            });

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

    static varietiesData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            // const cropGroup = req.query.cropGroup;
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
                    year,
                    season,
                    crop_code: cropCode,
                },

                raw: true,
                nest: true,
            });
            let totalLots = [];
            const combinedData = await Promise.all(data.map(async el => {
                let allocatedQuantity = await bsp1Model.findAll({
                    attributes: ['id'],
                    include: {
                        attributes: ['production_center_id', 'quantity_of_seed_produced'],
                        model: bsp1ProductionCenterModel,
                        left: true,
                    },
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
                const lot = await Promise.all(allocatedQuantity.map(async item => {
                    const quantity = await this.lotNumber(parseInt(year), cropCode, el.variety_id, item.bsp1_production_centers.production_center_id);
                    // console.log('quantity', quantity);
                    if (quantity.length) {
                        return quantity;
                    }
                }).filter(el => el !== undefined));
                // console.log('lot', lot);
                if (lot.length) {
                    lot.forEach(el => {
                        if (el !== undefined) {
                            totalLots.push(el)
                        }
                    });
                }
                if (allocatedQuantity.length > 1) {
                    const sum = allocatedQuantity.reduce((prev, cur) => prev + Number(cur.bsp1_production_centers.quantity_of_seed_produced, 10), 0);
                    allocatedQuantity = [];
                    allocatedQuantity.push({
                        bsp1_production_centers: {
                            quantity_of_seed_produced: sum
                        }
                    });
                }
                let indentQuantity = await indenterModel.findAll({
                    attributes: ['indent_quantity'],
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // group_code: cropGroup,
                        variety_id: el.variety_id
                    },
                    raw: true
                });
                if (indentQuantity.length > 1) {
                    const sum = indentQuantity.reduce((prev, cur) => prev + cur.indent_quantity, 0);
                    console.log('sum: ' + sum);
                    indentQuantity = [];
                    indentQuantity.push({
                        indent_quantity: sum
                    });
                }
                return {
                    allocatedQuantity: allocatedQuantity[0],
                    indentQuantity: indentQuantity[0]
                };
            }));
            // console.log('lot', totalLots);
            const weights = totalLots.map(subArr => {
                return subArr.reduce((total, obj) => {
                    return total + parseInt(obj.lot_number_size);
                }, 0);
            }).reduce((arr, curr) => {
                return arr + curr
            }, 0);
            const totalIndentQuantity = combinedData.reduce((prev, current) => {
                const sum = prev + current.indentQuantity.indent_quantity;
                return sum;
            }, 0);
            // const totalAllocationQuantity = combinedData.reduce((prev, current) => {
            //     const sum = prev + Number(current.allocatedQuantity.bsp1_production_centers.quantity_of_seed_produced, 10);
            //     return sum;
            // }, 0);
            const totalAllocationQuantity = weights;

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const tempData = await Promise.all(data.map(async variety => {
                const condition = {
                    where: {
                        year: year,
                        season: season,
                        crop_code: cropCode,
                        variety_id: variety.variety_id
                    }
                };

                const data = await allocationToIndentorSeed.count(condition);

                if (!data) {
                    return variety
                }

                return
            }))

            const temp = []

            tempData.forEach(element => {
                if (element) {
                    temp.push(element)
                }
            });


            return response(res, status.DATA_AVAILABLE, 200, {
                varieties: temp,
                totalNumberOfVariety: temp.length,
                totalIndentQuantity,
                totalAllocationQuantity
            });
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static varietiesDataForEdit = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            // const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

           let  availabledata = await db.availabilityOfBreederSeedModel.findAll({
                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code'],
                    // [sequelize.col('allocation_to_indentor_for_lifting_seeds.is_variety_submitted'),'is_variety_submitted']
                    // [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.variety_code')), 'variety_code'],
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    // target_qty_national: {
                    //     [Op.ne]: null
                    // }
                },

                raw: true,
                // nest: true,
            });
           
              
            const varietyData = await db.allocationToIndentorSeed.findAll({
                where: {
                    is_variety_submitted: {
                        [Op.eq]: 1
                    },


                },
                attributes: [
                    'variety_id','variety_line_code',
                    [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
                    [sequelize.literal('m_crop_variety.variety_code'), 'value'],
                    // [sequelize.col('m_cropv')]
                ],
                include: [{
                    model: varietyModel,
                    attributes: []

                }],
                raw: true
            })
            const exclusiveArray = availabledata.filter(item => {
                if (item.variety_line_code) {
                  return !varietyData.some(
                    secondItem =>
                      secondItem.value === item.variety_code &&
                      secondItem.variety_line_code === item.variety_line_code
                  );
                } else {
                  return !varietyData.some(secondItem => secondItem.value === item.variety_code);
                }
              });
      
            let varieties = []
            if (exclusiveArray && exclusiveArray.length > 0) {
                exclusiveArray.forEach(el => {
                    varieties.push(el && el.variety_code ? el.variety_code : '')
                })
            }
            let data;

             data = await db.availabilityOfBreederSeedModel.findAll({
                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code'],
                    // [sequelize.col('allocation_to_indentor_for_lifting_seeds.is_variety_submitted'),'is_variety_submitted']
                    // [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.variety_code')), 'variety_code'],
                ],
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    // {
                    //     model: allocationToIndentorSeed,
                    //    attributes:[],
                    //    where:{

                    //    }
                    // }
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    target_qty_national: {
                        [Op.ne]: null
                    },
                    variety_code: {
                        [Op.in]: varieties
                    },


                },

                raw: true,
                nest: true,
            });
            const dataedit = await db.availabilityOfBreederSeedModel.findAll({
                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code'],
                    // [sequelize.col('allocation_to_indentor_for_lifting_seeds.is_variety_submitted'),'is_variety_submitted']
                    // [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.variety_code')), 'variety_code'],
                ],
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    // {
                    //     model: allocationToIndentorSeed,
                    //    attributes:[],
                    //    where:{

                    //    }
                    // }
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    target_qty_national: {
                        [Op.ne]: null
                    },


                },

                raw: true,
                nest: true,
            });
            const dataedit2 = await db.availabilityOfBreederSeedModel.findAll({
                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code'],
                    // [sequelize.col('allocation_to_indentor_for_lifting_seeds.is_variety_submitted'),'is_variety_submitted']
                    // [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.variety_code')), 'variety_code'],
                ],
                group:[
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code'],
                    'm_crop_variety.id'
                ],
                include: [
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name', 'variety_code'],
                    },
                    // {
                    //     model: allocationToIndentorSeed,
                    //    attributes:[],
                    //    where:{

                    //    }
                    // }
                ],
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    target_qty_national: {
                        [Op.ne]: null
                    },


                },

                raw: true,
                nest: true,
            });
            // console.log(data,'availabilityData')
            let totalLots = [];
            const combinedData = await Promise.all(dataedit2.map(async el => {
                let allocatedQuantity = await bsp1Model.findAll({
                    attributes: ['id'],
                    include: {
                        attributes: ['production_center_id', 'quantity_of_seed_produced'],
                        model: bsp1ProductionCenterModel,
                        left: true,
                    },
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // crop_group_code: cropGroup,
                        variety_id: el.m_crop_variety.id
                    },
                    raw: true,
                    nest: true,
                });
                // const lot = await Promise.all(allocatedQuantity.map(async item => {
                //     const quantity = await this.lotNumber(parseInt(year), cropCode, el.variety_id, item.bsp1_production_centers.production_center_id);
                //     // console.log('quantity', quantity);
                //     if (quantity.length) {
                //         return quantity;
                //     }
                // }).filter(el => el !== undefined));
                // console.log('lot', lot);
                // if (lot.length) {
                //     lot.forEach(el => {
                //         if (el !== undefined) {
                //             totalLots.push(el)
                //         }
                //     });
                // }
                // if (allocatedQuantity.length > 1) {
                //     const sum = allocatedQuantity.reduce((prev, cur) => prev + Number(cur.bsp1_production_centers.quantity_of_seed_produced, 10), 0);
                //     allocatedQuantity = [];
                //     allocatedQuantity.push({
                //         bsp1_production_centers: {
                //             quantity_of_seed_produced: sum
                //         }
                //     });
                // }
                let indentQuantity = await indenterModel.findAll({
                    attributes: ['indent_quantity'],
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // group_code: cropGroup,
                        variety_id: el.m_crop_variety.id
                    },
                    raw: true
                });
                if (indentQuantity.length > 1) {
                    const sum = indentQuantity.reduce((prev, cur) => prev + cur.indent_quantity, 0);
                    console.log('sum: ' + sum);
                    indentQuantity = [];
                    indentQuantity.push({
                        indent_quantity: sum
                    });
                }
                return {
                    allocatedQuantity: allocatedQuantity && allocatedQuantity[0] ? allocatedQuantity[0] : 0,
                    indentQuantity: indentQuantity && indentQuantity[0] ? indentQuantity[0] : 0
                };
            }));
            let combinedData2 = await Promise.all(dataedit2.map(async el => {

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
                            variety_id: el.m_crop_variety.id
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
                            variety_id: el.m_crop_variety.id
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
                console.log(indentQtyData, 'allocatedQuantityparental')
                return indentQtyData
                // allocatedQuantity2
            }))
            let productionQuantity = await Promise.all(dataedit2.map(async el => {
                let producedQty = await db.availabilityOfBreederSeedModel.findAll({
                    attributes: [
                        [sequelize.col('availability_of_breeder_seed.allocate_qty'), 'allocate_qty']

                    ],
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // crop_group_code: cropGroup,
                        variety_code: el.variety_code
                    },
                    raw: true,
                    nest: true,
                });
                return producedQty
                
            }))
            let prodQty=[]
            if(productionQuantity && productionQuantity.length>0){
                productionQuantity= productionQuantity && productionQuantity.length>0 ? productionQuantity.flat():"";
                productionQuantity.forEach(el=>{
                    prodQty.push(el && el.allocate_qty ? el.allocate_qty:'')
                })
            }

            let nationalQty;
            if (combinedData2 && combinedData2.length > 0) {
                combinedData2 = combinedData2 ? combinedData2.flat() : ''
                nationalQty = combinedData2.reduce((accumulator, current) => {
                    return accumulator + current.target_qunatity;
                }, 0);
            }

            const totalProduction = prodQty.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
            console.log(productionQuantity[0],'totalProductiontotalProduction')
            totalLots = bsp3Helper.removeDuplicates(totalLots.flat(), 'id');
            // console.log('lot?????', totalLots);
            const weights = totalLots.reduce((total, obj) => total + obj.lot_number_size, 0);
            // console.log('weights', weights);
            // let indentData = await db.indenterModel.findAl({
            //     where:{
                    
            //     }
            // })
            console.log(productionQuantity,'combinedData2')
            const totalIndentQuantity = combinedData.reduce((prev, current) => {
                const sum = prev + current.indentQuantity.indent_quantity;
                return sum;
            }, 0);
            // const totalAllocationQuantity = combinedData.reduce((prev, current) => {
            //     const sum = prev + Number(current.allocatedQuantity.bsp1_production_centers.quantity_of_seed_produced, 10);
            //     return sum;
            // }, 0);
            // const totalAllocationQuantity = weights;

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }


            return response(res, status.DATA_AVAILABLE, 200, {
                varieties: data,
                totalNumberOfVariety: dataedit2.length,
                totalProduction,
                totalIndentQuantity,
                totalAllocationQuantity: weights,
                varietyforedit: dataedit,
                nationalQty
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

    static varietyData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropCode = req.query.cropCode;
            const cropVariety = req.query.cropVariety;
            let line_code = req.query.line_code;
            // line_code='L034'
            // let variety= await db.availabilityOfBreederSeedModel.findAll({
            //     where:{
            //         year:year,
            //         season:season
            //     }

            // })
            let filterData = [];
            let whereClause = {};
            let filterData2 = [];
            if (line_code) {
                filterData.push({
                    variety_code_line: {
                        [Op.eq]: line_code
                    },
                })
            }
            if (line_code) {
                // whereClause.plot_code = plotid
                whereClause.variety_line_code = line_code;
            }
            // if (line_code) {
            //     filterData2.push({
            //         variety_code_line: {
            //             [Op.eq]: line_code
            //         },
            //     })
            // }
            let indentors;
            if (line_code) {
                indentors = await indenterModel.findAll({
                    attributes: ['id', 'indent_quantity', 'user_id', 'unit',
                        [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
                        [sequelize.col('indent_of_brseed_line.quantity'), 'quantity'],
                    ],
                    include: [
                        {
                            attributes: ['name'],
                            model: userModel,
                            left: true,
                        },
                        {
                            attributes: ['agency_name'],
                            model: agencyDetailModel,
                            left: true,
                        },
                        {
                            model: db.indentOfBrseedLines,
                            required: true,
                            attributes: [],
                            where: { [Op.and]: filterData ? filterData : [] },

                        }
                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety
                    },
                    raw: true,
                    nest: true,
                });
            } else {
                indentors = await indenterModel.findAll({
                    attributes: ['id', 'indent_quantity', 'user_id', 'unit',
                        // [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
                        // [sequelize.col('indent_of_brseed_line.quantity'), 'quantity'],
                    ],
                    include: [
                        {
                            attributes: ['name'],
                            model: userModel,
                            left: true,
                        },
                        {
                            attributes: ['agency_name'],
                            model: agencyDetailModel,
                            left: true,
                        },
                        // {
                        //     model: db.indentOfBrseedLines,
                        //     attributes: [],
                        //     where: { [Op.and]: filterData ? filterData : [] },

                        // }
                    ],
                    where: {
                        year,
                        season,
                        crop_code: cropCode,
                        variety_id: cropVariety
                    },
                    raw: true,
                    nest: true,
                });
            }

            if (!indentors) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // console.log('>>>>>>>>>>>>>>>', indentors);
            indentors.map(el => {
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            const bsp1Data = await Promise.all(indentors.map(async el => {
                return await bsp1Model.findOne({
                    attributes: ['id'],
                    include: {
                        attributes: ['id'],
                        model: bsp2Model,
                        left: true,
                        include: {
                            attributes: ['id'],
                            model: bsp3Model,
                            left: true,
                            include: {
                                model: bsp4Model,
                                left: true,
                            }
                        }
                    },
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // crop_group_code: cropGroup,
                        variety_id: cropVariety,
                        indent_of_breederseed_id: el.id
                    },
                    raw: true,
                    nest: true,
                });
            }));
            const varietyData = await varietyModel.findAll({
                where: {
                    id: cropVariety
                },
                attributes: ['variety_code'],
                raw: true
            })
            const breederSeed = await db.availabilityOfBreederSeedModel.findAll({
                attributes: [
                    [sequelize.col('availability_of_breeder_seed.target_qty_national'), 'target_qty_national']
                    // [sequelize.fn('SUM', sequelize.col('availability_of_breeder_seed.target_qty_national')), 'target_qty_national'],
                    // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                    // [sequelize.col('bsp_proforma_1s.variety_line_code'),'variety_line_code']
                ],
                // include: {
                //     attributes: ['id'],
                //     model: bsp2Model,
                //     left: true,
                //     include: {
                //         attributes: ['id'],
                //         model: bsp3Model,
                //         left: true,
                //         include: {
                //             model: bsp4Model,
                //             left: true,
                //         }
                //     }
                // },
                where: {
                    crop_code: cropCode,
                    year,
                    season,
                    // crop_group_code: cropGroup,
                    variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                    // indent_of_breederseed_id: el.id
                },
                raw: true,
                nest: true,
            });
            // let indent = await db.indentorBreederSeedModel.findAll({

            //     attributes: [
            //         //    [sequelize.col('indent_of_breederseeds.indent_quantity'),'indent_quantity']
            //         [sequelize.literal('SUM(indent_of_breederseeds.indent_quantity)'), 'indent_quantity'],
            //         // [Sequelize.col('agency_detail.agency_name'),'agency_name'],
            //         // [Sequelize.col('user.name'),'name'],
            //     ],
            //     where: {
            //         // year:year,
            //         // season:season,
            //         // crop_code:cropCode,
            //         variety_id: cropVariety,
            //     },
            //     raw: true
            // })
            const data = await db.availabilityOfBreederSeedModel.findAll({

                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.variety_code'), 'variety_code'],
                    [Sequelize.col('availability_of_breeder_seed.variety_line_code'), 'variety_line_code']
                    // [Sequelize.fn('DISTINCT', Sequelize.col('availability_of_breeder_seed.variety_code')), 'variety_code'],
                ],
                include: {
                    model: varietyModel,
                    left: true,
                    attributes: ['id', 'variety_name', 'variety_code'],
                },
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                },

                raw: true,
                nest: true,
            });
            let combinedData2 = await Promise.all(data.map(async el => {

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
                            // year,
                            // season,
                            // crop_group_code: cropGroup,
                            variety_id: cropVariety
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
                            // year,
                            // season,
                            // crop_group_code: cropGroup,
                            variety_id: cropVariety
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
                // allocatedQuantity2
            }));
            let indentorqty
            if (combinedData2 && combinedData2.length > 0) {
                combinedData2 = combinedData2 ? combinedData2.flat() : '';
                indentorqty = combinedData2.reduce((accumulator, current) => {
                    return accumulator + current.target_qunatity;
                }, 0);

            }
            // const indentorqty = indent.reduce((accumulator, current) => {
            //     return accumulator + current.indent_quantity;
            // }, 0);
            let AllocatedQty = await db.availabilityOfBreederSeedModel.findAll({

                // attributes: ['id'],   
                attributes: [
                    // [sequelize.fn('SUM', sequelize.col('bsp_proforma_1_bspc.target_qunatity')), 'target_qunatity'],
                    // [sequelize.col('bsp_proforma_1s.variety_code'),'variety_code'],
                    [sequelize.col('availability_of_breeder_seed.allocate_qty'), 'allocate_qty'],
                    [sequelize.col('availability_of_breeder_seed.id'), 'allocated_id']
                ],
                // where: { [Op.and]: filterData ? filterData : [] },
                where: {
                    // crop_code: cropCode,
                    // year,
                    // season,
                    // [Op.and]: filterData2 ? filterData2 : [],
                    // crop_group_code: cropGroup,
                    ...whereClause,
                    variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                    // indent_of_breederseed_id: el.id
                },
                raw: true,
                nest: true,
            });
            console.log(AllocatedQty, 'AllocatedQty')
            if (AllocatedQty && AllocatedQty.length > 0) {
                AllocatedQty = AllocatedQty.filter(x => x != null)
            }
            let AllocatedQtydata
            if (AllocatedQty && AllocatedQty.length > 0) {

                AllocatedQtydata = bsp3Helper.removeDuplicates(AllocatedQty, 'allocated_id')
            }
            let totalAllocatedQty;
            if (AllocatedQty && AllocatedQty.length > 0) {
                totalAllocatedQty = AllocatedQtydata.reduce((accumulator, current) => {
                    return accumulator + current.allocate_qty;
                }, 0);
            }
            if (!bsp1Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // const productionCentersObj = await Promise.all(bsp1Data.map(async el => await indentorHelper.productionCenters(el.id)));
            // console.log('productionCentersObj', JSON.stringify(productionCentersObj));

            // if (!productionCentersObj) {
            //     return response(res, status.DATA_NOT_AVAILABLE, 404);
            // }
            let totalIndentQuantity;
            if (line_code) {
                totalIndentQuantity = bsp3Helper.sumOfAllElements(indentors, 'quantity');
            } else {
                totalIndentQuantity = bsp3Helper.sumOfAllElements(indentors, 'indent_quantity');
            }
            // const totalAllocationQuantity = bsp3Helper.sumOfAllElements(productionCentersObj, 'quantityOfSeedProduced');
            let productionCenters = [];
            let totalLots = [];
            let weight = 0;
            let production = await db.availabilityOfBreederSeedModel.findAll({
                include: [
                    {
                        model: agencyDetailModel,
                        attributes: ['agency_name', 'id', 'user_id']
                    },
                    {
                        model: userModel,
                        attributes: ['name', 'id']
                    }


                ],
                attributes: [
                    [Sequelize.col('availability_of_breeder_seed.user_id'), 'user_id'],
                    [Sequelize.col('availability_of_breeder_seed.user_id'), 'production_center_id'],
                    [Sequelize.col('availability_of_breeder_seed.allocate_qty'), 'quantityProduced'],
                    // [Sequelize.col('agency_detail.agency_name'),'agency_name'],
                    // [Sequelize.col('user.name'),'name'],
                ],
                where: {
                    year: year,
                    season: season,
                    crop_code: cropCode,
                    ...whereClause,
                    // [Op.and]: filterData ? filterData : [] ,
                    variety_code: varietyData && varietyData[0] && varietyData[0].variety_code ? varietyData[0].variety_code : '',
                },
                // raw:true
            })

            let allocationToIndentorSeeddata = await allocationToIndentorSeed.findAll({
                include: [
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        attributes: []
                    }
                ],
                raw: true,
                where: {
                    year: year,
                    season: season,
                    crop_code: cropCode,
                    variety_id: cropVariety
                },
                attributes: [
                    // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'),'qty'],
                    [sequelize.literal('SUM(allocation_to_indentor_for_lifting_seed_production_cnters.qty::float)'), 'quantityAllocated'],
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.allocation_to_indentor_for_lifting_seed_id'), 'allocation_to_indentor_for_lifting_seed_id'],
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id'],
                ],
                group: [
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.allocation_to_indentor_for_lifting_seed_id'), 'allocation_to_indentor_for_lifting_seed_id'],
                    [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id'],
                ]
            })

            let totalAllocationQuantity = totalAllocatedQty;
            console.log(indentors,'indentors')
            // totalIndentQuantity=indentorqty
            // console.log('????', totalAllocationQuantity);
            // console.log('????', uniqueData);
            return response(res, status.DATA_AVAILABLE, 200, {
                indentors,
                // productionCenters: uniqueData,
                productionCenters: production,
                totalIndentQuantity,
                indentorqty,
                totalAllocatedQty,
                totalAllocationQuantity,
                allocationToIndentorSeeddata,
                // mergedArray
                // productionCenterDatas
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
                    },
                    {
                        model: allocationToIndentorProductionCenterSeed,
                        left: true
                    }
                ],
                raw: true,
                nest: true
            }

            const paginate = pagination({ formData: req.body });
            const dataToSend = { ...condition, ...paginate };
            const allocationToIndentor = await allocationToIndentorSeed.findAndCountAll(dataToSend);

            const data = []
            allocationToIndentor.rows.forEach(element => {
                const index = data.findIndex(x => x.id == element.id)

                if (index > -1) {
                    data[index]['allocationData'].push(element['allocation_to_indentor_for_lifting_seed_production_cnters'])

                } else {
                    let arr = [];
                    arr.push(element.allocation_to_indentor_for_lifting_seed_production_cnters)
                    let object = {
                        id: element.id,
                        year: element.year,
                        season: element.season,
                        crop: element.m_crop,
                        variety: element.m_crop_variety,
                        indentquantity: element.indentquantity,
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

                console.log(index)

                if (index > -1) {
                    result[index]['indentquantity'] = Number(result[index]['indentquantity']) + Number(element.indentquantity);
                    result[index]['producedquantity'] = Number(result[index]['producedquantity']) + Number(element.producedquantity);
                    result[index]['allocationQuantity'] = Number(result[index]['allocationQuantity']) + Number(element.allocationQuantity);

                } else {
                    let object = {
                        id: element.id,
                        year: element.year,
                        season: element.season,
                        crop: element.crop,
                        indentquantity: element.indentquantity,
                        producedquantity: element.producedquantity,
                        allocationQuantity: element.allocationQuantity
                    }

                    result.push(object)
                }
            });


            const temp = { rows: result, count: result.count };

            return response(res, status.DATA_AVAILABLE, 200, temp);
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
            const allocationToIndentor = await allocationToIndentorSeed.findOne({
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
            console.log('allocationToIndentor', allocationToIndentor);
            const productionCenters = await allocationToIndentorProductionCenterSeed.findAll({
                include: [
                    {
                        attributes: ['id', 'name'],
                        model: userModel,
                        left: true,
                    },
                    {
                        attributes: ['id', 'user_id', 'indent_quantity', 'unit'],
                        model: indenterModel,
                        left: true,
                        include: {
                            attributes: ['id', 'name'],
                            model: userModel,
                            left: true,
                        },
                        where: {
                            year: allocationToIndentor.year,
                            season: allocationToIndentor.season,
                            crop_code: allocationToIndentor.crop_code,
                            variety_id: allocationToIndentor.variety_id
                        }
                    }
                ],
                where: {
                    allocation_to_indentor_for_lifting_seed_id: allocationToIndentor.id
                },
                raw: true,
                nest: true,
            });
            console.log('productionCenters', productionCenters);
            let productionCenterAll = [];
            let productions = [];
            let indentors = [];
            let uniqueIndentors = [];
            let totalLots = [];
            let weight = 0;
            const productionCenterData = await Promise.all(productionCenters.map(async (el) => {
                const bsp1Data = await bsp1Model.findOne({
                    where: {
                        indent_of_breederseed_id: el.indent_of_breederseed.id
                    },
                    raw: true,
                });
                console.log('bsp1Data', bsp1Data);
                const productionCentersObj = await indentorHelper.productionCenters(bsp1Data.id);
                console.log('productionCentersObj', productionCentersObj);

                if (!productionCentersObj) {
                    return response(res, status.DATA_NOT_AVAILABLE, 404);
                }

                // let generatedLabels = [];
                // const labelNumbers = await indentorHelper.labelNumbers(allocationToIndentor.crop_code, allocationToIndentor.year, allocationToIndentor.season, allocationToIndentor.variety_id, el.production_center_id);
                // const sum = await Promise.all(labelNumbers.map(async labelNumber => {
                //     const labelGenerated = await indentorHelper.generatedLabelNumbers(labelNumber.id);
                //     console.log('labelGenerated', labelGenerated);
                //     return bsp3Helper.sumOfAllElements(labelGenerated, 'weight');
                // }));
                // console.log('sum', sum);

                const lot = await this.lotNumber(allocationToIndentor.year, allocationToIndentor.crop_code, allocationToIndentor.variety_id, el.production_center_id);
                console.log('lot>>>>>', lot);
                // const filterEl = lot.filter(el => el !== undefined)
                // if (filterEl.length) {
                //     totalLots.push(filterEl);
                // }
                const weights = lot.filter(el => el !== undefined).reduce((total, obj) => total + parseInt(obj.lot_number_size), 0);
                totalLots.push(weights);
                weight += Number(weights, 10);

                productionCenterAll.push({
                    id: el.id,
                    bsp_1_id: bsp1Data.id,
                    quantity_of_seed_produced: el.qty,
                    production_center_id: el.production_center_id,
                    user: {
                        name: el.user.name
                    },
                    quantityProduced: weight || 0,
                    quantityAllocated: el.qty,
                    quantityLeft: 0
                });
                weight = 0;
                const indentor = uniqueIndentors.includes(el.indent_of_breeder_id);
                const indentorsData = {
                    id: el.id,
                    indentor_id: el.indent_of_breeder_id,
                    indent_quantity: el.indent_of_breederseed.indent_quantity,
                    user_id: el.indent_of_breederseed.user_id,
                    unit: el.indent_of_breederseed.unit,
                    user: {
                        name: el.indent_of_breederseed.user.name
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
                if (!indentor) {
                    uniqueIndentors.push(el.indent_of_breeder_id);
                    indentors.push(indentorsData);
                } else {
                    console.log('indentors', indentors);
                    const index = indentors.findIndex((data) => data.indentor_id === el.indent_of_breeder_id);
                    console.log('index', index);
                    console.log('>>>>>>>>', indentors[index]);
                    indentors[index].productions.push({
                        id: el.id,
                        qty: el.qty,
                        productionCenter: {
                            id: el.production_center_id,
                            text: el.user.name
                        }
                    })
                }
            }));
            allocationToIndentor.indentors = indentors;
            allocationToIndentor.productionCenters = productionCenterAll;
            return response(res, status.DATA_AVAILABLE, 200, allocationToIndentor);
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
            
            console.log(formData)
           let data;
           if(formData.variety_line){

               data = await allocationToIndentorSeed.findOne({
                  where: {
                      year: formData.year,
                      season: formData.season,
                      crop_code: formData.crop_code,
                      variety_id: formData.variety_id,
                      variety_line_code:formData.variety_line
                  },
                  attributes: ['id']
              })
           }else{
            data = await allocationToIndentorSeed.findOne({
                where: {
                    year: formData.year,
                    season: formData.season,
                    crop_code: formData.crop_code,
                    variety_id: formData.variety_id,
                },
                attributes: ['id']
            })
           }

            const condition = {
                where: {
                    id: formData.indenter.value
                },
                attributes: ['id', 'user_id']
            }

            const indentorUser = await indenterModel.findOne(condition);

            if (data) {
                const prod_data = await allocationToIndentorProductionCenterSeed.findOne({
                    where: {
                        allocation_to_indentor_for_lifting_seed_id: data.id,
                        indent_of_breeder_id: indentorUser.user_id,
                    }
                })

                console.log("aa ra h")


                if (prod_data) {
                    await allocationToIndentorProductionCenterSeed.destroy({
                        where: {
                            allocation_to_indentor_for_lifting_seed_id: data.id,
                            indent_of_breeder_id: indentorUser.user_id,
                        }
                    })

                }

                const productionCenterData = {
                    allocation_to_indentor_for_lifting_seed_id: data.id,
                    indent_of_breeder_id: indentorUser.user_id,
                    allocated_quantity: formData.indenter.allocated_quantity,
                    quantity_left_for_allocation: formData.indenter.quantity_left_for_allocation,
                };

                formData.indenter.productions.map(async el => {
                    productionCenterData.qty = el.quantity;
                    productionCenterData.production_center_id = el.value;

                    await allocationToIndentorProductionCenterSeed.create(productionCenterData, {
                        raw: true,
                        nest: true,
                    })
                });

                return response(res, status.DATA_AVAILABLE, 200, data);


            } else {
                console.log(formData, 'formData')
                const cropGroupCode = await bsp3Helper.getGroupCode(formData.crop_code);
                const dataToInsert = {
                    year: formData.year,
                    is_active: 0,
                    crop_code: formData.crop_code,
                    user_id: user.id,
                    is_freeze: 0,
                    isdraft: 0,
                    crop_group_code: cropGroupCode || "",
                    season: formData.season,
                    variety_id: formData.variety_id,
                    indentquantity: formData.totalIndentQuantity.toString(),
                    producedquantity: formData.totalAllocationQuantity.toString(),
                    is_variety_submitted: 0,
                    variety_line_code:formData.variety_line
                };

                const row = await allocationToIndentorSeed.create(dataToInsert, {
                    raw: true,
                    nest: true,
                })

                if (!row) {
                    return response(res, status.DATA_NOT_SAVE, 404);
                }

                const productionCenterData = {
                    allocation_to_indentor_for_lifting_seed_id: row.id,
                    indent_of_breeder_id: indentorUser.user_id,
                    allocated_quantity: formData.indenter.allocated_quantity,
                    quantity_left_for_allocation: formData.indenter.quantity_left_for_allocation,
                };

                console.log(formData.indenter.productions, 'productionCenterData')
                formData.indenter.productions.map(async el => {
                    productionCenterData.qty = el.quantity;
                    productionCenterData.production_center_id = el.value;

                    await allocationToIndentorProductionCenterSeed.create(productionCenterData, {
                        raw: true,
                        nest: true,
                    })
                });

                return response(res, status.DATA_AVAILABLE, 200, row);
            }

            // const indentorData = await Promise.all(formData.map(async element => {



            //     if (data) {
            //         await allocationToIndentorProductionCenterSeed.destroy({
            //             where: {
            //                 allocation_to_indentor_for_lifting_seed_id: data.id
            //             }
            //         })

            //         await allocationToIndentorSeed.destroy({
            //             where: {
            //                 id: data.id
            //             }
            //         })
            //     }

            //     const cropGroupCode = await bsp3Helper.getGroupCode(element.crop_code);
            //     const dataToInsert = {
            //         year: element.year,
            //         is_active: 0,
            //         crop_code: element.crop_code,
            //         user_id: user.id,
            //         is_freeze: 0,
            //         isdraft: 0,
            //         crop_group_code: cropGroupCode || "",
            //         season: element.season,
            //         variety_id: element.variety_id,
            //         indentquantity: element.totalIndentQuantity.toString(),
            //         producedquantity: element.totalAllocationQuantity.toString(),
            //         is_variety_submitted: 0
            //     };
            //     const row = await allocationToIndentorSeed.create(dataToInsert, {
            //         raw: true,
            //         nest: true,
            //     })

            //     element.indenter.map(async identor => {
            //         const condition = {
            //             where: {
            //                 id: identor.value
            //             },
            //             attributes: ['id', 'user_id']
            //         }
            //         const indentorUser = await indenterModel.findOne(condition);

            //         const productionCenterData = {
            //             allocation_to_indentor_for_lifting_seed_id: row.id,
            //             indent_of_breeder_id: indentorUser.user_id,
            //             allocated_quantity: identor.allocated_quantity,
            //             quantity_left_for_allocation: identor.quantity_left_for_allocation,
            //         };


            //         identor.productions.map(async el => {
            //             productionCenterData.qty = el.quantity;
            //             productionCenterData.production_center_id = el.value;
            //             await allocationToIndentorProductionCenterSeed.create(productionCenterData, {
            //                 raw: true,
            //                 nest: true,
            //             })
            //         });
            //     });
            //     return row;
            // }));

        }
        catch (error) {
            console.log('error: ' + error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static varietyWiseSubmission = async (req, res) => {
        try {
            const formData = req.body['formData'];
            console.log(formData)

            if (!formData) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const condition = {
                where: {
                    year: formData.year,
                    season: formData.season,
                    crop_code: formData.crop_code,
                    variety_id: formData.selectedVariety['variety_id']
                },

                raw: true,
            };

            const data = await allocationToIndentorSeed.findOne(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                is_variety_submitted: 1,
            };

            const row = await allocationToIndentorSeed.update(dataToUpdate, condition);

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

    static cropWiseSubmission = async (req, res) => {
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

            const data = await allocationToIndentorSeed.findAll(condition);

            if (data && data.length > 0) {
                const result = await Promise.all(data.map(async element => {
                    const dataToUpdate = {
                        is_active: 1,
                    };

                    const row = await allocationToIndentorSeed.update(dataToUpdate, {
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

    static getVarietyDataForEdit = async (req, res) => {
        try {
            const formData = req.body.formData;
         let condition;
         const whereClause={}
         if(formData.variety_id){
            whereClause.variety_id=formData.variety_id
         }
         if(formData.variety_line){
            whereClause.variety_line_code=formData.variety_line
         }
             condition = {
                where: {
                    year: formData.year,
                    season: formData.season,
                    crop_code: formData.crop_code,
                    ...whereClause
                },
                include: [{
                    model: allocationToIndentorProductionCenterSeed,
                    left: true,
                },
                {
                    model: db.mVarietyLines,
                    attributes:['line_variety_name'],
                    left: true,
                },
            ],

                raw: true,
            };

            const data = await allocationToIndentorSeed.findAll(condition);
            console.log(data)

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const result = []
            if(formData.variety_line){
                data.forEach(element => {
                    if (result.length == 0) {
                        let object = {
                            id: element.id,
                            variety_id: element.variety_id,
                            variety_line_code: element.variety_line_code,
                            line_name:element['m_variety_line.line_variety_name'],
                            totalIndentQuantity: element.indentquantity,
                            productionQuantity: element.producedquantity,
                            indentor: [],
                            is_active: element.is_active,
                            is_variety_submitted: element.is_variety_submitted
                        }
    
                        let indentor = {
                            indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                            production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                            qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                        }
    
                        object.indentor.push(indentor);
                        result.push(object)
                    } else {
                        const index = result.findIndex(x => x.id == element.id);
    
                        if (index > -1) {
                            let indentor = {
                                indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                                production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                                qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                            }
                            result[index].indentor.push(indentor)
                        } else {
                            let object = {
                                id: element.id,
                                variety_id: element.variety_id,
                                variety_line_code: element.variety_line_code,
                                line_name:element['m_variety_line.line_variety_name'],
                                totalIndentQuantity: element.indentquantity,
                                productionQuantity: element.producedquantity,
                                is_active: element.is_active,
                                is_variety_submitted: element.is_variety_submitted,
                                indentor: []
                            }
    
                            let indentor = {
                                indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                                production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                                qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                            }
    
                            object.indentor.push(indentor);
                            result.push(object)
                        }
                    }
                });
            }else{
                data.forEach(element => {
                    if (result.length == 0) {
                        let object = {
                            id: element.id,
                            variety_id: element.variety_id,
                            variety_line_code: element.variety_line_code,
                            line_name:element['m_variety_line.line_variety_name'],
                            totalIndentQuantity: element.indentquantity,
                            productionQuantity: element.producedquantity,
                            indentor: [],
                            is_active: element.is_active,
                            is_variety_submitted: element.is_variety_submitted
                        }
    
                        let indentor = {
                            indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                            production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                            qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                        }
    
                        object.indentor.push(indentor);
                        result.push(object)
                    } else {
                        const index = result.findIndex(x => x.id == element.id);
    
                        if (index > -1) {
                            let indentor = {
                                indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                                production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                                qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                            }
                            result[index].indentor.push(indentor)
                        } else {
                            let object = {
                                id: element.id,
                                variety_id: element.variety_id,
                                variety_line_code: element.variety_line_code,
                                line_name:element['m_variety_line.line_variety_name'],
                                totalIndentQuantity: element.indentquantity,
                                productionQuantity: element.producedquantity,
                                is_active: element.is_active,
                                is_variety_submitted: element.is_variety_submitted,
                                indentor: []
                            }
    
                            let indentor = {
                                indentor_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.inden'],
                                production_center_id: element['allocation_to_indentor_for_lifting_seed_production_cnters.produ'],
                                qty: element['allocation_to_indentor_for_lifting_seed_production_cnters.qty'],
    
                            }
    
                            object.indentor.push(indentor);
                            result.push(object)
                        }
                    }
                });
            }
         

            result.forEach(element => {
                const tempIndentor = []
                element.indentor.forEach(indentor => {
                    if (tempIndentor.length == 0) {
                        const obj = {
                            indentor_id: indentor.indentor_id,
                            productions: []
                        }

                        const prod = {
                            production_center_id: indentor.production_center_id,
                            qty: indentor.qty
                        }

                        obj.productions.push(prod)

                        tempIndentor.push(obj)
                    } else {
                        const index = tempIndentor.findIndex(x => x.indentor_id == indentor.indentor_id)

                        if (index > -1) {
                            const prod = {
                                production_center_id: indentor.production_center_id,
                                qty: indentor.qty
                            }

                            tempIndentor[index].productions.push(prod)
                        } else {
                            const obj = {
                                indentor_id: indentor.indentor_id,
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

    static update = async (req, res) => {
        try {
            const formData = req.body;
            const dataToUpdate = {
                year: formData.year,
                is_active: formData.is_active,
                is_freeze: formData.is_freeze || 0,
                isdraft: formData.isdraft || 0,
                season: formData.season,
                variety_id: formData.variety_id,
                user_id: formData.user_id,
                crop_code: formData.crop_code,
                crop_group_code: formData.crop_group_code || "",
            };
            const condition = {
                where: {
                    id: formData.id
                }
            };

            const isExist = await allocationToIndentorSeed.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            console.log('isExist', isExist);

            const row = await allocationToIndentorSeed.update(dataToUpdate, condition);

            if (row.length) {
                console.log('row', row);
                const productionCenters = await Promise.all(formData.indentors && formData.indentors.map(async indentor => {
                    let productionCenterData = {
                        indent_of_breeder_id: indentor.indentor_id,
                        allocated_quantity: indentor.allocated_quantity,
                        quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                    };
                    console.log('indentor', indentor);
                    await allocationToIndentorProductionCenterSeed.destroy({
                        where: {
                            allocation_to_indentor_for_lifting_seed_id: formData.id
                        },
                    });
                    const isUpdate = await Promise.all(indentor.productions && indentor.productions.map(async el => {
                        console.log('el', el);
                        productionCenterData.qty = el.qty;
                        productionCenterData.allocation_to_indentor_for_lifting_seed_id = formData.id;
                        productionCenterData.production_center_id = el.productionCenter.id
                        console.log('productionCenterData', productionCenterData);

                        const row = await allocationToIndentorProductionCenterSeed.create(productionCenterData);
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
            const year = req.body.year;
            const season = req.body.season;
            const crop_code = req.body.crop.crop_code

            const condition = {
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code
                }
            };
            const isExist = await allocationToIndentorSeed.findAll(condition);

            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }


            isExist.forEach(async element => {
                await allocationToIndentorProductionCenterSeed.destroy({
                    where: {
                        allocation_to_indentor_for_lifting_seed_id: element.id
                    }
                });
            });

            const data = await allocationToIndentorSeed.destroy(condition);

            return response(res, status.DATA_AVAILABLE, 200);
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

            const data = await allocationToIndentorSeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.year')), 'year'],
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
            const data = await allocationToIndentorSeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.season')), 'season'],
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

            const data = await allocationToIndentorSeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_group_code')), 'crop_group_code']
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

            const data = await allocationToIndentorSeed.findAll({

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

            const data = await allocationToIndentorSeed.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'variety_id'],
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

    static indenterAllocationData1 = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropCode = req.query.cropCode;
            const cropVariety = req.query.cropVariety;

            let indentors = await indenterModel.findAll({
                attributes: ['id', 'indent_quantity', 'user_id', 'unit'],
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,
                },
                where: {
                    year,
                    season,
                    crop_code: cropCode,
                    variety_id: cropVariety
                },
                raw: true,
                nest: true,
            });

            if (!indentors) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // console.log('>>>>>>>>>>>>>>>', indentors);
            indentors.map(el => {
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            const bsp1Data = await Promise.all(indentors.map(async el => {
                return await bsp1Model.findOne({
                    attributes: ['id'],
                    include: {
                        attributes: ['id'],
                        model: bsp2Model,
                        left: true,
                        include: {
                            attributes: ['id'],
                            model: bsp3Model,
                            left: true,
                            include: {
                                model: bsp4Model,
                                left: true,
                            }
                        }
                    },
                    where: {
                        crop_code: cropCode,
                        year,
                        season,
                        // crop_group_code: cropGroup,
                        variety_id: cropVariety,
                        indent_of_breederseed_id: el.id
                    },
                    raw: true,
                    nest: true,
                });
            }));
            console.log('bsp1Data', bsp1Data);

            if (!bsp1Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const productionCentersObj = await Promise.all(bsp1Data.map(async el => await indentorHelper.productionCenters(el.id)));
            console.log('productionCentersObj', JSON.stringify(productionCentersObj));

            if (!productionCentersObj) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const totalIndentQuantity = bsp3Helper.sumOfAllElements(indentors, 'indent_quantity');
            // const totalAllocationQuantity = bsp3Helper.sumOfAllElements(productionCentersObj, 'quantityOfSeedProduced');
            let productionCenters = [];
            productionCentersObj.forEach(el => {
                if (el.productionCenters.length === 1) {
                    productionCenters.push(el.productionCenters[0]);
                } else {
                    el.productionCenters.forEach(element => {
                        productionCenters.push(element)
                    });
                }
            });
            // let generatedLabels = [];
            let totalLots = [];
            let weight = 0;

            const uniqueData = Array.from(productionCenters.reduce((map, item) => {
                const key = item.production_center_id + item.user.name;
                if (!map.has(key)) {
                    map.set(key, item);
                }
                return map;
            }, new Map()).values());

            const lablesProduced = await Promise.all(uniqueData.map(async el => {
                // const labelNumbers = await indentorHelper.labelNumbers(cropCode, year, season, cropVariety, el.production_center_id);
                const lot = await this.lotNumber(parseInt(year), cropCode, cropVariety, el.production_center_id);
                // console.log('lot>>>>>', lot);
                // const filterEl = lot.filter(el => el !== undefined)
                // if (filterEl.length) {
                //     totalLots.push(filterEl);
                // }
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

            // console.log('????', totalLots);
            const totalAllocationQuantity = totalLots.reduce((acc, curr) => acc + curr, 0);
            // console.log('????', totalAllocationQuantity);
            // console.log('????', uniqueData);
            return response(res, status.DATA_AVAILABLE, 200, {
                indentors,
                productionCenters: uniqueData,
                totalIndentQuantity,
                totalAllocationQuantity
            });
        }
        catch (error) {
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

            const { year, season, crop_code } = formData;
            const isAgricuture = crop_code && crop_code.slice(0, 1).toUpperCase();
            let condition = {
                attributes: ['id', 'user_id', 'indent_quantity', 'variety_id', 'variety_notification_year'],
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
                    crop_code

                },
                raw: true,
                nest: true,
            };

            const data = await indenterModel.findAll(condition);
            let getIndentor = bsp3Helper.removeDuplicates(data, 'user_id');
            getIndentor = getIndentor.map(el => el.user_id);

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

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            data.forEach(el => {
                uniqueVariety.push({ variety_code: el.m_crop_variety.variety_code });
                const varietyIndex = filteredData.findIndex(item => item.variety_code === el.m_crop_variety.variety_code);
                console.log('varietyIndex', varietyIndex);

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
                    console.log('filteredData', filteredData[varietyIndex]);
                    filteredData[varietyIndex].indenter.push({
                        "id": el.user_id,
                        "name": el.user.name,
                        "full_name": el.user.agency_detail.agency_name
                    });
                    filteredData[varietyIndex].indent_quantity.push({
                        "indent_quantity": el.indent_quantity
                    });
                }
            });

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

            console.log('filteredData1', JSON.stringify(filteredData1));

            const filteredData2 = filteredData1.map(el => {
                const { indenter, indent_quantity } = el;
                console.log('indenter', indenter);
                // Create a mapping of indenter indices and names
                const nameMap = indenter.map((obj, index) => ({ index, name: obj.name }));
                console.log('nameMap', nameMap);
                // Sort the nameMap based on the "name" property
                nameMap.sort((a, b) => a.name.localeCompare(b.name));

                // Reorder indenter and indent_quantity based on the sorted nameMap
                const sortedArray1 = nameMap.map(({ index }) => indenter[index]);
                const sortedArray2 = nameMap.map(({ index }) => indent_quantity[index]);
                el.indenter = sortedArray1;
                el.indent_quantity = sortedArray2;
                return el;
            });


            const updatedData = await Promise.all(filteredData2.map(async item => {
                let bspcAllocation = [];
                let totalAllocation = [];
                let totalIndentQuantity = 0;
                item.indent_quantity.forEach(quan => totalIndentQuantity += quan.indent_quantity);

                // const productionCenterAll = await allocationToIndentorSeed.findAll({
                //     attributes: ['id', 'year', 'season', 'crop_code', 'variety_id'],
                //     include: {
                //         attributes: ['id', 'qty', 'production_center_id'],
                //         model: allocationToIndentorProductionCenterSeed,
                //         as: 'alloc',
                //         left: true,
                //         where: {
                //             indent_of_breeder_id: getIndentor,
                //         },
                //         include: {
                //             attributes: ['id', 'name'],
                //             model: userModel,
                //             left: true,
                //         }
                //     },
                //     where: {
                //         crop_code,
                //         "variety_id": item.variety_id,
                //         season,
                //         year,
                //     },
                //     raw: true,
                //     nest: true,
                // });

                const productionCenterAll = await db.sequelize.query(`
                SELECT "allocation_to_indentor_for_lifting_seeds"."id",
                       "allocation_to_indentor_for_lifting_seeds"."year",
                       "allocation_to_indentor_for_lifting_seeds"."season",
                       "allocation_to_indentor_for_lifting_seeds"."crop_code",
                       "allocation_to_indentor_for_lifting_seeds"."variety_id",
                       "alloc"."id" AS "alloc.id",
                       "alloc"."qty" AS "alloc.qty",
                       "alloc"."production_center_id" AS "alloc.production_center_id",
                       "alloc->user"."id" AS "alloc.user.id",
                       "alloc->user"."name" AS "alloc.user.name"
                FROM "allocation_to_indentor_for_lifting_seeds" AS "allocation_to_indentor_for_lifting_seeds"
                INNER JOIN "allocation_to_indentor_for_lifting_seed_production_cnters" AS "alloc"
                    ON "allocation_to_indentor_for_lifting_seeds"."id" = "alloc"."allocation_to_indentor_for_lifting_seed_id"
                    AND "alloc"."indent_of_breeder_id" IN (:getIndentor)
                LEFT OUTER JOIN "users" AS "alloc->user"
                    ON "alloc"."production_center_id" = "alloc->user"."id"
                WHERE "allocation_to_indentor_for_lifting_seeds"."crop_code" = :cropCode
                    AND "allocation_to_indentor_for_lifting_seeds"."variety_id" = :varietyId
                    AND "allocation_to_indentor_for_lifting_seeds"."season" = :season
                    AND "allocation_to_indentor_for_lifting_seeds"."year" = :year
            `, {
                    replacements: {
                        getIndentor: getIndentor,
                        cropCode: crop_code,
                        varietyId: item.variety_id,
                        season: season,
                        year: year
                    },
                    raw: true,
                    nest: true
                });

                console.log('productionCenterAll', productionCenterAll);
                let removeDuplicateProd = bsp3Helper.removeNestedDuplicates(productionCenterAll, 'alloc.production_center_id');
                // console.log('productionCenterAll', productionCenterAll);
                // removeDuplicateProd = removeDuplicateProd.map(el => el.allocation_to_spa_for_lifting_seed_production_cnters.production);
                console.log('removeDuplicateProd', removeDuplicateProd);

                const productionCenters = await Promise.all(item.indenter.map(async el => {
                    let productionCenter = await db.sequelize.query(`SELECT "allocation_to_indentor_for_lifting_seeds"."id", "allocation_to_indentor_for_lifting_seeds"."year", "allocation_to_indentor_for_lifting_seeds"."season", "allocation_to_indentor_for_lifting_seeds"."crop_code", "allocation_to_indentor_for_lifting_seeds"."variety_id", "alloc"."id" AS "alloc.id", "alloc"."qty" AS "alloc.qty", "alloc"."production_center_id" AS "alloc.production_center_id", "alloc->user"."id" AS "alloc.user.id", "alloc->user"."name" AS "alloc.user.name" FROM "allocation_to_indentor_for_lifting_seeds" AS "allocation_to_indentor_for_lifting_seeds" INNER JOIN "allocation_to_indentor_for_lifting_seed_production_cnters" AS "alloc" ON "allocation_to_indentor_for_lifting_seeds"."id" = "alloc"."allocation_to_indentor_for_lifting_seed_id" AND "alloc"."indent_of_breeder_id" = ${el.id} LEFT OUTER JOIN "users" AS "alloc->user" ON "alloc"."production_center_id" = "alloc->user"."id" WHERE "allocation_to_indentor_for_lifting_seeds"."crop_code" = '${crop_code}' AND "allocation_to_indentor_for_lifting_seeds"."variety_id" = ${item.variety_id} AND "allocation_to_indentor_for_lifting_seeds"."season" = '${season}' AND "allocation_to_indentor_for_lifting_seeds"."year" = '${year}'`, {
                        raw: true,
                        nest: true,
                    });
                    // await allocationToIndentorSeed.findAll({
                    //     attributes: ['id', 'year', 'season', 'crop_code', 'variety_id'],
                    //     include: {
                    //         attributes: ['id', 'qty', 'production_center_id'],
                    //         model: allocationToIndentorProductionCenterSeed,
                    //         as: 'alloc',
                    //         left: true,
                    //         where: {
                    //             indent_of_breeder_id: el.id,
                    //         },
                    //         include: {
                    //             attributes: ['id', 'name'],
                    //             model: userModel,
                    //             left: true,
                    //         }
                    //     },
                    //     where: {
                    //         crop_code,
                    //         "variety_id": item.variety_id,
                    //         season,
                    //         year,
                    //     },
                    //     raw: true,
                    //     nest: true,
                    // });

                    let sumOfQuantity = 0;
                    // console.log('productionCenter', productionCenter);

                    if (productionCenter.length !== item.indenter.length) {
                        // console.log('productionCenter less', productionCenter);
                        // console.log('SPA less', el.spa_code);
                        productionCenter = removeDuplicateProd.map(i => {
                            const res = productionCenter.find(el => el.alloc.production_center_id === i.alloc.production_center_id);
                            console.log('i.alloc.user', i.alloc.user);
                            if (res === undefined) {
                                return {
                                    year: i.year,
                                    season: i.season,
                                    crop_code: i.crop_code,
                                    variety_id: i.variety_id,
                                    alloc: {
                                        qty: 0,
                                        production_center_id: i.alloc.production_center_id,
                                        user: i.alloc.user
                                    }
                                }

                            } else {
                                return res
                            }
                        });
                    }
                    console.log('productionCenter', productionCenter);


                    for (const center of productionCenter) {
                        const allocation = center.alloc;
                        sumOfQuantity += allocation.qty;
                    }
                    totalAllocation.push({ "total_allocation": sumOfQuantity })
                    await productionCenter.forEach(element => {
                        // console.log('element', element);
                        const indentorProductionCentersIndex = bspcAllocation.findIndex(items => items.bspc_id === element.alloc.production_center_id && items.variety_id === item.variety_id);
                        if (indentorProductionCentersIndex === -1) {
                            console.log('indentorProductionCentersIndex', indentorProductionCentersIndex);
                            bspcAllocation.push({
                                "indentor_id": el.id,
                                "variety_id": item.variety_id,
                                "bspc_id": element.alloc.production_center_id,
                                "quantity": [element.alloc.qty],
                                //          "total_quantity": element?.alloc?.production_center_id,
                                "total_quantity": sumOfQuantity,
                                "bspc_name": element.alloc?.user?.name,
                                "bspc_produced": 0,
                            });
                        } else {
                            console.log('indentorProductionCentersIndex else', indentorProductionCentersIndex);
                            bspcAllocation[indentorProductionCentersIndex].quantity.push(element.alloc.qty);
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
                console.log('totalBspcProduced', totalBspcProduced);
                deficit.surplus_dificit = (totalBspcProduced - totalAllocation.total_allocation).toFixed(2);
            });
            // const sortedData = bsp3Helper.sortArray(updatedData);
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

            // const reportData = updatedData.map(el => {
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
            // });

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

    static indenterAllocationData = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const { season, cropCode, cropVariety, userId } = req.query;
            // req.body.loginedUserid.agency_id = 17
            console.log("req.query;", userId, req.query)
            const agencyDetail = await agencyDetailModel.findOne({
                attributes: ['id', 'state_id'],
                where: {
                    // id: req.body.loginedUserid.agency_id
                    id: 5
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
                attributes: ['id', 'indent_quantity', 'user_id', 'unit', 'spa_code', 'variety_code', 'state_code'],
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
                    }
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
            console.log('SPA1111111', SPA);
            if (!SPA) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            SPA.map(el => {
                el.user.name = el.user.agency_detail.agency_name;
                el.allocated_quantity = 0;
                el.quantity_left_for_allocation = 0;
                return el;
            });
            console.log('SPA2222222', SPA);

            // const allocationToIndentor = await allocationToIndentorSeed.findAll({
            //     include: {
            //         attributes: ['id', 'allocated_quantity', 'qty', 'quantity_left_for_allocation', 'production_center_id', 'indent_of_breeder_id'],
            //         model: allocationToIndentorProductionCenterSeed,
            //         left: true,
            //         where: {
            //             indent_of_breeder_id: userId,
            //         }
            //     },
            //     where: {
            //         year,
            //         season,
            //         crop_code: cropCode,
            //         variety_id: cropVariety,
            //     },
            //     raw: true,
            //     nest: true,
            // });

            const allocationToIndentor = await allocationToSPASeed.findAll({
                attributes: ['id', 'year', 'season', 'crop_code',],
                include: {
                    attributes: ['id', 'allocation_to_spa_for_lifting_seed_id', 'qty'],
                    model: allocationToSPAProductionCenterSeed,
                    left: true,
                    // include: {
                    //     attributes: ['id', 'allocation_to_spa_for_lifting_seed_id', 'qty'],
                    //     model: allocationToSPAProductionCenterSeed,
                    //     left: true,
                    //     where: {
                    //         state_code: agencyDetail.state_id
                    //     }
                    // },
                    where: {
                        state_code: agencyDetail.state_id
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

            console.log('allocationToIndentor', allocationToIndentor);

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
                console.log('el', el);
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
            // console.log('productionCenters', productionCenters);
            const totalIndentQuantity = bsp3Helper.sumOfAllElements(SPA, 'indent_quantity');
            // const totalAllocationQuantity = bsp3Helper.sumOfAllElements(productionCenters, 'alloc');
            let totalLots = [];
            let weight = 0;
            let uniqueProduction = [];
            let productions = [];
            const uniqueData = productionCenters.filter(el => {
                const isExist = uniqueProduction.includes(el.produ);
                // console.log('isExist', isExist);
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
                // console.log('lot>>>>>', lot);
                // const filterEl = lot.filter(el => el !== undefined)
                // if (filterEl.length) {
                //     totalLots.push(filterEl);
                // }
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
            console.log('totalAllocationQuantity', totalAllocationQuantity);
            console.log('totalAllocationQuantity', totalAllocationQuantity);
            uniqueDataProduction
            return response(res, status.DATA_AVAILABLE, 200, {
                indentors: SPA,
                productionCenters: uniqueDataProduction,
                totalIndentQuantity: sum,
                totalAllocationQuantity
            });
        }
        catch (error) {
            console.log("error", error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static breederLineData = async (req, res) => {
        try {
            const formData = req.body;
            const { year, season, crop_code, variety_id } = req.body
 
            const varietyData = await db.allocationToIndentorSeed.findAll({
                where: {
                    is_variety_submitted: {
                        [Op.eq]: 1
                    },


                },
                attributes: [
                    'variety_id','variety_line_code',
                    [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
                    [sequelize.literal('m_crop_variety.variety_code'), 'value'],
                    // [sequelize.col('m_cropv')]
                ],
                include: [{
                    model: varietyModel,
                    attributes: []

                }],
                raw: true
            })
            let varietyLine=[]
            if(varietyData && varietyData.length>0){
                varietyData.forEach((el)=>{
                    varietyLine.push(el && el.variety_line_code ? el.variety_line_code:'')
                })
            }
            let data = await db.availabilityOfBreederSeedModel.findAll({
                include: [
                    {
                        model: db.mVarietyLines,
                        // required: true,
                        // where:{
                        //     variety_id
                        // },
                        attributes: []
                    },
                ],
                where: {
                    year,
                    season,
                    crop_code,
                    variety_code:variety_id,
                    [Op.and]: [
                        {
                            variety_line_code: {
                            [Op.ne]: null
                          }
            
                        },
                        {
                            variety_line_code: {
                            [Op.notIn]: varietyLine
                          }
                          
                        }
            
                      ]
                    
                    
                },
                attributes: [
                    // [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_brseed_line.variety_code_line')), 'variety_code_line'],
                    [sequelize.fn('DISTINCT', sequelize.col('availability_of_breeder_seed.variety_line_code')), 'display_text'],
                    [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
                    // [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line']
                ],
                raw: true
                // group:[
                //     // [sequelize.col('indent_of_brseed_line.id'), 'id'],
                //     [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line']
                // ]
            })

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
    static breederLineDataforEdit = async (req, res) => {
        try {
            const formData = req.body;
            const { year, season, crop_code, variety_id } = req.body
 
            const varietyData = await db.allocationToIndentorSeed.findAll({
                where: {
                    is_variety_submitted: {
                        [Op.eq]: 1
                    },
                    year,
                    season,
                    crop_code,
                    variety_id,
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
                        // {
                        //     variety_line_code: {
                        //         [Op.notIn]: dataline
                        //     },

                        // }

                    ],



                },
                attributes: [
                    // 'variety_id','variety_line_code',
                    [sequelize.literal('variety_line_code'), 'display_text'],
                    // [sequelize.literal('m_crop_variety.variety_code'), 'value'],
                    // [sequelize.col('m_cropv')]
                ],
                include: [{
                    model: varietyModel,
                    attributes: []

                }],
                raw: true
            })
            

            return response(res, status.DATA_AVAILABLE, 200, varietyData);
        }
        catch (error) {
            console.log(error, 'error')
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    // static breederLineDataforEdit = async (req, res) => {
    //     try {
    //         const formData = req.body;
    //         const { year, season, crop_code, variety_id } = req.body
 
    //         const varietyData = await db.allocationToIndentorSeed.findAll({
    //             where: {
    //                 // is_variety_submitted: {
    //                 //     [Op.eq]: 1
    //                 // },
    //                 year,
    //                 season,
    //                 crop_code,
    //                 // variety_id


    //             },
    //             attributes: [
    //                 // 'variety_id','variety_line_code',
    //                 [sequelize.literal('variety_line_code'), 'display_text'],
    //                 // [sequelize.literal('m_crop_variety.variety_code'), 'value'],
    //                 // [sequelize.col('m_cropv')]
    //             ],
    //             include: [{
    //                 model: varietyModel,
    //                 attributes: []

    //             }],
    //             raw: true
    //         })
            

    //         return response(res, status.DATA_AVAILABLE, 200, varietyData);
    //     }
    //     catch (error) {
    //         console.log(error, 'error')
    //         const returnResponse = {
    //             message: error.message,
    //         };
    //         return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    //     }
    // }
};

module.exports = AllocationToIndentor;

