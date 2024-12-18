const moment = require('moment');
const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, generatedLabelNumberModel, cropModel, cropGroupModel, agencyDetailModelSecond, bsp1Model, bsp2Model, bsp4Model, bsp3Model, userModel, bsp5aModel, indenterModel, generateBills, lotNumberModel, labelNumberForBreederseed, seedTestingReportsModel, varietyModel, seasonModel, bsp1ProductionCenterModel, allocationToSPAProductionCenterSeed, allocationToSPASeed, indenterSPAModel, indentorBreederSeedModel, breederCropModel } = require('../models');
const pagination = require('../_helpers/bsp');
const Sequelize = require('sequelize');
const bsp3Helper = require('../_helpers/bsp3');
const { sumOfAllElements } = require('../_helpers/bsp3');
const Op = require('sequelize').Op;

class GenerateBillController {

    static getYear = async (req, res) => {
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
                            model: bsp4Model,
                            left: true,
                            attributes: ['id', 'crop_code', 'year'],
                        },
                    ],
                };
            }
            const userData = await userModel.findOne(condition);
            const plainUser = userData.get({ plain: true });
            const uniqueYear = [];
            const years = [];
            const data = await plainUser.bsp_4s.filter(element => {
                const year = uniqueYear.includes(element.year);
                if (!year) {
                    uniqueYear.push(element.year);
                    years.push({
                        name: element.year,
                        value: element.year
                    });
                }
                return false;
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            console.log('plainUser', plainUser);
            delete plainUser.bsp_4s;
            delete plainUser.agency_detail;
            plainUser['year'] = years;
            return response(res, status.DATA_AVAILABLE, 200, plainUser);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static fetchSeasonByCrop = async (req, res) => {
        try {
            const year = Number(req.query.year);
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
                    year: year
                },

                raw: true,
                nest: true,
            });

            response(res, status.DATA_AVAILABLE, 200, data);
        } catch (error) {
            console.log(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    }

    static getCropList = async (req, res) => {
        try {
            const { yearOfIndent: year, season } = req.query;
            const user = req.body.loginedUserid;

            const condition = {
                attributes: ['id', 'crop_code'],
                include: [{
                    attributes: ['id', 'crop_name'],
                    model: cropModel,
                    left: true,
                },
                {
                    model:bsp3Model,
                    attributes:[],
                    include:[
                        {
                            model:bsp2Model,
                            attributes:[],
                            distinct:true,
                            include:[
                                {
                                    model:bsp1Model,
                                    attributes:[],
                                    distinct:true,
                                    include:[
                                        {
                                            model:bsp1ProductionCenterModel,
                                            attributes:[],
                                            distinct:true,
                                            where:{
                                                production_center_id:user.id
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }],
                where: {
                    year,
                    season
                },
                raw: true,
                nest: true,
            };

            const bsp4Data = await bsp4Model.findAll(condition);

            if (!bsp4Data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const uniqueCrops = [];
            const crops = [];
            await bsp4Data.filter(element => {
                const isExist = uniqueCrops.includes(element.crop_code);
                if (!isExist) {
                    uniqueCrops.push(element.crop_code);
                    crops.push({
                        crop_code: element.crop_code,
                        'm_crop.id': element.m_crop.id,
                        'm_crop.crop_name': element.m_crop.crop_name
                    });
                }
                return false;
            });

            return response(res, status.DATA_AVAILABLE, 200, crops);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static varietyList = async (req, res) => {
        try{
            const { yearOfIndent: year, cropName, season } = req.query;
            const user = req.body.loginedUserid;
            let condition = {
                attributes: ['id', 'variety_id'],
                include: [
                    
                    {
                        model: varietyModel,
                        left: true,
                        attributes: ['variety_name'],
                    },
                    {
                        model:bsp3Model,
                        attributes:[],
                        include:[
                            {
                                model:bsp2Model,
                                attributes:[],
                                distinct:true,
                                include:[
                                    {
                                        model:bsp1Model,
                                        attributes:[],
                                        distinct:true,
                                        include:[
                                            {
                                                model:bsp1ProductionCenterModel,
                                                attributes:[],
                                                distinct:true,
                                                where:{
                                                    production_center_id:user.id
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    year,
                    crop_code: cropName,
                    season
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
            await bsp4Data.filter(element => {
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
            const varities = await labelNumberForBreederseed.findAll({
                // attributes: ['variety_id'],
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('label_number_for_breederseeds.variety_id')), 'variety_id'],
                ],
                where: {
                    crop_code: cropName
                },
                raw: true,
            });
            const uniqueVarieties = [];
            varities.forEach(element => {
                console.log('element', element);
                const index = variety.findIndex(el => el.value === element.variety_id);
                if (index !== -1) {
                    uniqueVarieties.push(variety[index]);
                }
            });
            console.log('variety', variety);
            obj['variety'] = uniqueVarieties;
            const breederData = await breederCropModel.findAll(
                {
                    attributes:['veriety_data'],
                   where:{
                       production_center_id: user.id,
                    
   
                   }
                }   
               )
               let data ={
                   ...obj,
                   breederData: breederData
   
               }
            return response(res, status.DATA_AVAILABLE, 200, data);
        }catch(error){
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 501, []);
        }
    }

    static getIndentors = async (req, res) => {
        try {
            const { yearOfIndent: year, cropName: crop_code, cropVariety: variety_id, season } = req.query;
            const condition = {
                attributes: ['id'],
                include: {
                    attributes: ['id', 'name'],
                    model: userModel,
                    left: true,
                },
                where: {
                    year,
                    crop_code,
                    season,
                    variety_id,
                },
                raw: true,
                nest: true,
            };

            const indentorData = await indenterModel.findAll(condition);

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            return response(res, status.DATA_AVAILABLE, 200, indentorData);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static breederProformaVariety = async (req, res) => {
        try {
            const { yearOfIndent: year, indentorId: indentorId,spaId, spaCode: spaCode, cropName: crop_code, cropVariety: variety_id, season, userId } = req.query;

            const indentor = await indentorBreederSeedModel.findOne({
                attributes: ['user_id'],
                where: {
                    id: indentorId,
                }
            });

            const isExist = await generateBills.findOne({
                attributes: ['id', 'available_quantity', 'lot_id'],
                order: [["updated_at", "DESC"]],
                where: {
                    year,
                    user_id: userId,
                    crop_code,
                    variety_id,
                },
                raw: true
            });

            const condition = {
                // attributes: ['id', 'crop_code', 'variety_id', 'year'],
                include: [
                    {
                        // attributes: [],
                        model: allocationToSPAProductionCenterSeed,
                        include:[
                            {
                                model:indenterSPAModel,
                                where:{
                                    id:req.query.spaId,
                                }

                            }
                        ],
                        left: true,
                        where:{
                            production_center_id:req.query.userId
                        }
                    },
                   
                ],
                where: {
                    user_id: indentor.user_id,
                    crop_code,
                    variety_id,
                    season,
                    year,
                }
                
            };

            let indentorData = await allocationToSPASeed.findOne(condition);
            
            indentorData = indentorData.get({ plain: true });

            if (!indentorData) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const uniqueSPA = [];
            const spaData = await Promise.all(indentorData.allocation_to_spa_for_lifting_seed_production_cnters.map((async el => {
                
                const isExist = uniqueSPA.includes(el.indent_of_);
                if (!isExist) {
                    uniqueSPA.push(el.indent_of_);
                    return await indenterSPAModel.findOne({
                        attributes: ['indent_quantity'],
                        where: {
                            spa_code: el.spa_code,
                          
                        },
                        raw: true
                    });
                }
                return false;
            })));
            let sum = 0;
            spaData.forEach(currVal => {
                if (currVal.hasOwnProperty('indent_quantity')) {
                    return sum += currVal.indent_quantity
                }
            }, 0);
         
            let labels = await this.lotNumber(parseInt(year), crop_code, indentorData.variety_id, userId);
            if (isExist) {
                const commonLabels = isExist?.lot_id?.split(',').map(el => {
                    const index = labels.findIndex(item => {
                        return item?.seed_testing_report?.lot_number === Number(el, 10)
                    });
                    if (index !== -1) {
                        return labels[index].id;
                    }
                });
                const lab = await this.totalLabelNumbers(commonLabels, variety_id, userId);
                lab.map(el => {
                    if (el.status === true) {
                        const index = labels.findIndex(item => item?.seed_testing_report?.lot_number === el.lot_id);
                        labels.splice(index, 1);
                    }
                });
            }
            const label = labels;
            const allocatedQuantity = sumOfAllElements(indentorData.allocation_to_spa_for_lifting_seed_production_cnters, 'allocated_');
            const availableQuantity = isExist ? Number(isExist.available_quantity, 10) : null;
            indentorData.allocated_quantity = allocatedQuantity % 1 === 0 ? allocatedQuantity : allocatedQuantity.toFixed(2);
            indentorData.indent_quantity = sum;
            indentorData.label = label;
            indentorData.available_quantity = availableQuantity === null ? null : availableQuantity.toFixed(2);

            return response(res, status.DATA_AVAILABLE, 200, indentorData);
        }
        catch (error) {
            console.log('error', error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static totalLabelNumbers = async (lot_number, variety_id, user_id) => {
        const labelNumber = [];
        const newLabels = [];
        const labelsGenerated = [];
        const labelNumbers = await Promise.all(lot_number.map(async el => {
            const billLabels = await generateBills.findAll({
                attributes: ['label_number'],
                where: {
                    lot_id: {
                        [Sequelize.Op.like]: `%${el}%`,
                    },
                    variety_id,
                    user_id
                },
                raw: true,
            });

            billLabels.forEach(el => {
                const bllLabel = el.label_number.split(',');
                bllLabel.forEach(el => {
                    labelNumber.push(Number(el, 10));
                });
            });

            const breederSeedLabels = await labelNumberForBreederseed.findAll({
                where: {
                    lot_number_creation_id: el,
                    variety_id,
                    user_id
                },
                raw: true,
            });

            if (!breederSeedLabels[0]) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            breederSeedLabels.map(data1 => {
                newLabels.push(data1);
            });

            await Promise.all(newLabels.map(async label => {
                const generatedLabels = await generatedLabelNumberModel.findAll({
                    attributes: ['id'],
                    where: {
                        label_number_for_breeder_seeds: label.id,
                    },
                    raw: true
                });
                generatedLabels.map(el => labelsGenerated.push(el.id));
            }));
            console.log('el', el);
            const isExist = bsp3Helper.checkArraysEquality(labelNumber, labelsGenerated);
            return {
                lot_id: el,
                status: isExist
            }
        }));

        return labelNumbers;
    }

    static lotNumber = async (year, cropName, varietyId, userId) => {
        try {
            const lotNumber = await lotNumberModel.findAll({
                attributes: ['id', 'lot_number'],
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
    static UserName = async (spaCode) => {
        try {
            const usrName = await userModel.findAll({
                attributes: ['id', 'name'],
                include: [{ model: agencyDetailModel }],
                where: {
                    spa_code: spaCode
                },
                raw: true,
                nest: true,
            });
            return usrName;
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
            const { lot_number, variety_id, user_id, bill_id } = req.query;
            let newLabels = [];
            const labelNumber = [];

            const labelNumbers = await Promise.all(lot_number.split(',').map(async el => {
                const labels = await generateBills.findAll({
                    attributes: ['label_number'],
                    where: {
                        lot_id: {
                            [Sequelize.Op.like]: `%${el}%`,
                        },
                        variety_id,
                        user_id
                    },
                    raw: true,
                });
                console.log('labels', labels);
                labels.forEach(el => {
                    const labels = el.label_number.split(',');
                    console.log('labels', labels);
                    labels.forEach(el => {
                        labelNumber.push(el);
                    });
                });
            }));

            // console.log('labelNumber', labelNumber);

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
                const generatedLabelNumber = await generatedLabelNumberModel.findAll({
                    attributes: ['id', 'generated_label_name','weight'],
                    where: {
                        label_number_for_breeder_seeds: label.id,
                    },
                    raw: true
                });
                let updatedLabelNumbers = generatedLabelNumber;
                if (!(generatedLabelNumber && generatedLabelNumber.length)) {
                    label.labels = [];
                }

                labelNumber.forEach(label => {
                    updatedLabelNumbers = updatedLabelNumbers.filter(el => el.id !== Number(label, 10));
                });

                if (bill_id != 'undefined') {
                    console.log(">>>>>>>>>>>>>>>")
                    const labelUpdated = await generateBills.findOne({
                        attributes: ['label_number'],
                        where: {
                            id: bill_id
                        },
                        raw: true,
                    });
                    console.log('generatedLabelNumber', generatedLabelNumber, updatedLabelNumbers)
                    let labelNumberIds = labelUpdated.label_number.split(",").map(Number)
                    const element = generatedLabelNumber.filter(p => labelNumberIds.includes(p.id));
                    console.log('element', element)
                    updatedLabelNumbers.push(element);
                    console.log('updatedLabelNumbers', updatedLabelNumbers)
                } else {
                    console.log('generatedLabelNumber', generatedLabelNumber)
                    // let labelNumberIds = labelNumber.map(Number);
                    const element = generatedLabelNumber.filter(p => labelNumber.includes(p.id));
                    console.log('element', element)
                    updatedLabelNumbers.push(element);
                    console.log('updatedLabelNumbers', updatedLabelNumbers)
                }

                label['labels'] = generatedLabelNumber;
                label['newLabels'] = updatedLabelNumbers.flat();
                label['newLabels'] = bsp3Helper.removeDuplicates(label.newLabels, 'generated_label_name');
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

            const rows = await generateBills.findAndCountAll(dataToSend);
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
                        model: indenterSPAModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                    }
                ],
                raw: true,
                nest: true,
            };
            const data = await generateBills.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const productionCenter = await bsp1ProductionCenterModel.findAll({
                attributes: ['quantity_of_seed_produced'],
                where: {
                    bsp_1_id: data.bsp_1_id,
                    production_center_id: data.user_id,
                }
            })
            const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                return prevVal + Number(currVal.quantity_of_seed_produced, 10)
            }, 0);
            data.quantity_of_seed_produced = quantityProduced;
            const label = await this.lotNumber(parseInt(data.year), data.crop_code, data.variety_id, data.user_id);
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

    static generateCertificate = async (req, res) => {
        try {
            const { id = "" } = req.params;
            const condition = {

                // attributes: ['id', 'crop_name', 'bill_number', 'date_of_bill']
                where: {
                    id,
                    user_id:req.body.loginedUserid.id
                },
                include: [
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                        include: [{
                            attributes: ['name'],
                            model: userModel,
                            left: true,
                        },
                        {
                            model: agencyDetailModel,
                        }]

                    },
                    {
                        model:indenterSPAModel,
                        left: true,
                        attributes: ['id', 'spa_code','user_id'],
                        include:[
                            {
                                model:userModel,
                                attributes: ['id','name'],

                            }
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
                    },
                    {
                        attributes: ['id'],
                        model: indenterModel,
                        left: true,
                        include: {
                            attributes: ['id'],
                            model: bsp1Model,
                            left: true,
                            include: {
                                attributes: ['id'],
                                model: bsp2Model,
                                left: true,
                                include: {
                                    attributes: ['id', 'date_of_inspection'],
                                    model: bsp3Model,
                                    left: true
                                },

                            },

                        },


                    },

                ],
                raw: true,
                nest: true,

            };
            const data = await generateBills.findOne(condition);
            // console.log('data', data.indent_of_breederseed.user);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const productionCenter = await bsp1ProductionCenterModel.findAll({
                attributes: ['quantity_of_seed_produced'],
                where: {
                    bsp_1_id: data.bsp_1_id,
                    production_center_id: data.user_id,
                }
            })
            const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                return prevVal + Number(currVal.quantity_of_seed_produced, 10)
            }, 0);
            data.quantity_of_seed_produced = quantityProduced;
            const label = await this.lotNumber(parseInt(data.year), data.crop_code, data.variety_id, data.user_id);
            const usrname = await this.UserName(data.spa_code);
            
           
            // const labels = label.map(el => el.id).join();
            // const labelNumbers = await bsp3Helper.labelNumber(labels, data.variety_id, data.user_id);
            const labelNumbers = await bsp3Helper.labelNumberName(data.label_number);
            console.log(labelNumbers,'labelNumberslabelNumbers')
            if(labelNumbers && labelNumbers.length>0){
                
            }
            let updatedLabelNumbers = labelNumbers.map(el => el.generated_label_name).join();
            console.log(updatedLabelNumbers,'updatedLabelNumbersupdatedLabelNumbers') 
          
            const dataToSend = {
                crop_code: data.crop_code,
                bill_number: data.bill_number,
                crop_name: data.m_crop.crop_name,
                date_of_bill: data.bill_date,
                date_of_inspection: data &&  data.indent_of_breederseed &&  data.indent_of_breederseed.bsp_1 &&  data.indent_of_breederseed.bsp_1.bsp_2 &&  data.indent_of_breederseed.bsp_1.bsp_2.bsp_3 && ( data.indent_of_breederseed.bsp_1.bsp_2.bsp_3.date_of_inspection) ?  this.convertDate(data.indent_of_breederseed.bsp_1.bsp_2.bsp_3.date_of_inspection):null,
                generation_date: data.created_at,
                indent_of_breederseed_name: data.indent_of_breederseed.user.name,
                label_numbers: updatedLabelNumbers ? updatedLabelNumbers : '',
                total_weight: data.total_quantity,
                year: data.year,
                year_of_production: data.year,
                season: data.m_season.season,
                variety_name: data.m_crop_variety.variety_name,
                spa_code: data.spa_code,
                SpaName: usrname && usrname[0] && usrname[0].name ? usrname[0].name : '',
                SpaName2: data && data.indent_of_spa && data.indent_of_spa.user && data.indent_of_spa.user.name ? data.indent_of_spa.user.name :'',
                spaFullName: usrname && usrname[0] && usrname[0].agency_detail && usrname[0].agency_detail.agency_name ? usrname[0].agency_detail.agency_name : ''

            };

            return response(res, status.DATA_AVAILABLE, 200, dataToSend);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static create = async (req, res) => {
        try {
            const formData = req.body;

            const rules = {
                'data.*.bsp_4_id': 'required|integer',
                'data.*.crop_code': 'required|string',
                'data.*.crop_group_code': 'required|string',
                'data.*.indent_of_breederseed_id': 'required|integer',
                'data.*.is_active': 'required|integer',
                'data.*.isdraft': 'required|integer',
                'data.*.label_number': 'required|string',
                'data.*.lot_id"': 'required|string',
                'data.*.bsp_1_id': 'required|string',
                'data.*.production_center_id': 'required|integer',
                'data.*.user_id': 'required|integer',
                'data.*.variety_id': 'required|integer',
                'data.*.year': 'required|integer',
                'data.*.season': 'required|string',
                'data.*.spa_code': 'required|string',
                'data.*.state_code': 'required|string',
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
          
      let returnData = true;
            const data = await Promise.all(formData.map(async (data) => {
                const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);
                const availableQuantity = Math.sign(data.available_quantity);
                const dataToInsert = {
                    amount: data.amount,
                    available_quantity: (data && data.available_quantity<=0?0 : data.available_quantity),
                    bill_date: data.bill_date,
                    bill_number: (data.bill_number ? data.bill_number : 1),
                    bsp_1_id: data.bsp_1_id,
                    bsp_4_id: data.bsp_4_id,
                    spa_code: data.spa_code,
                    state_code: data.state_code,
                    crop_code: data.crop_code,
                    crop_group_code: cropGroupCode,
                    indent_of_breederseed_id: data.indent_of_breederseed_id,
                    is_active: data.is_active,
                    isdraft: data.isdraft || 0,
                    label_number: data.label_number,
                    lot_id: data.lot_id,
                    production_center_id: data.production_center_id,
                    season: data.season,
                    total_quantity: data.total_quantity,
                    user_id: data.user_id,
                    variety_id: data.variety_id,
                    region: data.region.value,
                    region_name: data && data.region && data.region.name ? data.region.name : '',
                    year: Number(data.year, 10)
                };
                console.log(data.region.value, 'data.region.value,')

                const bspcName = await userModel.findOne({
                    attributes: [],
                    include: {
                        attributes: ['short_name'],
                        model: agencyDetailModel,
                        left: true,
                    },
                    where: {
                        id: data.user_id,
                    },
                    raw: true,
                    nest: true,
                });
                const isExist = await generateBills.findOne({
                    attributes: ['id', 'bill_number','total_quantity'],
                    where: {
                        year: data.year,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                    },
                    order: [["updated_at", "DESC"]],
                    raw: true,
                });
               
                
                const indenName = bspcName.agency_detail.short_name;
                let lastFiveChars = isExist && isExist.bill_number ? isExist.bill_number.substr(-5) : '';
                lastFiveChars++;
                lastFiveChars = `0000${lastFiveChars}`;
                console.log('lastFiveChars', lastFiveChars)
                const date = new Date();
                const d = moment(date);
                let month = 1 + d.month();
                const year = d.format("YYYY"); // 1
                month = month <= 9 ? '0' + month : month
                console.log('total_quantity',isExist,'total_quantity')
                if (isExist) {
                    let lastFiveChars = isExist.bill_number.split("/").pop();
                    lastFiveChars++;
                    let lastchar = lastFiveChars <= 9 ? '0000' + lastFiveChars : (lastFiveChars > 9) ? '000' + lastFiveChars : lastFiveChars > 99 ? '00' + lastFiveChars : lastFiveChars > 999 ? '0' + lastFiveChars : lastFiveChars

                    dataToInsert.bill_number = `${indenName}/${year}-${month}/${lastchar}`;
                } else {

                    dataToInsert.bill_number = `${indenName}/${year}-${month}/00001`;
                }

                dataToInsert.bill_date = moment(date).format('MM/DD/YYYY');
                let isExistgeraneratedbill = await generateBills.findAll({
                    attributes: ['id', 'bill_number','total_quantity'],
                    where: {
                        year: data.year,
                        user_id: data.user_id,
                        crop_code: data.crop_code,
                        variety_id: data.variety_id,
                        season:data.season,
                        indent_of_breederseed_id:data.indent_of_breederseed_id
    
    
                        // 
                        // crop_code: req.body.crop_code,
                        // variety_id: req.body.variety_id,
                        // indent_of_breederseed_id:req.body.indent_of_breederseed_id,
                        // season:req.body.season,
                        // year:req.body.year,
                        // user_id:req.body.user_id
                    },
                    order: [["updated_at", "DESC"]],
                    raw: true,
                });
                
                if(isExistgeraneratedbill && isExistgeraneratedbill.length>0){
                    let isExistgeraneratedbillArr =0;
                    isExistgeraneratedbill.forEach(element => {
                        isExistgeraneratedbillArr+=element.total_quantity
                    });
                    isExistgeraneratedbillArr=parseInt(isExistgeraneratedbillArr) + parseInt(data.total_quantity);
              
              if(parseInt(isExistgeraneratedbillArr)>= parseInt(data.allocated_qunatity)){
                returnData=false;
                        const returnResponse={
                            message:'Allocated Quantity less than Total Quantity'
                        }
                    }
                   
                }
                if(returnData){
                    const row = await generateBills.create(dataToInsert);
                    // return { id: row.id };    
    
                    return response(res, status.DATA_AVAILABLE, 200, data);
                }else{
                    return response(res, status.UNEXPECTED_ERROR, 401, 'Allocated Quantity less than Total Quantity');
                        
                }
            }));
           

           
            
          
        }
        catch (error) {
            console.log('err', error);
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
            const isExist = await generateBills.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                amount: formData.amount,
                available_quantity: formData.available_quantity,
                bill_date: formData.bill_date,
                // bill_number: formData.bill_number,
                bsp_1_id: formData.bsp_1_id,
                bsp_4_id: formData.bsp_4_id,
                crop_code: formData.crop_code,
                indent_of_breederseed_id: formData.indent_of_breederseed_id,
                is_active: formData.is_active,
                isdraft: formData.isdraft || 0,
                label_number: formData.label_number,
                lot_id: formData.lot_id,
                production_center_id: formData.production_center_id,
                season: formData.season,
                total_quantity: formData.total_quantity,
                user_id: formData.user_id,
                variety_id: formData.variety_id,
                year: Number(formData.year, 10)
            };
            const data = await generateBills.update(dataToUpdate, condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };

            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }


    static updateBillPaymentStatus = async (req, res) => {
        try {
            const formData = req.body.search;
            console.log('formDataformData', formData);
            const condition = {
                where: {
                    id: formData.bill_id
                }
            };
            const isExist = await generateBills.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                is_payment_completed: true
            };
            const data = await generateBills.update(dataToUpdate, condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };

            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static isCertificateGenerated = async (req, res) => {
        try {
            const formData = req.body;

            const condition = {
                where: {
                    id: formData.id
                }
            };
            const isExist = await generateBills.count(condition);
            const highestSerialNumber = await generateBills.max('serial_number')
            // const findData = await generateBills.findAll(
            //     {
            //         serial_number:highestSerialNumber
            //     }
            // )

            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const dataToUpdate = {
                is_certificate_generated: formData.isCertificateGenerated || true,
                serial_number: highestSerialNumber && highestSerialNumber == null || highestSerialNumber == ''
                    || highestSerialNumber == undefined ? 1 : (parseInt(highestSerialNumber) + 1)
            };
            const data = await generateBills.update(dataToUpdate, condition);
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error', error);
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
            const isExist = await generateBills.count(condition);
            if (!isExist) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }
            const data = await generateBills.destroy(condition);

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static getSerialNumber = async (req, res) => {
        try {
            const formData = req.body;

            const condition = {
                where: {
                    id: formData.id
                }
            };
            const data = await generateBills.findAll(condition)
            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log('error', error);
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    // API for List Data

    static getYearData = async (req, res) => {
        try {
            const user_id = req.query.user_id;

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.year')), 'year'],
                ],
                where: {
                    user_id
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

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.season')), 'season'],
                ],
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true
                },

                where: {
                    year,
                    user_id
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

            const data = await generateBills.findAll({

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.crop_group_code')), 'crop_group_code']
                ],

                // include: {
                //     attributes: [
                //         'group_code',
                //         [Sequelize.fn('DISTINCT', Sequelize.col('m_crops.group_code')), 'group_code']
                //     ],
                //     include: {
                //         attributes: [
                //             [Sequelize.fn('DISTINCT', Sequelize.col('m_crop_groups.group_name')), 'group_name']
                //         ],
                //         model: cropGroupModel,
                //         left: true,
                //     },
                //     model: cropModel,
                //     left: true,
                // },

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

    static getCropsData = async (req, res) => {
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
                },
                where: {
                    year,
                    season,
                    user_id,
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

    static getVarietiesData = async (req, res) => {
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
                    year,
                    season,
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

    static getSPA = async (req, res) => {
        try {
            const year = Number(req.query.yearOfIndent);
            const season = req.query.season;
            const cropCode = req.query.cropCode;
            const cropVariety = req.query.cropVariety;
            const indentorId = req.query.indentorId;
            const userId = req.query.user_id;

            const varietyCode = await varietyModel.findOne({
                where: {
                    id: cropVariety
                }
            });

            const indenter = await indenterModel.findOne({
                where: {
                    id: indentorId
                },
            });

            const data = await allocationToSPASeed.findAll({
                attributes: ['id'],
                include: {
                    // attributes: [ 'qty'],
                    model: allocationToSPAProductionCenterSeed,
                    // attributes:['qty'],
                    left: true,
                    // where: {
                    //     production_center_id: userId,
                    // }
                },
                where: {
                    crop_code: cropCode,
                    variety_id: cropVariety,
                    season,
                    year,
                    user_id: indenter.user_id,
                },
                raw: true,
                nest: true
            });

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            // const updatedData = data.get({ plain: true });

            let removeDuplicates;
            let uniqueIndentorDataMap = []
            data.forEach(el=>{
                uniqueIndentorDataMap.push( el.allocation_to_spa_for_lifting_seed_production_cnters)
                // el.allocation_to_spa_for_lifting_seed_production_cnters.forEach(item=>{
                //     console.log(item,'itemmmm')
                // })
        
            })
                      
             removeDuplicates = bsp3Helper.removeTwoDuplicates(uniqueIndentorDataMap,'spa_code','state_code')
//  console.log(removeDuplicates,'uniqueIndentorDataMap')
            

            const data1 = await Promise.all(uniqueIndentorDataMap.map((async el => {
                console.log('el', el.spa_code);
                return await indenterSPAModel.findAll({
                    attributes: ['id', 'spa_code', 'state_code'],
                    where: {
                        spa_code: el.spa_code,
                        state_code: el.state_code
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: agencyDetailModel,
                        left: true,
                        attributes: ['agency_name','id'],
                        where: {
                            state_id: el.state_code
                        }
                    },
                });

            })));

        //    let removeDuplicatesSecond = bsp3Helper.removeTwoDuplicates(data1,'spa_code','state_code')

            // console.log('data1', data1);
            // const updatedDatas = dataValue.get({ plain: true });
            // console.log('updatedData', updatedDatas);
            return response(res, status.DATA_AVAILABLE, 200, data1);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static getSpaUserList = async (req, res) => {
        try {
            let condition = {

                include: [{
                    model: userModel,
                    include: [{ model: agencyDetailModel }],
                    where: {
                        spa_code: req.query.spacode
                    },
                    attributes: ['name']
                }]

            }







            let data = await generateBills.findOne(condition);


            if (data) {
                response(res, status.DATA_AVAILABLE, 200, data);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            console.log(error)
            return response(res, status.DATA_NOT_AVAILABLE, 500, error);
        }
    }

    static getSpaUserListSecond = async (req, res) => {
        try {
            let condition = {

                include: [{
                    model: userModel,
                    where: {
                        spa_code: req.query.spacode
                    },
                    attributes: ['name']
                }]
            }







            let data = await generateBills.findOne(condition);


            if (data) {
                response(res, status.DATA_AVAILABLE, 200, data);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            console.log(error)
            return response(res, status.DATA_NOT_AVAILABLE, 500, error);
        }
    }
    static getGenerateBillData = async (req, res) => {
        try {
            let condition = {
                where: {
                    crop_code: req.body.cropName,
                    variety_id: req.body.varietyId,
                    indent_of_breederseed_id:req.body.indentorId,
                    season:req.body.season,
                    year:req.body.yearValue,
                    user_id:req.body.user_id
                    // user_id: indenter.user_id,
                },
                // include: [{
                //     model: userModel,
                //     where: {
                //         spa_code: req.query.spacode
                //     },
                    attributes: ['total_quantity','available_quantity','variety_id']
                // }]
            }

            
            const indenter = await indenterModel.findOne({
                where: {
                    id: req.body.indentorId
                },
            });

            const allocationData = await allocationToSPASeed.findOne({
                // attributes: ['id'],
                include: {
                    // attributes: [ 'qty'],
                    model: allocationToSPAProductionCenterSeed,
                    include:[
                        {
                            model:indenterSPAModel,
                            where:{
                                id:req.body.spaId,
                            },
                         

                        },
                        
                    ],
                    // attributes:['qty'],
                    left: true,
                    // where: {
                    //     production_center_id: userId,
                    // }
                },
                where: {

                    
                    crop_code: req.body.cropName,
                    variety_id: req.body.varietyId,
                    // indent_of_breederseed_id:req.body.indentorId,
                    season:req.body.season,
                    user_id: indenter.user_id,
                },
                raw: false,
                nest: true
            });
            
            let newRemove =  bsp3Helper.removeDuplicates(allocationData.allocation_to_spa_for_lifting_seed_production_cnters, 'spa_code');
            
            
            const data1 = await Promise.all(newRemove.map((async el => {
                console.log('el', el);
                return await indenterSPAModel.findOne({
                    attributes: ['id', 'spa_code', 'state_code'],
                    where: {
                        spa_code: el.spa_code,
                        state_code: el.state_code,
                        id:req.body.spaId,
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: agencyDetailModel,
                        left: true,
                        attributes: ['agency_name','id'],
                        where: {
                            state_id: el.state_code
                        }
                    },
                });

            })));

            let data = await generateBills.findAll(condition);
            let responseData={
                data:data,
                allocationData:newRemove,
                data1:data1
            }
            // const updatedData = responseData.get({ plain: true });


            if (responseData) {
                response(res, status.DATA_AVAILABLE, 200, responseData);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            console.log(error)
            return response(res, status.DATA_NOT_AVAILABLE, 500, error);
        }
    }
   static convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
      }
      static generateCertificateSecond = async (req, res) => {
        try {
            const { id = "" } = req.params;
            const condition = {

                // attributes: ['id', 'crop_name', 'bill_number', 'date_of_bill']
                where: {
                    id,
                },
                include: [
                    {
                        model: indenterModel,
                        left: true,
                        attributes: ['id', 'indent_quantity'],
                        include: [{
                            attributes: ['name'],
                            model: userModel,
                            left: true,
                        },
                        {
                            model: agencyDetailModel,
                        }]

                    },
                    {
                        model:indenterSPAModel,
                        left: true,
                        attributes: ['id', 'spa_code','user_id'],
                        include:[
                            {
                                model:userModel,
                                attributes: ['id','name'],

                            }
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
                    },
                    {
                        attributes: ['id'],
                        model: indenterModel,
                        left: true,
                        include: {
                            attributes: ['id'],
                            model: bsp1Model,
                            left: true,
                            

                        },


                    },

                ],
                raw: true,
                nest: true,

            };
            const data = await generateBills.findOne(condition);
            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            const data2= await bsp2Model.findAll({
                include:[{
                    model:bsp3Model
                }],
                where:{
                    bsp_1_id:{
                        [Op.eq]:data.indent_of_breederseed.bsp_1.id
                    }
                }
            });
                        console.log(data.indent_of_breederseed.bsp_1.id,'indent_of_breederseed:')
           
            const productionCenter = await bsp1ProductionCenterModel.findAll({
                attributes: ['quantity_of_seed_produced'],
                where: {
                    bsp_1_id: data.bsp_1_id,
                    production_center_id: data.user_id,
                }
            })
            const quantityProduced = productionCenter.reduce((prevVal, currVal) => {
                return prevVal + Number(currVal.quantity_of_seed_produced, 10)
            }, 0);
            data.quantity_of_seed_produced = quantityProduced;
            const label = await this.lotNumber(parseInt(data.year), data.crop_code, data.variety_id, data.user_id);
            const usrname = await this.UserName(data.spa_code);
            
           
            // const labels = label.map(el => el.id).join();
            // const labelNumbers = await bsp3Helper.labelNumber(labels, data.variety_id, data.user_id);
            const labelNumbers = await bsp3Helper.labelNumberName(data.label_number);
            
            if(labelNumbers && labelNumbers.length>0){
                
            }
            let updatedLabelNumbers = labelNumbers.map(el => el.generated_label_name).join();
            
            const dataToSend = {
                crop_code: data.crop_code,
                bill_number: data.bill_number,
                crop_name: data.m_crop.crop_name,
                date_of_bill: data.bill_date,
                date_of_inspection: data &&  data.indent_of_breederseed &&  data.indent_of_breederseed.bsp_1 &&  data.indent_of_breederseed.bsp_1.bsp_2 &&  data.indent_of_breederseed.bsp_1.bsp_2.bsp_3 && ( data.indent_of_breederseed.bsp_1.bsp_2.bsp_3.date_of_inspection) ?  this.convertDate(data.indent_of_breederseed.bsp_1.bsp_2.bsp_3.date_of_inspection):null,
                generation_date: data.created_at,
                indent_of_breederseed_name: data.indent_of_breederseed.user.name,
                label_numbers: updatedLabelNumbers ? updatedLabelNumbers : '',
                total_weight: data.total_quantity,
                year: data.year,
                year_of_production: data.year,
                season: data.m_season.season,
                variety_name: data.m_crop_variety.variety_name,
                spa_code: data.spa_code,
                SpaName: usrname && usrname[0] && usrname[0].name ? usrname[0].name : '',
                SpaName2: data && data.indent_of_spa && data.indent_of_spa.user && data.indent_of_spa.user.name ? data.indent_of_spa.user.name :'',
                spaFullName: usrname && usrname[0] && usrname[0].agency_detail && usrname[0].agency_detail.agency_name ? usrname[0].agency_detail.agency_name : ''

            };

            return response(res, status.DATA_AVAILABLE, 200, dataToSend);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
}

module.exports = GenerateBillController;