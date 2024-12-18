const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { indentorBreederSeedModel, cropModel, varietyModel, seasonModel, cropGroupModel, bsp1Model, bsp1ProductionCenterModel, userModel, labelNumberForBreederseed, allocationToIndentorProductionCenterSeed, lotNumberModel, agencyDetailModel, seedTestingReportsModel } = require('../models');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

class ProducedBreederSeedDetailsController {

    static getYearsData = async (req, res) => {
        try {
            const condition = {
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.year')), 'year'],
                ],
                order: [['year', 'DESC']]
            };
            const data = await indentorBreederSeedModel.findAll(condition);
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
            const year = req.body.year;

            const condition = {
                where: {
                    year: year
                },
                include: {
                    attributes: ['season'],
                    model: seasonModel,
                    left: true,
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.season')), 'season'],
                ],
                raw: true,
                order: [['season', 'ASC']]
            };
            const data = await indentorBreederSeedModel.findAll(condition);
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
            const { year, season, crop_type } = req.body;
            let cropType;
            if (crop_type) {
                cropType = {
                    crop_code: {
                        [Op.like]: crop_type + "%"
                    }
                }
            }
            const condition = {
                where: {
                    year: year,
                    season: season,
                    ...cropType
                },
                include: {
                    attributes: ['group_name'],
                    model: cropGroupModel,
                    left: true,
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.group_code')), 'group_code'],
                ],
                raw: true,
                order: [['group_code', 'DESC']]
            };
            const data = await indentorBreederSeedModel.findAll(condition);
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

    static getCropData = async (req, res) => {
        try {
            const { year, season, group_code } = req.body;

            const condition = {
                where: {
                    year: year,
                    season: season,
                    group_code: group_code
                },
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
                ],
                raw: true,
                order: [['crop_code', 'DESC']]
            };
            const data = await indentorBreederSeedModel.findAll(condition);
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

    static getCropDataForSeedReport = async (req, res) => {
        try {
            const { year, season, group_code } = req.body;

            const condition = {
                where: {
                    year: year,
                    season: season,
                },
                include: {
                    attributes: ['crop_name'],
                    model: cropModel,
                    left: true,
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
                ],
                raw: true,
                order: [['crop_code', 'DESC']]
            };
            const data = await indentorBreederSeedModel.findAll(condition);
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

    static getPageData = async (req, res) => {
        try {
            const { year, season, group_code, crop_code } = req.body;

            const condition = {
                where: {},
                attributes: [
                    'indent_quantity', 'year', 'season', 'crop_code', 'variety_id', 'group_code'
                ],
                include: [
                    {
                        attributes: ['variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                ],
                raw: true,
                order: [['variety_id', 'DESC']]
            }

            if (year) {
                condition['where']['year'] = year;
            }

            if (season) {
                condition['where']['season'] = season;
            }

            if (group_code) {
                condition['where']['group_code'] = group_code;
            }

            if (crop_code) {
                condition['where']['crop_code'] = crop_code;
            }

            const data = await indentorBreederSeedModel.findAll(condition);

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


    static getBSPData = async (req, res) => {
        try {
            const { year, season, crop_code, variety_id } = req.body;

            const condition = {
                attributes: ['id', 'year', 'season', 'crop_code', 'variety_id'],
                where: {
                    year: year,
                    season: season,
                    crop_code: crop_code,
                    variety_id: variety_id
                },
                include: {
                    attributes: ['quantity_of_seed_produced', 'production_center_id'],
                    model: bsp1ProductionCenterModel,
                    left: true,
                    include: {
                        attributes: ['name'],
                        model: userModel,
                        left: true,
                    }
                },
                raw: true,
                order: [['id', 'DESC']]
            }

            const data = await bsp1Model.findAll(condition);

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


    static getLabelNumberData = async (req, res) => {
        try {
            const year_of_indent = Number(req.body.year);
            const season = req.body.season;
            const crop_code = req.body.crop_code;
            const variety_id = req.body.variety_id;

            const data = await labelNumberForBreederseed.findAll({
                attributes: ['quantity'],
                where: {
                    year_of_indent: year_of_indent,
                    season: season,
                    crop_code: crop_code,
                    variety_id: variety_id
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

    static getIndentDataForSeedReport = async (req, res) => {
        try {
            const { year, season, crop_code } = req.body;

            const condition = {
                where: {},
                attributes: [
                    'indent_quantity', 'year', 'season', 'crop_code', 'variety_id'
                ],
                include: [
                    {
                        attributes: ['name'],
                        model: userModel,
                        left: true,
                    },
                ],
                raw: true,
                order: [['variety_id', 'DESC']]
            }

            if (year) {
                condition['where']['year'] = year;
            }

            if (season) {
                condition['where']['season'] = season;
            }

            if (crop_code) {
                condition['where']['crop_code'] = crop_code;
            }

            const data = await indentorBreederSeedModel.findAll(condition);

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

    static getPageDataForSeedReport = async (req, res) => {
        try {
            const { year, season, crop_code,crop_code1 } = req.body;

            const condition = {
                where: {},
                attributes: [
                    'id', 'year', 'season', 'crop_code', 'variety_id', 'indent_quantity', 'variety_notification_year'
                ],
                include: [
                    {
                        attributes: ['variety_name'],
                        model: varietyModel,
                        left: true,
                    },
                    {
                        attributes: ['name'],
                        model: userModel,
                        left: true,
                    },
                ],
                raw: true,
                order: [['variety_id', 'DESC']]
            }

            if (year) {
                condition['where']['year'] = year;
            }

            if (season) {
                condition['where']['season'] = season;
            }

            if (crop_code) {
                condition['where']['crop_code'] = crop_code;
            }
            if (crop_code1 && crop_code1 !== undefined && crop_code1.length > 0) {
                condition['where']['crop_code'] = {[Op.in]:crop_code1};
            }

            const data = await indentorBreederSeedModel.findAll(condition);

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


    static getAllAllocationToIndentorProductionCenterSeedData = async (req, res) => {
        try {
            const id = Number(req.query.id);
            console.log(id)

            const condition = {
                where: {
                    indent_of_breeder_id: id
                },
                attributes: ['allocated_quantity', 'production_center_id', 'qty'],
                include: [
                    {
                        attributes: ['name'],
                        model: userModel,
                        left: true,
                    }
                ],
                raw: true,
                order: [['production_center_id', 'DESC']]
            }

            const data = await allocationToIndentorProductionCenterSeed.findAll(condition);

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
    static getYearsDataSecond = async (req, res) => {
        try {
            let condition = {}
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {
                

                condition = {

                    include: [
                        {
                            model: cropModel,
                            where: {
                                //    breeder_id:req.body.user_id
                            },
                            attributes: []
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },

                    ],
                    where: {
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'A' + '%'
                        }
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
                    ],
                    raw: true,
                    order: [['year', 'DESC']]
                };
                
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'HICAR') {
                

                condition = {

                    include: [
                        {
                            model: cropModel,
                            where: {
                                //    breeder_id:req.body.user_id
                            },
                            attributes: []
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },

                    ],
                    where: {
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'H' + '%'
                        }
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
                    ],
                    raw: true,
                    order: [['year', 'DESC']]
                };
                
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'SD') {
                console.log('sd')
                condition = {

                    include: [
                        {
                            model: cropModel,
                            where: {
                                //    breeder_id:req.body.loginedUserid.id
                            },
                            attributes: []
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },

                    ],
                    where: {
                        forward_by_pdpc: 1,
                        forward_by_icar: 1
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
                    ],
                    raw: true,
                    order: [['year', 'DESC']]
                };
            }
            else {
                console.log('else')

                condition = {

                    include: [
                        {
                            model: cropModel,
                            where: {
                                breeder_id: req.body.loginedUserid.id
                            },
                            attributes: []
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },

                    ],
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
                    ],
                    raw: true,
                    order: [['year', 'DESC']]
                };
            }
            
        
            const data = await lotNumberModel.findAll(condition);
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
    static getSeasonDataproductionSecond = async (req, res) => {
        try {
            const year = req.body.year;
            let condition = {};
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {

                condition = {
                    where: {
                        year: year
                    },
                    include: [{
                        // attributes: ['season'],
                        model: seasonModel,
                        left: true,


                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true
                        }
                    },
                    ],
                    where: {
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'A' + '%'
                        }
                   },

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_season.season')), 'season'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_season.season'), 'ASC']]
                };
            }
            if (req.body && req.body.user_type && req.body.user_type == 'HICAR') {

                condition = {
                    where: {
                        year: year
                    },
                    include: [{
                        // attributes: ['season'],
                        model: seasonModel,
                        left: true,


                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true
                        }
                    },
                    ],
                    where: {
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'H' + '%'
                        }
                    },

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_season.season')), 'season'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_season.season'), 'ASC']]
                };
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'SD') {

                condition = {
                    where: {
                        year: year
                    },
                    include: [{
                        // attributes: ['season'],
                        model: seasonModel,
                        left: true,


                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true
                        }
                    },
                    ],
                    where: {
                        forward_by_pdpc: 1,
                        forward_by_icar: 1
                    },

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_season.season')), 'season'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_season.season'), 'ASC']]
                };
            }
            else {
                condition = {
                    where: {
                        year: year
                    },
                    include: [{
                        // attributes: ['season'],
                        model: seasonModel,
                        left: true,


                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true
                        }
                    },
                    ],

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_season.season')), 'season'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_season.season'), 'ASC']]
                };
            }

            const data = await lotNumberModel.findAll(condition);
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
    static getCropGroupDataProductionSecond = async (req, res) => {
        try {
            const { year, season } = req.body;
            let condition = {};
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {
                condition = {
                    where: {
                        year: year,
                        season: season,
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'A' + '%'
                        }

                    },
                    include: [{
                        attributes: [],
                        model: cropModel,
                        include: [
                            {
                                model: cropGroupModel,
                                attributes: ['group_name']
                            },

                        ],


                        left: true,
                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true,
                        }
                    },

                    ],

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop->m_crop_group.group_code'), 'ASC']]
                };
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'HICAR') {
                condition = {
                    where: {
                        year: year,
                        season: season,
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'H' + '%'
                        }

                    },
                    include: [{
                        attributes: [],
                        model: cropModel,
                        include: [
                            {
                                model: cropGroupModel,
                                attributes: ['group_name']
                            },

                        ],


                        left: true,
                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true,
                        }
                    },

                    ],

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop->m_crop_group.group_code'), 'ASC']]
                };
            }

            else if (req.body && req.body.user_type && req.body.user_type == 'SD') {
                condition = {
                    where: {
                        year: year,
                        season: season,
                        forward_by_pdpc: 1,
                        forward_by_icar: 1

                    },
                    include: [{
                        attributes: [],
                        model: cropModel,
                        include: [
                            {
                                model: cropGroupModel,
                                attributes: ['group_name']
                            },

                        ],


                        left: true,
                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true,
                        }
                    },

                    ],

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop->m_crop_group.group_code'), 'ASC']]
                };
            }
            else {
                condition = {
                    where: {
                        year: year,
                        season: season,

                    },
                    include: [{
                        attributes: [],
                        model: cropModel,
                        where:{
                            breeder_id:req.body.loginedUserid.id
                        },
                        include: [
                            {
                                model: cropGroupModel,
                                attributes: ['group_name']
                            },

                        ],


                        left: true,
                    },
                    {
                        model: seedTestingReportsModel,
                        attributes: [],
                        where: {
                            is_report_pass: true
                        }
                    },

                    ],

                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop->m_crop_group.group_code'), 'ASC']]
                };
            }

            const data = await lotNumberModel.findAll(condition);
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
    static getCropDataProductionseedSecond = async (req, res) => {
        try {
            const { year, season, group_code } = req.body;
            let condition = {}
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {
                console.log('icar')

                condition = {
                    where: {
                        year:req.body.year,
                        season: req.body.season,
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'A' + '%'
                        }
                    },
                    include: {
                        attributes: ['crop_name'],
                        model: cropModel,
                        where: {
                            group_code: group_code
                        },
                        left: true,
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop.crop_code')), 'crop_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop.crop_name'), 'ASC']]
                };
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'HICAR') {
                console.log('hicar')
                condition = {
                    where: {
                        year: req.body.year,
                        season: req.body.season,
                        forward_by_pdpc: 1,
                        crop_code:{
                            [Op.like]:'H' + '%'
                        }
                    },
                    include: {
                        attributes: ['crop_name'],
                        model: cropModel,
                        where: {
                            group_code: group_code
                        },
                        left: true,
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop.crop_code')), 'crop_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop.crop_name'), 'ASC']]
                };
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'SD') {
                console.log('sd')
                condition = {
                    where: {
                        year: year,
                        season: season,
                        forward_by_pdpc: 1,
                        forward_by_icar: 1,
                    },
                    include: {
                        attributes: ['crop_name'],
                        model: cropModel,
                        where: {
                            group_code: group_code
                        },
                        left: true,
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop.crop_code')), 'crop_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop.crop_name'), 'ASC']]
                };
            }
            else {                
                condition = {
                    where: {
                        year: year,
                        season: season,
                    },
                    include: {
                        attributes: ['crop_name'],
                        model: cropModel,
                        
                        where: {
                            group_code: group_code,
                            breeder_id:req.body.loginedUserid.id
                        },
                        left: true,
                    },
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('m_crop.crop_code')), 'crop_code'],
                    ],
                    raw: true,
                    order: [[Sequelize.col('m_crop.crop_name'), 'ASC']]
                };
            }
            const data = await lotNumberModel.findAll(condition);
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

    static getproductionSeedData = async (req, res) => {
        try {
            const { year, season, group_code, crop_code } = req.body;
            let condition = {}
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {
                condition = {

                    // attributes: [
                    //     'indent_quantity', 'year', 'season', 'crop_code', 'variety_id', 'group_code'
                    // ],
                    include: [
                        {
                            model: cropModel,
                            where: {
                                group_code: group_code
                            },
                            attributes: []
                        },
                        {
                            model: varietyModel,
                            attributes: ['variety_name']
                        },
                        {
                            model: userModel,
                            attributes: ['name', 'id']
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },



                    ],
                    where: {
                        forward_by_pdpc: 1
                    },
                    attributes: [
                        [Sequelize.col('m_crop_variety.id'), 'variety_id'],
                        [Sequelize.col('lot_number_creations.lot_number_size'), 'lot_number_size'],
                        [Sequelize.col('lot_number_creations.forward_by_pdpc'), 'forward_by_pdpc'],
                        [Sequelize.col('lot_number_creations.forward_by_icar'), 'forward_by_icar'],
                    ],

                    raw: true,
                }
            }
            else if (req.body && req.body.user_type && req.body.user_type == 'SD') {
                condition = {

                    // attributes: [
                    //     'indent_quantity', 'year', 'season', 'crop_code', 'variety_id', 'group_code'
                    // ],
                    include: [
                        {
                            model: cropModel,
                            where: {
                                group_code: group_code
                            },
                            attributes: []
                        },
                        {
                            model: varietyModel,
                            attributes: ['variety_name']
                        },
                        {
                            model: userModel,
                            attributes: ['name', 'id']
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },



                    ],
                    where: {
                        // forward_by_pdpc: 1,
                        forward_by_icar: 1
                    },
                    attributes: [
                        [Sequelize.col('m_crop_variety.id'), 'variety_id'],
                        [Sequelize.col('lot_number_creations.lot_number_size'), 'lot_number_size'],
                        [Sequelize.col('lot_number_creations.forward_by_pdpc'), 'forward_by_pdpc'],
                        [Sequelize.col('lot_number_creations.forward_by_icar'), 'forward_by_icar'],
                    ],

                    raw: true,
                }
            }
            else {
                condition = {
                    where: {},
                    // attributes: [
                    //     'indent_quantity', 'year', 'season', 'crop_code', 'variety_id', 'group_code'
                    // ],
                    include: [
                        {
                            model: cropModel,
                            where: {
                                group_code: group_code
                            },
                            attributes: []
                        },
                        {
                            model: varietyModel,
                            attributes: ['variety_name']
                        },
                        {
                            model: userModel,
                            attributes: ['name', 'id']
                        },
                        {
                            model: seedTestingReportsModel,
                            attributes: [],
                            where: {
                                is_report_pass: true
                            }
                        },



                    ],
                    attributes: [
                        [Sequelize.col('m_crop_variety.id'), 'variety_id'],
                        [Sequelize.col('lot_number_creations.lot_number_size'), 'lot_number_size'],
                        [Sequelize.col('lot_number_creations.forward_by_pdpc'), 'forward_by_pdpc'],
                        [Sequelize.col('lot_number_creations.forward_by_icar'), 'forward_by_icar'],
                    ],

                    raw: true,
                }
            }





            if (year) {
                condition['where']['year'] = year;
            }

            if (season) {
                condition['where']['season'] = season;
            }



            if (crop_code) {
                condition['where']['crop_code'] = crop_code;
            }

            const data = await lotNumberModel.findAll(condition);
            let filteredData = []
            data.forEach(el => {
                const spaIndex = filteredData.findIndex(item => item.variety_id == el.variety_id);

                if (spaIndex === -1) {
                    filteredData.push({
                        "variety_id": el.variety_id,
                        "variety_name": el['m_crop_variety.variety_name'],
                        'forward_by_pdpc': el.forward_by_pdpc,
                        'forward_by_icar': el.forward_by_icar,
                        "spa_count": 1,
                        "variety": [
                            {
                                'userName': el && el['user.name'] ? el['user.name'] : 'Na',
                                'userId': el && el['user.id'] ? el['user.id'] : 'Na',
                                "produced_qty": el && el.lot_number_size ? el.lot_number_size : '',
                                "variety_id": el.variety_id,
                                'total_indent': el && el.lot_number_size ? parseFloat(el.lot_number_size) : '',
                                "spa_count": 1,
                                "spas": [
                                    {

                                        "produced_qty": el && el.lot_number_size ? el.lot_number_size : '',

                                    }
                                ]
                            }
                        ]
                    });
                } else {
                    // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
                    const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.userId == el['user.id']);
                    //	          const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code );

                    if (cropIndex !== -1) {
                        // console.log('>>>>', cropIndex);

                        filteredData[spaIndex].variety[cropIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.lot_number_size)).toFixed(2);
                        filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].total_indent) + parseFloat(el.lot_number_size)).toFixed(2);
                        filteredData[spaIndex].variety[cropIndex].variety_count = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
                        // filteredData[spaIndex].variety_count  = filteredData[spaIndex].variety_count + 1;
                        filteredData[spaIndex].variety[cropIndex].spa_count = filteredData[spaIndex].variety[cropIndex].spa_count + 1;
                        filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

                        filteredData[spaIndex].variety[cropIndex].spas.push(
                            {

                                "produced_qty": el && el.lot_number_size ? el.lot_number_size : '',

                            }
                        );
                    } else {
                        // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
                        filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
                        filteredData[spaIndex].variety_count = filteredData[spaIndex].variety_count + 1;
                        filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

                        filteredData[spaIndex].variety.push({
                            'userName': el && el['user.name'] ? el['user.name'] : 'Na',
                            'userId': el && el['user.name'] ? el['user.id'] : 'Na',
                            "variety_id": el.variety_id,
                            "produced_qty": el && el.lot_number_size ? parseFloat(el.lot_number_size) : '',
                            'total_indent': el && el.lot_number_size ? parseFloat(el.lot_number_size) : '',
                            "spas": [
                                {

                                    "produced_qty": el && el.lot_number_size ? el.lot_number_size : '',

                                }
                            ]
                        });
                    }
                }
            });
            let seasonFilter = {}
            if (season) {
                seasonFilter = { season: season }
            }
            let group_codeFilet = {}
            if (group_code) {
                group_codeFilet = { group_code: group_code }
            }
            let crop_codeFilet = {}
            if (crop_code) {
                crop_codeFilet = { crop_code: crop_code }
            }
            const indentordata = await indentorBreederSeedModel.findAll({
                attributes: ['id'],

                where: {
                    year: year,
                    ...seasonFilter,
                    ...group_codeFilet,
                    ...crop_codeFilet
                },
                attributes: [
                    // 'variety_id'
                    [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
                    [Sequelize.fn('sum', Sequelize.col('indent_of_breederseeds.indent_quantity')), 'total_amount_indent_quantity'],
                    // [Sequelize.col('indent_of_breederseeds.id'),'id'],
                    [Sequelize.col('indent_of_breederseeds.id'), 'id'],
                ],
                group: [
                    [Sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
                    [Sequelize.col('indent_of_breederseeds.id'), 'id'],
                ],
                raw: true
            });

            const allocatedQtyDa = await Promise.all(filteredData.map(el => {
                const res = bsp1Model.findAll({

                    where: {
                        year: year,
                        variety_id: el.variety_id,
                        ...seasonFilter,
                        // ...group_codeFilet,
                        ...crop_codeFilet,
                    },
                    include: [{
                        model: bsp1ProductionCenterModel,
                        attributes: [],


                    },
                    {
                        model: cropModel,
                        attributes: [],
                        where: {
                            ...group_codeFilet
                        }
                    }
                    ],
                    attributes: [
                        'variety_id',
                        [Sequelize.col('bsp1_production_centers.production_center_id'), 'production_center_id'],
                        [Sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
                        [Sequelize.col('bsp1_production_centers.id'), 'id'],
                        [Sequelize.col('bsp_1s.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
                    ]

                })
                return res

            }))
            // const allocatedQtyDat = await bsp1Model.findAll({
            //     include:[
            //         {
            //             model:bsp1ProductionCenterModel,
            //             attributes:['id',]

            //         }
            //     ],
            //     where:{
            //         year:year
            //     },                
            //     attributes:[
            //         'variety_id',

            //         [Sequelize.fn('DISTINCT', Sequelize.col('bsp1_production_centers.production_center_id')), 'production_center_id'],
            //         [Sequelize.fn('sum', Sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'total_amount_quantity_of_seed_produced'],
            //     ],
            //     group:[
            //         [Sequelize.col('bsp1_production_centers.production_center_id'), 'production_center_id'],
            //         [Sequelize.col('bsp1_production_centers.id'), 'id'],
            //     ],
            //     raw:true
            // });



            let newArr = {
                filteredData: filteredData,
                indentordata: indentordata,
                allocateddata: allocatedQtyDa
            }


            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, newArr);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static forward = async (req, res) => {
        try {
            let dataToInsert = {}
            if (req.body && req.body.user_type && req.body.user_type == 'ICAR') {

                dataToInsert = {
                    forward_by_icar: 1

                }
            }
           else if (req.body && req.body.user_type && req.body.user_type == 'HICAR') {

                dataToInsert = {
                    forward_by_icar: 1

                }
            }
             else {
                dataToInsert = {
                    forward_by_pdpc: 1,


                }
            }
            const data = await lotNumberModel.update(dataToInsert, {

                include: [
                    {
                        model: cropModel,
                        where: {
                            group_code: req.body.group_code
                        }

                    }
                ],
                where: {

                    year: req.body.year,
                    season: req.body.season,
                    crop_code: req.body.crop_code,
                    variety_id: {
                        [Op.in]: req.body.VarietId
                    },



                }
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

module.exports = ProducedBreederSeedDetailsController;