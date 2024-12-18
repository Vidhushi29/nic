// const Validator = require('validatorjs');
// const response = require('../_helpers/response');
// const Sequelize = require('sequelize');
// const status = require('../_helpers/status.conf');
// const { agencyDetailModel, cropModel, bsp1Model, bsp2Model, bsp4Model, bsp3Model, userModel, indenterModel, varietyModel, allocationToIndentor, allocationToIndentorProductionCenter, bsp1ProductionCenterModel } = require('../models');
// const pagination = require('../_helpers/bsp');

// class AllocationToIndentor {

//     static yearAndCropList = async (req, res) => {
//         let condition = {
//             attributes: ['id', 'year', 'crop_code'],
//             include: {
//                 model: cropModel,
//                 left: true,
//                 attributes: ['crop_name'],
//             },
//             raw: true,
//             nest: true,
//         };
//         const allocationData = await allocationToIndentor.findAll(condition);
//         if (!(allocationData && allocationData.length)) {
//             return response(res, status.DATA_NOT_AVAILABLE, 404);
//         }
//         const uniqueCrops = [];
//         const crops = [];
//         const uniqueYear = [];
//         const years = [];
//         const obj = {};
//         const daltcationa = await allocationData.filter(element => {
//             const cropCode = uniqueCrops.includes(element.crop_code);
//             const year = uniqueYear.includes(element.year);
//             if (!cropCode) {
//                 uniqueCrops.push(element.crop_code);
//                 crops.push({
//                     value: element.crop_code,
//                     name: element.m_crop.crop_name
//                 });
//             }
//             if (!year) {
//                 uniqueYear.push(element.year);
//                 years.push({
//                     name: element.year,
//                     value: element.year
//                 });
//             }
//             return false;
//         });
//         obj['years'] = years;
//         obj['crops'] = crops;

//         return response(res, status.DATA_AVAILABLE, 200, obj);

//     }

//     static varietyList = async (req, res) => {
//         const { yearOfIndent: year, cropName } = req.query;
//         let condition = {
//             attributes: ['id', 'variety_id'],
//             include: {
//                 model: varietyModel,
//                 left: true,
//                 attributes: ['variety_name'],
//             },
//             where: {
//                 year: year,
//                 crop_code: cropName,
//             },
//             raw: true,
//             nest: true,
//         };
//         const allocationVarietyData = await allocationToIndentor.findAll(condition);
//         if (!(allocationVarietyData && allocationVarietyData.length)) {
//             return response(res, status.DATA_NOT_AVAILABLE, 404);
//         }
//         const uniqueVariety = [];
//         const variety = [];
//         const obj = {};
//         const data = await allocationVarietyData.filter(element => {
//             const varieties = uniqueVariety.includes(element.variety_id);
//             if (!varieties) {
//                 uniqueVariety.push(element.variety_id);
//                 variety.push({
//                     value: element.variety_id,
//                     name: element.m_crop_variety.variety_name
//                 });
//             }
//             return false;
//         });
//         obj['variety'] = variety;
//         return response(res, status.DATA_AVAILABLE, 200, obj);

//     }

//     static proforma = async (req, res) => {
//         try {
//             const { userId } = req.query;
//             let condition = {};
//             if (userId) {
//                 condition = {
//                     attributes: ['id', 'crop_code', 'year', 'variety_id', 'user_id'],
//                     include: [
//                         {
//                             model: cropModel,
//                             left: true,
//                             attributes: ['id', 'crop_name'],
//                         },
//                         {
//                             model: varietyModel,
//                             left: true,
//                             attributes: ['variety_name'],
//                         },
//                         {
//                             model: userModel,
//                             left: true,
//                             attributes: ['id', 'name'],
//                         },
//                     ],
//                     raw: true,
//                     nest: true,
//                 };
//             }
//             const indentorData = await indenterModel.findAll(condition);
//             console.log('indentorData', indentorData);
//             const uniqueCrops = [];
//             const crops = [];
//             const uniqueYear = [];
//             const years = [];
//             const uniqueVariety = [];
//             const varieties = [];
//             const uniqueUsers = [];
//             const user = [];

