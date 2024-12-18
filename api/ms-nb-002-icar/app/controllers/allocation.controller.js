require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const allocationBreederProdModel = db.allocationBreederProdModel;
const userModel = db.userModel;
const indentOfBreederseedModel = db.indentOfBreederseedModel;
const breederCropModel = db.breederCropModel;
const cropGroupModel = db.cropGroupModel;
const cropModel = db.cropModel;

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');


const Op = require('sequelize').Op;
class AllocationController {

    static allocationSeedProductionBreeder = async (req, res) => {
        try {
            let tabledAlteredSuccessfully = false;
            let tabledExtracted = false;
            if (req.body !== undefined
                && req.body.allocatedVarieties !== undefined
                && req.body.allocatedVarieties.length > 0) {
                tabledExtracted = true;
                for (let index = 0; index < req.body.allocatedVarieties.length; index++) {
                    const element = req.body.allocatedVarieties[index];
                    const dataRow = {
                        breeder_id: element.breeder_id,
                        available_nucleus_seed: element.available_nucleus_seed,
                        crop_code: element.crop_code,
                        variety_id: element.variety_id,
                        user_id: element.user_id,
                        year: element.year,
                        is_active: 1,
                        allocate_nucleus_seed: element.allocate_nucleus_seed,
                        agency_id: element.agency_id
                    };
                    if (element.id > 0) {
                        // update
                        await allocationBreederProdModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
                            tabledAlteredSuccessfully = true;
                        }).catch(function (err) {

                        });
                    }
                    else {
                        const newData = await allocationBreederProdModel.build(dataRow);
                        await newData.save();
                        tabledAlteredSuccessfully = true;
                    }
                }
            }
            if (!tabledExtracted) {
                return response(res, status.REQUEST_DATA_MISSING, 204);
            }
            else {
                if (tabledAlteredSuccessfully) {
                    return response(res, status.DATA_SAVE, 200, {})
                } else {
                    return response(res, status.DATA_NOT_AVAILABLE, 404)
                }

            }
        }
        catch (error) {
            return response(res, status.UNEXPECTED_ERROR, 500)
        }
    }

    static allocationSeedProductionBreederList = async (req, res) => {
        try {
            let condition = {
                distinct: true,
                include: [
                    {
                        model: db.cropModel,
                        left: true,
                    },
                    {
                        model: db.varietyModel,
                        left: true,
                    },
                    {
                        model: db.agencyDetailModel,
                        required: true,
                    }
                ]
            }

            let { page, pageSize, search } = req.body;
            if (page === undefined) page = 1;
            if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

            if (page > 0 && pageSize > 0) {
                condition.limit = pageSize;
                condition.offset = (page * pageSize) - pageSize;
            }

            if (search) {
                condition.where = {};
                for (let index = 0; index < search.length; index++) {
                    const element = search[index];
                    if (element.columnNameInItemList.toLowerCase() == "year.value") {
                        condition.where["year"] = element.value;
                    }
                    if (element.columnNameInItemList.toLowerCase() == "crop.value") {
                        condition.where["crop_code"] = element.value;
                    }
                    if (element.columnNameInItemList.toLowerCase() == "crop_variety.id") {
                        condition.where["variety_id"] = element.value;
                    }
                    if (element.columnNameInItemList.toLowerCase() == "id") {
                        condition.where["id"] = element.value;
                    }
                }
            }

            condition.order = [['id', 'DESC']];
            let data = await allocationBreederProdModel.findAndCountAll(condition);

            if (data) {
                response(res, status.DATA_AVAILABLE, 200, data);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            return response(res, status.UNEXPECTED_ERROR, 500)
        }
    }

    static allocationSeedProductionBreederGroupedList = async (req, res) => {
        try {
            let condition = {
                group: [
                    sequelize.col('allocation_breederseed_prod_to_breeder.crop_code'),
                    sequelize.col('allocation_breederseed_prod_to_breeder.id'),
                    sequelize.col('allocation_breederseed_prod_to_breeder.allocate_nucleus_seed'),
                    sequelize.col("m_crop.id"),
                    sequelize.col("m_crop.crop_name"),
                    sequelize.col("m_crop_variety.id"),
                    sequelize.col("m_crop_variety.variety_name"),
                    // sequelize.col("user.id"),
                    // sequelize.col("user.name"),
                    "year"],
                attributes: ["crop_code", "year", "id", 'allocate_nucleus_seed'],
                distinct: true,
                include: [
                    {
                        attributes: ["id", "crop_name"],
                        model: db.cropModel,
                        left: true,
                    },
                    {
                        attributes: ["id", "variety_name"],
                        model: db.varietyModel,
                        left: true,
                    },
                    // {
                    //     attributes: ["id", "name"],
                    //     model:userModel,
                    //     left:true
                    // }
                ],
                where: {
                    "agency_id": {
                        [Op.gt]: 0
                    }
                }
            }

            let { page, pageSize, search } = req.body;
            if (page === undefined) page = 1;
            if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

            if (page > 0 && pageSize > 0) {
                condition.limit = pageSize;
                condition.offset = (page * pageSize) - pageSize;
            }


            if (req.body.search) {

                if (req.body.search.year_of_indent) {
                    condition.where.year = (req.body.search.year_of_indent);
                }
                if (req.body.search.year) {
                    condition.where.year = (req.body.search.year);
                }
                if (req.body.search.crop_name) {
                    condition.where.crop_code = (req.body.search.crop_name);
                }
            }

            // if (search) {
            //     for (let index = 0; index < search.length; index++) {
            //         const element = search[index];
            //         if (element.columnNameInItemList.toLowerCase() == "year.value") {
            //             condition.where["year"] = element.value;
            //         }
            //         if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            //             condition.where["crop_code"] = element.value;
            //         }
            //     }
            // }
            // condition.order =[['id','DESC']];
            condition.order = [['id', 'DESC']];
            let data = await allocationBreederProdModel.findAndCountAll(condition);

            if (data) {
                response(res, status.DATA_AVAILABLE, 200, data);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500)
        }
    }

    static deleteallocationSeedProductionBreeder = async (req, res) => {
        try {
            allocationBreederProdModel.destroy({
                where: {
                    id: req.params.id
                }
            });
            response(res, status.DATA_DELETED, 200, {});
        }
        catch (error) {
            return response(res, status.UNEXPECTED_ERROR, 500)
        }
    }

    static getData = async (req, res) => {
        let returnResponse = {};
        let condition = {};
        try {

            condition = {
                include: [
                    {
                        model: userModel,
                        left: true,
                        attributes: ['name', 'username', 'password']
                    }
                ],
                where: {
                    id: req.body.search.id
                }
            }

            let data = await agencyDetailModel.findAndCountAll(condition);
            if (data) {
                return response(res, status.DATA_AVAILABLE, 200, data)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 400)
            }
            return response(res, status.DATA_SAVE, 200, insertData)
        } catch (error) {
            returnResponse = {
                message: error.message
            };
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static test = async (req, res) => {
        try {
            response(res, "Api Working fine", 200, "Success")
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_SAVE, 500)
        }
    }
    static getcropNameData = async (req, res) => {
        let returnResponse = {};
        let condition = {};
        try {

            condition = {
                include: [
                    {
                        // attributes: ["id", "crop_name"],
                        model: db.cropModel,
                        left: true,
                    },
                ],
                where: {
                    [Op.or]: [{ year: req.body.search.year }],
                    // [Op.and]: [{ 'm_crops.crop_name': req.body.search.max_lot_size }],
                    // is_active: 1
                }
            }

            let data = await allocationBreederProdModel.findAndCountAll(condition);
            if (data) {
                return response(res, status.DATA_AVAILABLE, 200, data)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 400)
            }
        } catch (error) {
            returnResponse = {
                message: error.message
            };
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static allocationSeedProductionBreederGroupedLists = async (req, res) => {
        try {
            let condition = {
                group: [
                    sequelize.col('allocation_breederseed_prod_to_breeder.crop_code'),
                    sequelize.col('allocation_breederseed_prod_to_breeder.id'),
                    sequelize.col("m_crop.id"),
                    sequelize.col("m_crop.crop_name"),
                    sequelize.col("m_crop_variety.id"),
                    sequelize.col("m_crop_variety.variety_name"),
                    "year"],
                attributes: ["crop_code", "year", "id"],
                distinct: true,
                include: [
                    {
                        attributes: ["id", "crop_name"],
                        model: db.cropModel,
                        left: true,
                    },
                    {
                        attributes: ["id", "variety_name"],
                        model: db.varietyModel,
                        left: true,
                    }
                ],
                where: {
                    "agency_id": {
                        [Op.gt]: 0
                    }
                }
            }

            let { page, pageSize, search } = req.body;
            if (page === undefined) page = 1;
            if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

            if (page > 0 && pageSize > 0) {
                condition.limit = pageSize;
                condition.offset = (page * pageSize) - pageSize;
            }

            if (req.body.search) {
                if (req.body.search.variety_id) {
                    condition.where.id = req.body.search.variety_id;
                }
            }
            // condition.order =[['id','DESC']];
            condition.order = [['year', 'DESC']];
            let data = await allocationBreederProdModel.findAndCountAll(condition);

            if (data) {
                response(res, status.DATA_AVAILABLE, 200, data);
            }
            else {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }
        }
        catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500)
        }
    }

    static updateIcarFreezeData = async (req, res) => {
        try {
            const id = [] = req.body.search.id;
            const data = await indentOfBreederseedModel.update({
                icar_freeze: 1
            }, {
                where: {
                    id: id
                }
            })
            if (data) {
                response(res, status.DATA_UPDATED, 200, data)
            }
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_SAVE, 500, error)
        }
    }
    static getCoOrdinationName = async (req, res) => {
        let condition = {};
        try {
            condition = {
                include: [
                    {
                        attributes: ["id", "name"],
                        model: db.userModel,
                        left: true,
                    },
                ],
                where: {
                    crop_code: req.body.search.crop_code
                }
            }

            let data = await breederCropModel.findAndCountAll(condition);
            if (data) {
                return response(res, status.DATA_AVAILABLE, 200, data)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 400)
            }
        } catch (error) {
            returnResponse = {
                message: error.message
            };
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static getCoOrdinationNameCropModel = async (req, res) => {
        let returnResponse = {};
        let condition = {};
        try {
            condition = {
                include: [
                    {
                        model: cropModel,
                        attributes: [],
                        where: {
                        },
                        include: [
                            {
                                attributes: [],
                                model: db.userModel,
                                required: true,
                                include:[
                                    {
                                        model:db.agencyDetailModel,
                                        attributes:[]
                                    }
                                ]
                            }
                        ]


                    }
                ],
                attributes: ['id',
                    [sequelize.col('m_crop.crop_name'),'crop_name'],
                    [sequelize.col('m_crop.crop_code'),'crop_code'],
                    [sequelize.col('m_crop->user->agency_detail.agency_name'),'name'],
                    [sequelize.col('m_crop->user.id'),'user_id'],
                    [sequelize.col('m_crop->user.agency_id'),'agency_id'],
                ],
                where: {
                    crop_code: req.body.search.crop_code
                },
                raw:true
            }

            let data = await indentOfBreederseedModel.findAndCountAll(condition);
            if (data) {
                return response(res, status.DATA_AVAILABLE, 200, data)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 400)
            }
        } catch (error) {
            returnResponse = {
                message: error.message
            };
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getIndenterDetails = async (req, res) => {
        let data = {};
        let condition = {};
        try {
            condition = {
                include: [
                    {
                        model: cropGroupModel,
                        attributes: ['id', 'group_code', 'group_name'],
                        left: true
                    },
                ],
                where: {
                    [Op.or]: [
                        {
                            group_code: {
                                [Op.like]: req.body.search.group_code + "%",
                            }
                        },
                        // {
                        //     is_freeze: {
                        //         [Op.gt]: 0,
                        //     }

                        // }
                    ]
                },
                //   where: {
                //     group_code:{
                //         [Op.like]: req.body.search.group_code + "%",


                //     },
                //     is_freeze:{
                //         [Op.gt]: 0,

                //     }
                //     // user_id:req.body.search.user_id,
                //   }
            };
            const sortOrder = req.body.sort ? req.body.sort : 'year';
            const sortDirection = req.body.order ? req.body.order : 'DESC';
            condition.order = [[sortOrder, sortDirection]];
            if (req.body.search) {
                if (req.body.search.year) {
                    condition.where.year = req.body.search.year;
                }
                if (req.body.search.season) {
                    condition.where.season = req.body.search.season;
                }
                if (req.body.search.group_code) {
                    condition.where.crop_code = {
                        [Op.like]: req.body.search.group_code + "%"
                    };
                }
                if (req.body.search.type) {
                    if (req.body.search.type == "nodal") {
                        condition.where.is_freeze = 1;
                    }
                } else {
                    condition.where = {
                        is_freeze: {
                            [Op.gt]: 0,
                        }
                    }
                }

            }
            data = await indentOfBreederseedModel.findAll(condition);
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }

    static getIndenterCropName = async (req, res) => {
        let data = {};
        let condition = {};
        try {
            condition = {
                include: [
                    {
                        model: cropModel,
                        // attributes: ['id', 'crop_code', 'crop_name'],
                        attributes: [],
                        left: true,
                        where: {
                            crop_code: {
                                [Op.not]: null
                            }
                        },
                    },
                ],
                where: {
                    // group_code: req.body.search.group_code
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
                    [sequelize.col('m_crop.id'), 'id'],
                    [sequelize.col('m_crop.crop_name'), 'crop_name'],
                ],
                raw: true,

            };
            const sortOrder = req.body.sort ? req.body.sort : 'year';
            const sortDirection = req.body.order ? req.body.order : 'DESC';
            condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
            if (req.body.search) {
                if (req.body.search.year) {
                    condition.where.year = req.body.search.year;
                }
                if (req.body.search.season) {
                    condition.where.season = req.body.search.season;
                }
                if (req.body.search.crop_code) {
                    condition.where.crop_code = req.body.search.crop_code;
                }

                if (req.body.search.group_code) {
                    condition.where.group_code = req.body.search.group_code
                }

                if (req.body.search.type) {
                    if (req.body.search.type == "nodal") {
                        if (req.body.search.is_freeze || req.body.search.is_freeze == 1) {
                            condition.where.is_freeze = 1
                            condition.where.icar_freeze = 0
                        }
                        if (req.body.search.crop_type) {
                            condition.where.crop_code = {
                                [Op.like]: req.body.search.crop_type + "%"
                            }
                        }
                    }
                }
            }
            data = await indentOfBreederseedModel.findAll(condition);
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }
    static getIndenterCropGroup = async (req, res) => {
        let data = {};
        let condition = {};
        try {
            condition = {
                include: [
                    {
                        model: cropModel,
                        include: [{ model: cropGroupModel }],
                        attributes: ['id', 'crop_code', 'crop_name'],
                        left: true
                    },
                ],
                where: {
                    group_code: req.body.search.group_code
                },
                attributes: [
                    //   [sequelize.fn('DISTINCT', sequelize.col('crop_code')), 'crop_code'],
                ],
                //    raw:true,

            };
            const sortOrder = req.body.sort ? req.body.sort : 'year';
            const sortDirection = req.body.order ? req.body.order : 'DESC';
            condition.order = [[sortOrder, sortDirection]];
            if (req.body.search) {
                // if (req.body.search.year) {
                //     condition.where.year = req.body.search.year;
                // }
                // // if (req.body.search.season) {
                // //     console.log(req.body.search.season,'req.body.search.season')
                // //     condition.where.season = req.body.search.season;
                // // }
                // if (req.body.search.crop_code) {
                //     condition.where.crop_code = req.body.search.crop_code;
                // }
            }
            data = await indentOfBreederseedModel.findAll(condition);
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }

}
module.exports = AllocationController