const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, generatedLabelNumberModel, cropModel, bsp1Model, bsp2Model, bsp4Model, bsp3Model, userModel, bsp5aModel, indenterModel, bsp5bModel, lotNumberModel, labelNumberForBreederseed, seedTestingReportsModel, varietyModel, bsp1ProductionCenterModel, seasonModel, allocationToIndentorProductionCenterSeed, allocationToIndentorSeed, generateBills, indentorBreederSeedModel } = require('../models');
const Sequelize = require('sequelize');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');
const indentorHelper = require('../_helpers/indentor');

class Bsp5bController {

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
                            attributes: ['id', 'agency_name'],
                        },
                        {
                            model: generateBills,
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
            const data = await plainUser.generate_bills.filter(element => {
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
            delete plainUser.bsp_5_as;
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
        const bsp5bData = await bsp5bModel.findAll(condition);
        if (!(bsp5bData && bsp5bData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueCrops = [];
        const crops = [];
        const uniqueYear = [];
        const years = [];
        const obj = {};
        const data = await bsp5bData.filter(element => {
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
        const bsp5bData = await bsp5bModel.findAll(condition);
        if (!(bsp5bData && bsp5bData.length)) {
            return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
        const uniqueVariety = [];
        const variety = [];
        const obj = {};
        const data = await bsp5bData.filter(element => {
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
                // attributes: ['id', 'crop_code', 'variety_id'],
                // include: [
                //     {
                //         model: bsp4Model,
                //         required: false,
                //         attributes: ['id', 'actual_seed_production', 'total_availability'],
                //         include: {
                //             model: bsp3Model,
                //             required: false,
                //             attributes: ['id'],
                //             include: {
                //                 model: bsp2Model,
                //                 required: false,
                //                 attributes: ['id'],
                //                 include: {
                //                     model: bsp1Model,
                //                     required: false,
                //                     attributes: ['id'],
                //                 },
                //             },
                //         },
                //     },
                //     {
                //         attributes: ['id', 'variety_name'],
                //         model: varietyModel,
                //         left: true,
                //     },
                //     {
                //         attributes: ['season'],
                //         model: seasonModel,
                //         left: true,
                //     }
                // ],
                include: [
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                        include: [
                            {
                                attributes: ['name'],
                                model: userModel,
                                left: true,
                            },
                            {
                                attributes: ['id'],
                                model: bsp1Model,
                                left: true,
                                include: {
                                    model: bsp1ProductionCenterModel,
                                    left: true,
                                },
                            },
                        ]
                    },
                    {
                        model: cropModel,
                        left: true,
                        attributes: ['id', 'crop_name'],
                    },
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['id', 'variety_name'],
                    },
                    {
                        model: seasonModel,
                        left: true,
                        attributes: ['id', 'season'],
                    }
                ],
                where: {
                    crop_code: cropName,
                    production_center_id: userId,
                    year: year,
                    season:season
                },
                nest: true,
                raw: true,
            };

            const varietyData = await generateBills.findAll(condition);
            
            if (!varietyData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const uniqueVariety = [];
            let varieties = [];
            let output = [];
            const updatedVariety = varietyData.forEach(function (item) {
                const found = uniqueVariety.includes(item.variety_id);
                if (!found) {
                    uniqueVariety.push(item.variety_id);
                    varieties.push(item);
                } else {
                    const variety = varieties.filter((el, index) => {
                        if (el.variety_id === item.variety_id) {
                            el.available_quantity = Number(el.available_quantity, 10) + Number(item.available_quantity, 10);
                            el.total_quantity = Number(el.total_quantity, 10) + Number(item.total_quantity, 10);
                            el.lot_id = el.lot_id.concat(",", item.lot_id);
                            el.lot_id = [...new Set(el.lot_id.split(","))].join(",");
                            el.label_number = el.label_number.concat(", ", item.label_number);
                            el.label_number = [...new Set(el.label_number.split(", "))].join(", ");
                            varieties[index] = el;
                        }
                        return true;
                    });
                }
            });
           
            let totalLots = [];
            let weight = 0;
            const varietyRows = await Promise.all(varieties.map(async data => {
                const generatetolalLifting  = await this.generateBillsbsp5(parseInt(year), cropName, data.variety_id,userId)
                const indentors = await this.indentors(parseInt(year), cropName, data.variety_id);
                const label = await this.lotNumber(data.year, data.crop_code, data.variety_id, data.production_center_id);
                const labelNumbers = await indentorHelper.labelNumbers(data.crop_code, data.year, data.season, data.variety_id, data.production_center_id);
                
                const removeduplicatelifting=bsp3Helper.removeDuplicates(generatetolalLifting,'id')
               
                // const sum = await Promise.all(labelNumbers.map(async labelNumber => {
                //     const labelGenerated = await indentorHelper.generatedLabelNumbers(labelNumber.id);
                //     console.log('labelGenerated', labelGenerated);
                //     return bsp3Helper.sumOfAllElements(labelGenerated, 'weight');
                // }));
                const weights = label.filter(el => el !== undefined).reduce((total, obj) => total + parseInt(obj.lot_number_size), 0);
                weight += Number(weights, 10);

                const productionCenter = await allocationToIndentorProductionCenterSeed.findAll({
                    // attributes: ['id', 'quantity', 'breeder_seed_quantity_left', 'allocation_to_indentor_for_lifting_seed_id', 'production_center_id'],
                    where: {
                        production_center_id: userId,
                    },
                    raw: true,
                    nest: true
                });

                // const qty = 
                // let allocationProducedData;
                // const allocationToIndentorResponse = await Promise.all(productionCenter.map(async (element) => {
                //     const allocationToIndentorSeedData = await allocationToIndentorSeed.findOne({
                //         where: {
                //             id: element.allocation_to_indentor_for_lifting_seed_id,
                //             crop_code: data.crop_code,
                //             variety_id: data.variety_id,
                //         },
                //         raw: true,
                //     });
                //     if (allocationToIndentorSeedData && element.allocation_to_indentor_for_lifting_seed_id === allocationToIndentorSeedData.id) {
                //         allocationProducedData = productionCenter.filter(element => allocationToIndentorSeedData.id === element.allocation_to_indentor_for_lifting_seed_id);
                //     }
                //     return true;
                // }));

                // const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                //     return prevVal + Number(currVal.quantity_of_seed_produced, 10)
                // }, 0);
                // console.log('allocationProducedData', allocationProducedData);
                // data.quantity_of_seed_produced = allocationProducedData[0].qty;
                data.indentors = indentors;
                data.generatetolalLifting= removeduplicatelifting;
                data.actual_seed_production = weight;
                data.quantity_of_seed_produced = data?.indent_of_breederseed?.bsp_1?.bsp1_production_centers?.quantity_of;
                data.lifting_quantity = data?.total_quantity;
                data.label = labelNumbers;
                delete data?.bsp_4;
                weight = 0;
                return data;
            }));

            return response(res, status.DATA_AVAILABLE, 200, varietyRows);
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
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,

                },
               

                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                raw: true,
                nest: true,
            });
            return indentorData.map(el => {
                return {
                    id: el.id,
                    indent_quantity: el.indent_quantity,
                    indent_agency: el.user.name
                    // totalQty: el.gen.name
                }
            })
        }
        catch (error) {
            console.log('error',error)
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }
    static generateBills = async (year, cropName, varietyId) => {
        try {
            const generabills = await generateBills.findAll({
                attributes: ['id', 'indent_of_breederseed_id','available_quantity','total_quantity'],
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,
                },
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                },
                include:{
                    model:indentorBreederSeedModel,
                },
                raw: true,
                nest: true,
            });
            let res= generabills.forEach(elem=>{
                console.log(elem.indent_of_breederseed,'elem')
            })

            return generabills.map(el => {
               
                return {
                    id: el.id,
                    indent_of_breederseed_id: el.indent_of_breederseed_id,
                    crop_code: el && el.indent_of_breederseed && el.indent_of_breederseed.crop_code ? el.indent_of_breederseed.crop_code :'',
                    variety_name: el && el.indent_of_breederseed && el.indent_of_breederseed.variety_name ? el.indent_of_breederseed.variety_name :'',
                    variety_id: el && el.indent_of_breederseed && el.indent_of_breederseed.variety_id ? el.indent_of_breederseed.variety_id :'',
                    // total_quantitys: Number(el.total_quantity, 10) + Number(item.total_quantity, 10),
                    total_quantity: parseFloat(el.total_quantity)
                }
            })
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }
    static generateBillsbsp5 = async (year, cropName, varietyId,user_id) => {
        try {
            const generabills = await generateBills.findAll({
                attributes: ['id', 'indent_of_breederseed_id','available_quantity','total_quantity'],
                include: {
                    attributes: ['name'],
                    model: userModel,
                    left: true,
                },
                where: {
                    year,
                    crop_code: cropName,
                    variety_id: varietyId,
                    user_id:user_id,
                },
                include:{
                    model:indentorBreederSeedModel,
                },
                raw: true,
                nest: true,
            });
            let res= generabills.forEach(elem=>{
                console.log(elem.indent_of_breederseed,'elem')
            })

            return generabills.map(el => {
               
                return {
                    id: el.id,
                    indent_of_breederseed_id: el.indent_of_breederseed_id,
                    crop_code: el && el.indent_of_breederseed && el.indent_of_breederseed.crop_code ? el.indent_of_breederseed.crop_code :'',
                    variety_name: el && el.indent_of_breederseed && el.indent_of_breederseed.variety_name ? el.indent_of_breederseed.variety_name :'',
                    variety_id: el && el.indent_of_breederseed && el.indent_of_breederseed.variety_id ? el.indent_of_breederseed.variety_id :'',
                    // total_quantitys: Number(el.total_quantity, 10) + Number(item.total_quantity, 10),
                    total_quantity: parseFloat(el.total_quantity)
                }
            })
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return error;
        }
    }

    static lotNumber = async (year, cropName, varietyId, userId) => {
        try {
            const lotNumber = await lotNumberModel.findAll({
                attributes: ['id', 'lot_number', 'variety_id', 'lot_number_size'],
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

    static labelNumber = async (req, res) => {
        try {
            const { lot_number, variety_id, user_id } = req.query;
            let newLabels = [];
            const labelNumbers = await generateBills.findAll({
                attributes: ['label_number'],
                where: {
                    variety_id,
                },
                raw: true,
            });
            const labelNumber = [];
            labelNumbers.forEach(el => {
                const labels = el.label_number.split(',');
                
                labels.forEach(el => {
                    labelNumber.push(el);
                });
            });
            const labels = await Promise.all(await lot_number.split(",").map(async data => {
                const labelForBreeder = await labelNumberForBreederseed.findAll({
                    where: {
                        lot_number_creation_id: data,
                        variety_id,
                        user_id
                    },
                    raw: true,
                });
                labelForBreeder.map(data1 => {
                    newLabels.push(data1);
                });
                return true;
            }));
            if (!labels[0]) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const getneratedLabels = await Promise.all(newLabels.map(async label => {
                let updatedLabels;
                let generatedLabelNumber = await generatedLabelNumberModel.findAll({
                    attributes: ['id', 'generated_label_name'],
                    where: {
                        label_number_for_breeder_seeds: label.id,
                    },
                    raw: true
                });
                if (!(generatedLabelNumber && generatedLabelNumber.length)) {
                    label.labels = [];
                }
                labelNumber.forEach(label => {
                    generatedLabelNumber = generatedLabelNumber.filter(el => el.id !== Number(label, 10));
                });
                label['labels'] = generatedLabelNumber;
                return label;
            }));

            return response(res, status.DATA_AVAILABLE, 200, getneratedLabels);
        } catch (error) {
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

            const rows = await bsp5bModel.findAndCountAll(dataToSend);
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
                        model: bsp5aModel,
                        left: true,
                        attributes: ['id'],
                        include:
                        {
                            model: bsp4Model,
                            left: true,
                            attributes: ['id', 'actual_seed_production', 'total_availability'],
                            include: {
                                model: bsp3Model,
                                left: true,
                                attributes: ['id'],
                                include: {
                                    model: bsp2Model,
                                    left: true,
                                    attributes: ['id'],
                                    include: {
                                        model: bsp1Model,
                                        left: true,
                                        attributes: ['id'],
                                    }
                                }
                            }
                        },
                    },
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                    },
                ],
                raw: true,
                nest: true,
            };
            const data = await bsp5bModel.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const label = await this.lotNumber(parseInt(data.year), data.crop_code, data.variety_id, data.user_id);
            data.label = label;
            data.actual_seed_production = data?.bsp_5_a?.bsp_4?.actual_seed_production;
            data.quantity_of_seed_produced = data?.bsp_5_a?.bsp_4?.bsp_3?.bsp_2?.bsp_1?.quantity_of_seed_produced;
            data.label = label;
            delete data?.bsp_5_a;

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
                'data.*.bsp_5_a_id': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.indent_of_breederseed_id': 'required|integer',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.label_number': 'required|string',
                'data.*.lot_id"': 'required|string',
                'data.*.lifting_date': 'required|string',
                'data.*.lifting_quantity': 'required|string',
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
                    breeder_seed_balance: Number(data.breeder_seed_balance, 10),
                    bsp_5_a_id: data.bsp_5_a_id,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    indent_of_breederseed_id: data.indent_of_breederseed_id,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    label_number: data.label_number,
                    lot_id: data.lot_id,
                    lifting_date: data.lifting_date,
                    lifting_quantity: Number(data.lifting_quantity, 10),
                    production_center_id: data.production_center_id,
                    reason: data.reason,
                    unlifting_quantity: data.unlifting_quantity,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    year: Number(data.year, 10),
                    season: data.season
                };

                const isExist = await bsp5bModel.findOne({
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

                const row = await bsp5bModel.create(dataToInsert);
                if (row) {
                    await bsp5aModel.update({
                        is_freeze: 1,
                    }, {
                        where: {
                            id: data.bsp_5_a_id,
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
            formData.lifting_quantity = formData.lifting_quantity.toString();
            // const rules = {
            //     'bsp_5_a_id': 'required|integer',
            //     'crop_code': 'required|string',
            //     'id': 'required|integer',
            //     'indent_of_breederseed_id': 'required|integer',
            //     'is_active': 'required|integer',
            //     'isdraft': 'integer',
            //     'label_number': 'required|string',
            //     'lot_id': 'required|string',
            //     'lifting_date': 'required|string',
            //     'lifting_quantity': 'required|string',
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
            const isExist = await bsp5bModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                breeder_seed_balance: formData.breeder_seed_balance,
                bsp_5_a_id: formData.bsp_5_a_id,
                crop_code: formData.crop_code,
                indent_of_breederseed_id: formData.indent_of_breederseed_id,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                label_number: formData.label_number,
                lot_id: formData.lot_id,
                lifting_date: formData.lifting_date,
                lifting_quantity: formData.lifting_quantity,
                production_center_id: formData.production_center_id,
                reason: formData.reason,
                unlifting_quantity: formData.unlifting_quantity,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: formData.year,
                season: formData.season
            };
            const data = await bsp5bModel.update(dataToUpdate, condition);

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
            const isExist = await bsp5bModel.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await bsp5bModel.destroy(condition);

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
            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.year')), 'year'],
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
            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.season')), 'season'],
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

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.crop_code')), 'crop_code'],
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

    static getYearDataForBSP5bList = async (req, res) => {
        try {
            const user_id = req.query.user_id;
            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.year')), 'year'],
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

    static getSeasonDataForBSP5bList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const user_id = req.query.user_id;
            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.season')), 'season'],
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

    static getCropGroupDataForBSP5bList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;

            const data = await bsp5bModel.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('bsp_5_bs.crop_group_code')), 'crop_group_code']
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

    static getCropsDataForBSP5bList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const user_id = req.query.user_id

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.crop_code')), 'crop_code'],
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

    static getVarietiesDataForBSP5bList = async (req, res) => {
        try {
            const year = Number(req.query.year);
            const season = req.query.season;
            const cropGroup = req.query.cropGroup;
            const cropCode = req.query.cropCode;
            const user_id = req.query.user_id

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.variety_id')), 'variety_id'],
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

module.exports = Bsp5bController;