//             const data = await indentorData.filter(element => {
//                 const cropCode = uniqueCrops.includes(element.crop_code);
//                 const year = uniqueYear.includes(element.year);
//                 const variety = uniqueVariety.includes(element.variety_id);
//                 const users = uniqueUsers.includes(element.user_id);
//                 if (!cropCode) {
//                     uniqueCrops.push(element.crop_code);
//                     crops.push({
//                         value: element.crop_code,
//                         name: element.m_crop.crop_name
//                     });
//                 }
//                 if (!year) {
//                     uniqueYear.push(element.year);
//                     years.push({
//                         name: element.year,
//                         value: element.year
//                     });
//                 }
//                 if (!variety) {
//                     uniqueVariety.push(element.variety_id);
//                     varieties.push({
//                         value: element.variety_id,
//                         name: element.m_crop_variety.variety_name
//                     });
//                 }
//                 if (!users) {
//                     uniqueUsers.push(element.user_id);
//                     user.push({
//                         value: element.user_id,
//                         name: element.user.name
//                     });
//                 }
//                 delete element.crop_code;
//                 delete element.year;
//                 delete element.m_crop;
//                 delete element.m_crop_variety;
//                 delete element.user;
//                 delete element.variety_id;
//                 delete element.user_id;
//                 return element;
//             });

//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             data.splice(0, 0, { variety: varieties });
//             data.splice(0, 0, { crop_code: crops });
//             data.splice(0, 0, { year: years });
//             data.splice(0, 0, { user: user });

//             // delete plainUser;
//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static proformaVariety = async (req, res) => {
//         try {
//             const { yearOfIndent: year, cropName, varietyName, indentorId } = req.query;
//             const condition = {
//                 attributes: ['id', 'indent_quantity', 'variety_id', 'year', 'crop_code'],
//                 where: {
//                     crop_code: cropName,
//                     id: indentorId,
//                     variety_id: varietyName,
//                     year,
//                 },
//                 raw: true,
//             };
//             const varietyData = await indenterModel.findOne(condition);
//             const { variety_id: varietyId, year: indentYear, crop_code: cropCode } = varietyData;
//             if (!varietyData) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             const productionCenter = await this.productionCenterName({ indentYear, cropCode, varietyId });
//             varietyData.productionCenter = productionCenter;
//             return response(res, status.DATA_AVAILABLE, 200, varietyData);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static productionCenterName = async ({ indentYear, cropCode, varietyId }) => {
//         const productionCenter = await bsp1Model.findAll({
//             attributes: ['id'],
//             include: [
//                 // {
//                 //     attributes: ['id'],
//                 //     model: userModel,
//                 //     left: true,
//                 //     include: {
//                 //         attributes: ['id', 'agency_name'],
//                 //         model: agencyDetailModel,
//                 //         left: true
//                 //     }
//                 // },
//                 {
//                     attributes: ['id', 'bsp_1_id', 'production_center_id', 'quantity_of_seed_produced', 'members'],
//                     model: bsp1ProductionCenterModel,
//                     left: true,
//                 }
//             ],
//             where: {
//                 year: indentYear,
//                 crop_code: cropCode,
//                 variety_id: varietyId,
//             },
//             nest: true,
//             raw: true,
//         });

//         // const productionCenter = productionCenter1.get({ plain: true })
//         if (!productionCenter) {
//             throw new Error('No data found for lot');
//         }
//         console.log('productionCenter', productionCenter);
//         const data = await Promise.all(productionCenter.map(async data => {
//             const user = await userModel.findOne({
//                 attributes: ['id'],
//                 include: {
//                     attributes: ['id', 'agency_name'],
//                     model: agencyDetailModel,
//                     left: true,
//                 },
//                 where: {
//                     id: data.bsp1_production_centers.production_center_id
//                 },
//                 raw: true,
//                 nest: true,
//             });
//             console.log('users', user);
//             data.user = user;
//             // productionCenters.push(data);
//             data.actual_seed_production = data?.bsp_2?.bsp_3?.bsp_4?.actual_seed_production;
//             delete data?.bsp_2;
//             return data;
//         }));
//         return data;
//     };

//     static getProductionCenterDetails = async (req, res) => {
//         try {
//             const { yearOfIndent: year, cropName, varietyName, productionCenterId } = req.query;
//             const condition = {
//                 attributes: ['id', 'actual_seed_production'],
//                 where: {
//                     crop_code: cropName,
//                     production_center_id: productionCenterId,
//                     variety_id: varietyName,
//                     year,
//                 },
//                 raw: true,
//             };
//             const bsp4Data = await bsp4Model.findOne(condition);
//             if (!bsp4Data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             const user = await this.getAgency({ productionCenterId });
//             bsp4Data.user = user;
//             return response(res, status.DATA_AVAILABLE, 200, bsp4Data);
//         }
//         catch (error) {
//             console.log('error: ', error);
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getVarietyName = async (req, res) => {
//         try {
//             const { yearOfIndent: year, cropName } = req.query;
//             const condition = {
//                 // attributes: ['id', 'variety_id'],
//                 attributes: [
//                     [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
//                 ],
//                 include: [
//                     {
//                         model: varietyModel,
//                         left: true,
//                         attributes: ['variety_name'],
//                     },
//                 ],
//                 where: {
//                     crop_code: cropName,
//                     year,
//                 },
//                 raw: true,
//                 nest: true,
//             };
//             const varietyName = await indenterModel.findAll(condition);
//             if (!varietyName) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, varietyName);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getIndentors = async (req, res) => {
//         try {
//             const { yearOfIndent: year, cropName, varietyName } = req.query;
//             const condition = {
//                 attributes: ['id'],
//                 include: [
//                     {
//                         model: userModel,
//                         left: true,
//                         attributes: ['id', 'name'],
//                     },
//                 ],
//                 where: {
//                     crop_code: cropName,
//                     variety_id: varietyName,
//                     year,
//                 },
//                 raw: true,
//                 nest: true,
//             };
//             const indentors = await indenterModel.findAll(condition);
//             if (!indentors) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, indentors[1]);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getAgency = async ({ productionCenterId }) => {
//         const condition = {
//             attributes: ['id'],
//             include: {
//                 attributes: ['id', 'agency_name', 'contact_person_name', 'contact_person_designation', 'address'],
//                 model: agencyDetailModel,
//                 left: true,
//             },
//             where: {
//                 id: productionCenterId,
//             },
//             raw: true,
//             nest: true,
//         };
//         const userData = await userModel.findOne(condition);
//         if (!userData) {
//             throw new Error('Data not found');
//         }
//         return userData;
//     }

//     static fetch = async (req, res) => {
//         try {
//             let condition = {
//                 include: [
//                     {
//                         model: userModel,
//                         left: true,
//                         attributes: ['id'],
//                         include: [
//                             {
//                                 model: agencyDetailModel,
//                                 left: true,
//                                 attributes: ['id', 'agency_name'],
//                             },
//                         ],
//                     },
//                     {
//                         model: indenterModel,
//                         left: true,
//                         attributes: ['id', 'indent_quantity'],
//                     },
//                     {
//                         model: cropModel,
//                         left: true,
//                         attributes: ['crop_name'],
//                     },
//                     {
//                         model: varietyModel,
//                         left: true,
//                         attributes: ['variety_name'],
//                     }
//                 ],
//                 raw: true,
//                 nest: true,
//             };
//             const paginate = pagination({ formData: req.body });
//             const dataToSend = { ...condition, ...paginate };

//             const allocationToIndentorData = await allocationToIndentor.findAndCountAll(dataToSend);
//             const rows = await Promise.all(allocationToIndentorData.rows.map(async data => {
//                 const productionCenter = await allocationToIndentorProductionCenter.findAll({
//                     attributes: ['id', 'quantity'],
//                     where: {
//                         allocation_to_indentor_for_lifting_breederseed_id: data.id
//                     }
//                 });
//                 data.production_center = productionCenter;
//                 const quantity = productionCenter.reduce((prevVal, currVal) => {
//                     return prevVal + Number(currVal.quantity, 10)
//                 }, 0);
//                 data.quantity = quantity;
//                 return data;
//             }));
//             if (!rows) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             const data = { rows: rows, count: allocationToIndentorData.count };

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getYearOfIndentForIndentorLifting = async (req, res) => {
//         try {
//             let condition = {
//                 attributes: [
//                     [Sequelize.fn('DISTINCT', Sequelize.col('allocation_to_indentor_for_lifting_breederseed.year')), 'year'],
//                 ],

//             }
//             const data = await allocationToIndentor.findAll(condition);
//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         } catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getCropOfIndentorLiftingByYear = async (req, res) => {
//         try {
//             console.log(req.query.year)
//             let condition = {
//                 attributes: ['crop_code'],
//                 include: [
//                     {
//                         model: cropModel,
//                         left: true,
//                         attributes: ['crop_name'],
//                     }
//                 ],
//                 where: {
//                     year: req.query.year
//                 }

//             }
//             const data = await allocationToIndentor.findAll(condition);
//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         } catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getVarietyOfIndentorLiftingByYear = async (req, res) => {
//         try {
//             console.log(req.query.year)
//             let condition = {
//                 attributes: ['variety_id'],
//                 include: [
//                     {
//                         model: varietyModel,
//                         left: true,
//                         attributes: ['variety_name'],
//                     }
//                 ],
//                 where: {
//                     crop_code: req.query.crop_code
//                 }

//             }
//             const data = await allocationToIndentor.findAll(condition);
//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         } catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static getAllocationOfBreederSeedsToIndentorsLifting = async (req, res) => {
//         try {
//             let condition = {
//                 include: [
//                     {
//                         model: varietyModel,
//                         left: true,
//                         attributes: ['variety_name']
//                     },
//                     {
//                         model: indenterModel,
//                         left: true,
//                         attributes: ['indent_quantity', 'user_id'],
//                         include: {
//                             model: userModel,
//                             left: true,
//                             attributes: ['agency_id'],
//                             include: {
//                                 model: agencyDetailModel,
//                                 left: true,
//                                 attributes: ['agency_name']
//                             }
//                         }
//                     },
//                     {
//                         model: userModel,
//                         left: true,
//                         attributes: ['name']
//                     }
//                 ],
//             }
//             let { page, pageSize } = req.body;
//             if (page === undefined) page = 1;
//             if (pageSize === undefined) pageSize = 10;

//             if (page > 0 && pageSize > 0) {
//                 condition.limit = pageSize;
//                 condition.offset = (page * pageSize) - pageSize;
//             }

//             const sortOrder = req.body.sort ? req.body.sort : 'id';
//             const sortDirection = req.body.order ? req.body.order : 'DESC';

//             condition.order = [[sortOrder, sortDirection]];


//             const data = await allocationToIndentor.findAndCountAll(condition);
//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static filterAllocationOfBreederSeedsToIndentorsLifting = async (req, res) => {
//         try {
//             let { page, pageSize, search } = req.body;
//             let condition = {
//                 include: [
//                     {
//                         model: varietyModel,
//                         left: true,
//                         attributes: ['variety_name']
//                     },
//                     {
//                         model: indenterModel,
//                         left: true,
//                         attributes: ['indent_quantity', 'user_id'],
//                         include: {
//                             model: userModel,
//                             left: true,
//                             attributes: ['agency_id'],
//                             include: {
//                                 model: agencyDetailModel,
//                                 left: true,
//                                 attributes: ['agency_name']
//                             }
//                         }
//                     },
//                     {
//                         model: userModel,
//                         left: true,
//                         attributes: ['name']
//                     }
//                 ],
//                 where: {}
//             }

//             if (page === undefined) page = 1;
//             if (pageSize === undefined) pageSize = 10;

//             if (page > 0 && pageSize > 0) {
//                 condition.limit = pageSize;
//                 condition.offset = (page * pageSize) - pageSize;
//             }

//             const sortOrder = req.body.sort ? req.body.sort : 'id';
//             const sortDirection = req.body.order ? req.body.order : 'DESC';

//             condition.order = [[sortOrder, sortDirection]];

//             if (search.isSearch) {
//                 if (search.year) {
//                     condition.where['year'] = search.year
//                 }

//                 if (search.crop_code) {
//                     condition.where['crop_code'] = search.crop_code
//                 }

//                 if (search.variety_id) {
//                     condition.where['variety_id'] = search.variety_id
//                 }
//             }


//             const data = await allocationToIndentor.findAndCountAll(condition);
//             if (!data) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }


//     static getById = async (req, res) => {
//         try {
//             const { id = "" } = req.params;
//             const condition = {
//                 where: {
//                     id,
//                 },
//                 include: [
//                     {
//                         model: indenterModel,
//                         left: true,
//                         attributes: ['id', 'indent_quantity'],
//                         include: {
//                             model: bsp1Model,
//                             left: true,
//                             attributes: ['id'],
//                             include: {
//                                 model: bsp2Model,
//                                 left: true,
//                                 attributes: ['id'],
//                                 include: {
//                                     model: bsp3Model,
//                                     left: true,
//                                     attributes: ['id'],
//                                     include: {
//                                         model: bsp4Model,
//                                         left: true,
//                                         attributes: ['id', 'actual_seed_production'],
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 ],
//                 raw: true,
//                 nest: true
//             };
//             const allocationIndentors = await allocationToIndentor.findOne(condition);
//             if (!allocationIndentors) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }
//             const productionCenter = await allocationToIndentorProductionCenter.findAll({
//                 attributes: ['id', 'quantity', 'breeder_seed_quantity_left', 'allocation_to_indentor_for_lifting_breederseed_id', 'production_center_id'],
//                 where: {
//                     allocation_to_indentor_for_lifting_breederseed_id: allocationIndentors.id,
//                 },
//                 raw: true,
//                 nest: true
//             });
//             const user = await Promise.all(productionCenter.map(async (data) => {
//                 const users = await userModel.findOne({
//                     attributes: ['id'],
//                     include: {
//                         attributes: ['id', 'address', 'agency_name', 'contact_person_name', 'contact_person_designation'],
//                         model: agencyDetailModel,
//                         left: true,
//                     },
//                     where: {
//                         id: data.production_center_id
//                     },
//                     raw: true,
//                     nest: true,
//                 });
//                 const actualSeedProduction = await bsp4Model.findOne({
//                     attributes: ['actual_seed_production'],
//                     where: {
//                         crop_code: allocationIndentors.crop_code,
//                         production_center_id: data.production_center_id,
//                         variety_id: allocationIndentors.variety_id,
//                         year: allocationIndentors.year,
//                     },
//                 });
//                 data.actual_seed_production = actualSeedProduction?.actual_seed_production;
//                 data.user = users;
//                 return data;
//             }));
//             allocationIndentors.production_center_id = user;

//             return response(res, status.DATA_AVAILABLE, 200, allocationIndentors);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static create = async (req, res) => {
//         try {
//             const formData = req.body;

//             const rules = {
//                 'data.*.breeder_seed_quantity_left': 'required|integer',
//                 'data.*.crop_code': 'required|integer',
//                 'data.*.indent_of_breeder_id': 'required|integer',
//                 'data.*.is_active': 'required|integer',
//                 'data.*.isdraft': 'required|integer',
//                 'data.*.production_center_id': 'required|integer',
//                 'data.*.quantity': 'required|integer',
//                 'data.*.user_id': 'required|integer',
//                 'data.*.variety_id': 'required|integer',
//                 'data.*.year': 'required|integer'
//             };

//             const validation = new Validator(formData, rules);
//             const isValidData = validation.passes();

//             if (!isValidData) {
//                 const errorResponse = {};
//                 for (let key in rules) {
//                     const error = validation.errors.get(key);
//                     if (error.length) {
//                         errorResponse[key] = error;
//                     }
//                 }
//                 return response(res, status.BAD_REQUEST, 400, ((errorResponse && errorResponse.length) || isValidData));
//             }

//             const allocationData = await Promise.all(formData.map(async (data) => {
//                 console.log('da', data);
//                 const isExist = await allocationToIndentor.findOne({
//                     where: {
//                         year: data.year,
//                         user_id: data.user_id,
//                         crop_code: data.crop_code,
//                         variety_id: data.variety_id,
//                     }
//                 });

//                 if (isExist && Object.keys(isExist).length) {
//                     throw new Error(status.DATA_ALREADY_EXIST);
//                 }

//                 const cropGroupCode = await bsp3Helper.getGroupCode(data.crop_code);

//                 const dataToInsert = {
//                     breeder_seed_quantity_left: data.breeder_seed_quantity_left,
//                     crop_code: data.crop_code,
//                     crop_group_code: cropGroupCode,
//                     indent_of_breeder_id: data.indent_of_breeder_id,
//                     is_active: data.is_active,
//                     isdraft: data.isdraft || 0,
//                     user_id: data.user_id,
//                     variety_id: data.variety_id,
//                     year: data.year
//                 };
//                 const row = await allocationToIndentor.create(dataToInsert);
//                 if (row) {
//                     data.production_center_details.forEach(async productionCenter => {
//                         const dataToInsert = {
//                             allocation_to_indentor_for_lifting_breederseed_id: row.id, // 53
//                             quantity: productionCenter.quantity,
//                             breeder_seed_quantity_left: productionCenter.breeder_seed_quantity_left,
//                             production_center_id: productionCenter.production_center_id // 202
//                         };
//                         await allocationToIndentorProductionCenter.create(dataToInsert);
//                     });
//                 }
//                 return { id: row.id };
//             }));

//             return response(res, status.DATA_AVAILABLE, 200, allocationData);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static update = async (req, res) => {
//         try {
//             const formData = req.body;

//             const condition = {
//                 where: {
//                     id: formData.id
//                 }
//             };
//             const isExist = await allocationToIndentor.count(condition);
//             if (!isExist) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }

//             const dataToUpdate = {
//                 id: formData.id,
//                 breeder_seed_quantity_left: formData.breeder_seed_quantity_left,
//                 crop_code: formData.crop_code,
//                 indent_of_breeder_id: formData.indent_of_breeder_id,
//                 is_active: formData.is_active,
//                 isdraft: formData.isdraft || 0,
//                 production_center_id: formData.production_center_id,
//                 quantity: formData.quantity,
//                 user_id: formData.user_id,
//                 variety_id: formData.variety_id,
//                 year: formData.year
//             };
//             const data = await allocationToIndentor.update(dataToUpdate, condition);

//             if (data) {
//                 formData.production_center_details.forEach(async productionCenter => {
//                     const dataToInsert = {
//                         allocation_to_indentor_for_lifting_breederseed_id: formData.id,
//                         quantity: productionCenter.quantity,
//                         breeder_seed_quantity_left: productionCenter.breeder_seed_quantity_left,
//                         production_center_id: productionCenter.production_center_id
//                     };
//                     await allocationToIndentorProductionCenter.update(dataToInsert, {
//                         where: {
//                             id: productionCenter.id
//                         }
//                     });
//                 });
//             }

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }

//     static delete = async (req, res) => {
//         try {
//             const condition = {
//                 where: {
//                     id: req.params.id,
//                 }
//             };
//             const isExist = await allocationToIndentor.count(condition);
//             if (!isExist) {
//                 return response(res, status.DATA_NOT_AVAILABLE, 404);
//             }
//             const data = await allocationToIndentor.destroy(condition);

//             return response(res, status.DATA_AVAILABLE, 200, data);
//         }
//         catch (error) {
//             const returnResponse = {
//                 message: error.message,
//             };
//             return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
//         }
//     }
// };

// module.exports = AllocationToIndentor;