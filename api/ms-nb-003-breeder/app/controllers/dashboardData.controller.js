const Validator = require('validatorjs');
const response = require('../_helpers/response');
const Sequelize = require('sequelize');
const status = require('../_helpers/status.conf');
const { generateBills, allocationToIndentorSeed, allocationToIndentorProductionCenterSeed, lotNumberModel, seedTestingReportsModel, indentorBreederSeedModel, dashboardData } = require('../models');
const pagination = require('../_helpers/bsp');
const bsp3Helper = require('../_helpers/bsp3');
const indentorHelper = require('../_helpers/indentor');
const sequelize = require('sequelize');
const db = require("../models");
const Op = require('sequelize').Op;

class DashboardData {

    static fetch = async (req, res) => {
        try {
            let user_type = 'a';
            let data
            if (req && req.body && req.body.loginedUserid && req.body.loginedUserid['user_type'] && req.body.loginedUserid['user_type'] == 'ICAR') {
                user_type = 'a';
            } else {
                user_type = 'h';
            }
            if (req && req.body && req.body.loginedUserid && req.body.loginedUserid['user_type'] && req.body.loginedUserid['user_type'] == 'SD') {

		  /*  data = await dashboardData.findAll({
                    attributes: [
                        
                        [sequelize.fn('SUM', sequelize.col('indented_crop')), 'indented_crop'],
                        [sequelize.fn('SUM', sequelize.col('indented_variety')), 'indented_variety'],
                        // [sequelize.fn('SUM', sequelize.col('indented_quantity')), 'indented_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'h' THEN "indented_quantity" ELSE "indented_quantity" / 100 END)`),
                            'indented_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('indent_done')), 'indent_done'],
                        // [sequelize.fn('SUM', sequelize.col('indent_pending')), 'indent_pending'],
                        [sequelize.literal(`SUM("indent_done" / 2)`),
                            'indent_done'
                        ],
                        [sequelize.literal(`SUM("indent_pending" / 2)`),
                            'indent_pending'
                        ],
                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_crop')), 'assigned_pdpc_crop'],
                                               
                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_variety')), 'assigned_pdpc_variety'],
                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_quantity')), 'assigned_pdpc_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'h' THEN "assigned_pdpc_quantity" ELSE "assigned_pdpc_quantity" / 100 END)`),
                            'assigned_pdpc_quantity'
                        ],
                        [sequelize.fn('SUM', sequelize.col('produced_crop')), 'produced_crop'],
                        [sequelize.fn('SUM', sequelize.col('produced_variety')), 'produced_variety'],
                        // [sequelize.fn('SUM', sequelize.col('produced_quantity')), 'produced_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'h' THEN "produced_quantity" ELSE "produced_quantity" / 100 END)`),
                            'produced_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('assigned_pdpc_done')), 'assigned_pdpc_done'],
                        // [sequelize.fn('SUM', sequelize.col('assigned_pdpc_pending')), 'assigned_pdpc_pending'],
                        [sequelize.literal(`SUM("assigned_pdpc_done" / 2)`),
                            'assigned_pdpc_done'
                        ],
                        [sequelize.literal(`SUM("assigned_pdpc_pending" / 2)`),
                            'assigned_pdpc_pending'
                        ],

                        [sequelize.fn('SUM', sequelize.col('allocation_crop')), 'allocation_crop'],
                        [sequelize.fn('SUM', sequelize.col('allocation_variety')), 'allocation_variety'],
                        // [sequelize.fn('SUM', sequelize.col('allocation_quantity')), 'allocation_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'h' THEN "allocation_quantity" ELSE "allocation_quantity" / 100 END)`),
                            'allocation_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('allocation_done')), 'allocation_done'],
                        // [sequelize.fn('SUM', sequelize.col('allocation_pending')), 'allocation_pending'],
                        [sequelize.literal(`SUM("allocation_done" / 2)`),
                            'allocation_done'
                        ],
                        [sequelize.literal(`SUM("allocation_pending" / 2)`),
                            'allocation_pending'
                        ],
                        [sequelize.fn('SUM', sequelize.col('lifted_crop')), 'lifted_crop'],


                        [sequelize.fn('SUM', sequelize.col('lifted_variety')), 'lifted_variety'],
                        // [sequelize.fn('SUM', sequelize.col('lifted_quantity')), 'lifted_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'h' THEN "lifted_quantity" ELSE "lifted_quantity" / 100 END)`),
                            'lifted_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('lifted_done')), 'lifted_done'],
                        // [sequelize.fn('SUM', sequelize.col('lifted_pending')), 'lifted_pending'],
                        [sequelize.literal(`SUM("lifted_done" / 2)`),
                            'lifted_done'
                        ],
                        [sequelize.literal(`SUM("lifted_pending" / 2)`),
                            'lifted_pending'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('produced_done')), 'produced_done'],
                        // [sequelize.fn('SUM', sequelize.col('produced_pending')), 'produced_pending'],
                        [sequelize.literal(`SUM("produced_done" / 2)`),
                            'produced_done'
                        ],
                        [sequelize.literal(`SUM("produced_pending" / 2)`),
                            'produced_pending'
                        ],
			            "year", "season"
                      ],
                    group: ["year", "season"],
                    order: [['year', 'DESC']],
                    where: {
                        is_active: 1,
                        // crop_type: user_type
                    }
                });*/


		   data = await dashboardData.findAll({
                    attributes: [

                        [sequelize.fn('SUM', sequelize.col('indented_crop')), 'indented_crop'],
                        [sequelize.fn('SUM', sequelize.col('indented_variety')), 'indented_variety'],
                        // [sequelize.fn('SUM', sequelize.col('indented_quantity')), 'indented_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "indented_quantity" ELSE "indented_quantity" / 100 END)`),
                            'indented_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('indent_done')), 'indent_done'],
                        // [sequelize.fn('SUM', sequelize.col('indent_pending')), 'indent_pending'],
                        //[sequelize.literal(`SUM("indent_done" / 2)`),
                          //  'indent_done'
                        //],
                   //     [sequelize.literal(`SUM("indent_pending" / 2)`),
                     //       'indent_pending'
                       // ],
			
//			 [sequelize.literal(`(SUM(seed_indented_quantity)/SUM(assigned_pdpc_quantity)) * 100`),
  //                          'indent_done'
    //                    ],
			// [Sequelize.literal('(SUM("seed_indented_crop") / NULLIF(SUM("indented_crop"), 0)) * 100'), 'indent_done'],
            [Sequelize.literal('(SUM("indented_crop") / NULLIF(SUM("seed_indented_crop"), 0)) * 100'), 'indent_done'],

                        [Sequelize.literal('100-(SUM(indent_done))'), 'indent_pending'],

			[sequelize.fn('SUM', sequelize.col('seed_indented_crop')), 'seed_indented_crop'],
                        [sequelize.fn('SUM', sequelize.col('seed_indented_variety')), 'seed_indented_variety'],
                        // [sequelize.fn('SUM', sequelize.col('indented_quantity')), 'indented_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "seed_indented_quantity" ELSE "seed_indented_quantity" / 100 END)`),
                            'seed_indented_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('indent_done')), 'indent_done'],
                        // [sequelize.fn('SUM', sequelize.col('indent_pending')), 'indent_pending'],
                        [sequelize.literal(`SUM("seed_indent_done" / 2)`),
                            'seed_indent_done'
                        ],
                        [sequelize.literal(`SUM("seed_indent_pending" / 2)`),
                            'seed_indent_pending'
                        ],
                      

                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_crop')), 'assigned_pdpc_crop'],

                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_variety')), 'assigned_pdpc_variety'],
                        [sequelize.fn('SUM', sequelize.col('assigned_pdpc_quantity')), 'assigned_pdpc_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "assigned_pdpc_quantity" ELSE "assigned_pdpc_quantity" / 100 END)`),
                            'assigned_pdpc_quantity'
                        ],
                        [sequelize.fn('SUM', sequelize.col('produced_crop')), 'produced_crop'],
                        [sequelize.fn('SUM', sequelize.col('produced_variety')), 'produced_variety'],
                        // [sequelize.fn('SUM', sequelize.col('produced_quantity')), 'produced_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "produced_quantity" ELSE "produced_quantity" / 100 END)`),
                            'produced_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('assigned_pdpc_done')), 'assigned_pdpc_done'],
                        // [sequelize.fn('SUM', sequelize.col('assigned_pdpc_pending')), 'assigned_pdpc_pending'],
                        /*[sequelize.literal(`SUM("assigned_pdpc_done" / 2)`),
                            'assigned_pdpc_done'
                        ],
                        [sequelize.literal(`SUM("assigned_pdpc_pending" / 2)`),
                            'assigned_pdpc_pending'
                        ],*/
			
			[Sequelize.literal('(SUM("assigned_pdpc_crop") / NULLIF(SUM("seed_indented_crop"), 0)) * 100'), 'assigned_pdpc_done'],
                        [Sequelize.literal('100-(SUM(assigned_pdpc_done))'), 'assigned_pdpc_pending'],

                        [sequelize.fn('SUM', sequelize.col('allocation_crop')), 'allocation_crop'],
                        [sequelize.fn('SUM', sequelize.col('allocation_variety')), 'allocation_variety'],
                        // [sequelize.fn('SUM', sequelize.col('allocation_quantity')), 'allocation_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "allocation_quantity" ELSE "allocation_quantity" / 100 END)`),
                            'allocation_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('allocation_done')), 'allocation_done'],
                        // [sequelize.fn('SUM', sequelize.col('allocation_pending')), 'allocation_pending'],
                        /*[sequelize.literal(`SUM("allocation_done" / 2)`),
                            'allocation_done'
                        ],
                        [sequelize.literal(`SUM("allocation_pending" / 2)`),
                            'allocation_pending'
                        ],*/

			            [Sequelize.literal('(SUM("allocation_crop") / NULLIF(SUM("produced_crop"), 0)) * 100'), 'allocation_done'],
                        [Sequelize.literal('100-(SUM(allocation_done))'), 'allocation_pending'],


                        [sequelize.fn('SUM', sequelize.col('lifted_crop')), 'lifted_crop'],


                        [sequelize.fn('SUM', sequelize.col('lifted_variety')), 'lifted_variety'],
                        // [sequelize.fn('SUM', sequelize.col('lifted_quantity')), 'lifted_quantity'],
                        [sequelize.literal(`SUM(CASE WHEN "crop_type" = 'a' THEN "lifted_quantity" ELSE "lifted_quantity" / 100 END)`),
                            'lifted_quantity'
                        ],
                        // [sequelize.fn('SUM', sequelize.col('lifted_done')), 'lifted_done'],
                        // [sequelize.fn('SUM', sequelize.col('lifted_pending')), 'lifted_pending'],
                        /*[sequelize.literal(`SUM("lifted_done" / 2)`),
                            'lifted_done'
                        ],
                        [sequelize.literal(`SUM("lifted_pending" / 2)`),
                            'lifted_pending'
                        ],
			*/
		 	[Sequelize.literal('(SUM("lifted_quantity") / NULLIF(SUM("allocation_quantity"), 0)) * 100'), 'lifted_done'],
                        [Sequelize.literal('100-(SUM(lifted_done))'), 'lifted_pending'],


                        // [sequelize.fn('SUM', sequelize.col('produced_done')), 'produced_done'],
                        // [sequelize.fn('SUM', sequelize.col('produced_pending')), 'produced_pending'],
                        /*[sequelize.literal(`SUM("produced_done" / 2)`),
                            'produced_done'
                        ],
                        [sequelize.literal(`SUM("produced_pending" / 2)`),
                            'produced_pending'
                        ],*/

			[Sequelize.literal('(SUM("produced_crop") / NULLIF(SUM("assigned_pdpc_crop"), 0)) * 100'), 'produced_done'],
                        [Sequelize.literal('100-(SUM(produced_done))'), 'produced_pending'],


			            "year", "season"
                      ],
                    group: ["year", "season"],
                    order: [['year', 'DESC']],
                    where: {
                        is_active: 1,
                        // crop_type: user_type
                    }
                });

            }else{
                data = await dashboardData.findAll({
                    where: {
                        is_active: 1,
                        crop_type: user_type
                    }
    
                });
            }

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404)
            }

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static create = async (req, res) => {
        try {

            // const SeedReceivedIndentData = await this.SeedReceivedIndent()
            // console.log('-------SeedReceivedIndent----------', SeedReceivedIndentData)
            // return;
            const date = new Date();
            const d = date.getFullYear();

            const years = [d+1, d, d - 1];
            const seasons = ['K', 'R'];
            const types = ['a', 'h']

            const dataToUpdate = {
                is_active: 0
            };

            await dashboardData.update(dataToUpdate, {
                where: {}
            });


            years.forEach(year => {
                types.forEach(crop_type => {
                    seasons.forEach(async season => {
                        let condition = {
                            year: year,
                            season: season,
                            crop_type: crop_type
                        }

                        let object = {
                            'year': condition.year,
                            'season': condition.season,
                            'is_active': 1,
                            'crop_type': crop_type,
                        }

			// Received indent at seed division
                         let indentReeivedBySeedDivision = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                // is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let indentReeivedBySeedDivisionCount = indentReeivedBySeedDivision.length;

                        let indentFreezedByIndenterSeed = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_indenter_freeze: 1,
                                // is_freeze:1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let indentFreezedByIndenterCountSeed = indentFreezedByIndenterSeed.length;


                        let indentReeivedBySeedDivisionCropData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                // is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })
                        let indentReeivedBySeedDivisionVarietyData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                // is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });
                        let indentReeivedBySeedDivisionSumData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("sum", sequelize.col("indent_quantity")), "indent_quantity",]
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                // is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });
                        object['seed_indented_crop'] = indentReeivedBySeedDivisionCropData.length;
                        object['seed_indented_variety'] = indentReeivedBySeedDivisionVarietyData.length;
                        object['seed_indented_quantity'] = (indentReeivedBySeedDivisionSumData && indentReeivedBySeedDivisionSumData.length > 0 && indentReeivedBySeedDivisionSumData[0]['indent_quantity']) ? Number(indentReeivedBySeedDivisionSumData[0]['indent_quantity'].toFixed(2)) : 0;
                        object['seed_indent_done'] = 0;
                        object['seed_indent_pending'] = 100;
                        if (indentReeivedBySeedDivisionCount && indentFreezedByIndenterCountSeed) {
                            const done = (indentReeivedBySeedDivisionCount / indentFreezedByIndenterCountSeed) * 100;
                            // object['indent_done'] = Number(done.toFixed(2));
                            // object['indent_pending'] = Number((100 - done).toFixed(2));
                            if (done > 100) {
                                object['seed_indent_done'] = 100;
                                object['seed_indent_pending'] = 0
                            } else {
                                object['seed_indent_done'] = Number(done.toFixed(2));
                                object['seed_indent_pending'] = Number((100 - done).toFixed(2));
                            }
                        }


                        // Indent
                        let indentFreezedBySeedDivision = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')

                            },
                            raw: true,
                            nest: true,
                        })

                        let indentFreezedBySeedDivisionCount = indentFreezedBySeedDivision.length;

                        let indentFreezedByIndenter = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_indenter_freeze: 1,
                                is_freeze:1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let indentFreezedByIndenterCount = indentFreezedByIndenter.length;


                        let indentFreezedBySeedDivisionCropData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let indentFreezedBySeedDivisionVarietyData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let indentFreezedBySeedDivisionSumData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("sum", sequelize.col("indent_quantity")), "indent_quantity",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        object['indented_crop'] = indentFreezedBySeedDivisionCropData.length;
                        object['indented_variety'] = indentFreezedBySeedDivisionVarietyData.length;
                        object['indented_quantity'] = (indentFreezedBySeedDivisionSumData && indentFreezedBySeedDivisionSumData.length > 0 && indentFreezedBySeedDivisionSumData[0]['indent_quantity']) ? Number(indentFreezedBySeedDivisionSumData[0]['indent_quantity'].toFixed(2)) : 0;
                        object['indent_done'] = 0;
                        object['indent_pending'] = 100;

                        if (indentFreezedBySeedDivisionCount && indentFreezedByIndenterCount) {
                            const done = (indentFreezedBySeedDivisionCount / indentFreezedByIndenterCount) * 100;
                            // object['indent_done'] = Number(done.toFixed(2));
                            // object['indent_pending'] = Number((100 - done).toFixed(2));

                            if (done > 100) {
                                object['indent_done'] = 100;
                                object['indent_pending'] = 0
                            } else {
                                object['indent_done'] = Number(done.toFixed(2));
                                object['indent_pending'] = Number((100 - done).toFixed(2));
                            }
                        }


                        // Assign to PD/PC

                        let freezedByICAR = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                icar_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let freezedByICARCount = freezedByICAR.length;

                        let freezedBySeedDivision = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let freezedBySeedDivisionCount = freezedBySeedDivision.length;

                        let freezedBySeedDivisionCropData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                icar_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let freezedBySeedDivisionVarietyData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                icar_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let freezedBySeedDivisionSumData = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("sum", sequelize.col("indent_quantity")), "indent_quantity",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                is_freeze: 1,
                                icar_freeze: 1,
                                is_indenter_freeze: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        object['assigned_pdpc_crop'] = freezedBySeedDivisionCropData.length;
                        object['assigned_pdpc_variety'] = freezedBySeedDivisionVarietyData.length;
                        object['assigned_pdpc_quantity'] = (freezedBySeedDivisionSumData && freezedBySeedDivisionSumData.length > 0 && freezedBySeedDivisionSumData[0]['indent_quantity']) ? Number(freezedBySeedDivisionSumData[0]['indent_quantity'].toFixed(2)) : 0;
                        object['assigned_pdpc_done'] = 0;
                        object['assigned_pdpc_pending'] = 100;

                        if (freezedByICARCount && freezedBySeedDivisionCount) {
                            const done = (freezedByICARCount / freezedBySeedDivisionCount) * 100;
                            // object['assigned_pdpc_done'] = Number(done.toFixed(2));
                            // object['assigned_pdpc_pending'] = Number((100 - done).toFixed(2));

                            if (done > 100) {
                                object['assigned_pdpc_done'] = 100;
                                object['assigned_pdpc_pending'] = 0
                            } else {
                                object['assigned_pdpc_done'] = Number(done.toFixed(2));
                                object['assigned_pdpc_pending'] = Number((100 - done).toFixed(2));
                            }
                        }

                        // Production Data

                        let productionFreezedByPDPC = await lotNumberModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                forward_by_pdpc: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let productionFreezedByPDPCCount = productionFreezedByPDPC.length;

                        let productionFreezedByNodal = await indentorBreederSeedModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                icar_freeze: 1,
                                is_freeze:1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let productionFreezedByNodelCount = productionFreezedByNodal.length;

                        let productionSumData = await seedTestingReportsModel.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('lot_number')), 'lot_number'],
                            ],

                            where: {
                                year_of_indent: condition.year,
                                season: condition.season,
                                is_report_pass: true,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let productionCropData = await lotNumberModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                forward_by_pdpc: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let productionVarietyData = await lotNumberModel.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                forward_by_pdpc: 1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });


                        const productionQuantity = await Promise.all(productionSumData.map(async row => {
                            const temp = await lotNumberModel.findAll({
                                attributes: ['lot_number_size'],
                                where: {
                                    year: condition.year,
                                    season: condition.season,
                                    forward_by_pdpc: 1,
                                    forward_by_icar: 1,
                                    id: row.lot_number,
                                    crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                                },
                                raw: true,
                                nest: true,
                            });

                            if (temp && temp.length > 0) {
                                return temp[0]['lot_number_size']
                            } else {
                                return 0
                            }

                        }));

                        let quantitySum = 0
                        if (productionQuantity && productionQuantity.length > 0) {
                            productionQuantity.forEach(element => {
                                quantitySum += element
                            });
                        }

                        object['produced_crop'] = productionCropData.length;
                        object['produced_variety'] = productionVarietyData.length;
                        object['produced_quantity'] = quantitySum;
                        object['produced_done'] = 0;
                        object['produced_pending'] = 100;

                        if (productionFreezedByPDPCCount && productionFreezedByNodelCount) {
                            const done = (productionFreezedByPDPCCount / productionFreezedByNodelCount) * 100;
                            // object['produced_done'] = Number(done.toFixed(2));
                            // object['produced_pending'] = Number((100 - done).toFixed(2));

                            if (done > 100) {
                                object['produced_done'] = 100;
                                object['produced_pending'] = 0
                            } else {
                                object['produced_done'] = Number(done.toFixed(2));
                                object['produced_pending'] = Number((100 - done).toFixed(2));
                            }
                        }


                        // Allocation Data
                        let allocationDoneBySeedDivision = await allocationToIndentorSeed.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })



                        let allocationDoneBySeedDivisionCount = allocationDoneBySeedDivision.length;

                        let forwardToSeedDivisionByICAR = await lotNumberModel.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                forward_by_icar: 1,
                                forward_by_pdpc:1,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let forwardToSeedDivisionByICARCount = forwardToSeedDivisionByICAR.length;


                        let allocationCropData = await allocationToIndentorSeed.findAll({
                            attributes: [
                                [sequelize.fn("DISTINCT", sequelize.col("crop_code")), "crop_code",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let allocationVarietyData = await allocationToIndentorSeed.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('variety_id')), 'variety_id'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let allocationSumData = await allocationToIndentorSeed.findAll({
                            attributes: ['id'],

                            include: [
                                {
                                    model: allocationToIndentorProductionCenterSeed,
                                    left: true,
                                    attributes: ['qty']
                                },
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let allocationTotalSum = 0;

                        if (allocationSumData && allocationSumData.length > 0) {
                            allocationSumData.forEach(element => {
                                if (element && element.allocation_to_indentor_for_lifting_seed_production_cnters && element.allocation_to_indentor_for_lifting_seed_production_cnters['qty']) {
                                    allocationTotalSum += element.allocation_to_indentor_for_lifting_seed_production_cnters['qty']
                                }
                            });
                        }

                        object['allocation_crop'] = allocationCropData.length;
                        object['allocation_variety'] = allocationVarietyData.length;
                        object['allocation_quantity'] = Number(allocationTotalSum.toFixed(2));
                        object['allocation_done'] = 0;
                        object['allocation_pending'] = 100;

                        if (allocationDoneBySeedDivisionCount && forwardToSeedDivisionByICARCount) {
                            const done = (allocationDoneBySeedDivisionCount / forwardToSeedDivisionByICARCount) * 100;
                            // object['allocation_done'] = Number(done.toFixed(2));
                            // object['allocation_pending'] = Number((100 - done).toFixed(2));

                            if (done > 100) {
                                object['allocation_done'] = 100;
                                object['allocation_pending'] = 0
                            } else {
                                object['allocation_done'] = Number(done.toFixed(2));
                                object['allocation_pending'] = Number((100 - done).toFixed(2));
                            }
                        }


                        // Lifting Data
                        let billsLiftedQuantity = await generateBills.findAll({
                            attributes: [
                                [sequelize.fn("sum", sequelize.col("total_quantity")), "total_quantity",]
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let billsAllocatedQuantity = await allocationToIndentorSeed.findAll({
                            attributes: ['id'],

                            include: [
                                {
                                    model: allocationToIndentorProductionCenterSeed,
                                    left: true,
                                    attributes: ['qty']
                                },
                            ],
                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        })

                        let billsSum = 0;

                        if (billsAllocatedQuantity && billsAllocatedQuantity.length > 0) {
                            billsAllocatedQuantity.forEach(element => {
                                billsSum += element['allocation_to_indentor_for_lifting_seed_production_cnters']['qty']
                            });
                        }

                        let billsCropData = await generateBills.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.crop_code')), 'crop_code'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let billsVarietyData = await generateBills.findAll({
                            attributes: [
                                [Sequelize.fn('DISTINCT', Sequelize.col('generate_bills.variety_id')), 'variety_id'],
                            ],

                            where: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        let billsTotalSum = await generateBills.findAll({
                            attributes: [
                                [sequelize.fn("sum", sequelize.col("available_quantity")), "available_quantity",]
                            ],

                            wwhere: {
                                year: condition.year,
                                season: condition.season,
                                crop_code: sequelize.where(sequelize.fn('LOWER', sequelize.col('crop_code')), 'LIKE', condition.crop_type + '%')
                            },
                            raw: true,
                            nest: true,
                        });

                        object['lifted_crop'] = billsCropData.length;
                        object['lifted_variety'] = billsVarietyData.length;
                        //object['lifted_quantity'] = (billsTotalSum && billsTotalSum.length > 0 && billsTotalSum[0]['available_quantity']) ? Number(billsTotalSum[0]['available_quantity']) : 0;
                        object['lifted_quantity'] = (billsLiftedQuantity.length > 0 && billsLiftedQuantity[0]['total_quantity']) ? Number(billsLiftedQuantity[0]['total_quantity']) : 0;
			object['lifted_done'] = 0;
                        object['lifted_pending'] = 100;

                        if (billsLiftedQuantity && billsLiftedQuantity.length > 0 && billsLiftedQuantity[0]['total_quantity']) {
                            if (billsSum && billsSum > 0) {
                                const done = (billsLiftedQuantity[0]['total_quantity'] / billsSum) * 100;

                                if (done > 100) {
                                    object['lifted_done'] = 100;
                                    object['lifted_pending'] = 0
                                } else {
                                    object['lifted_done'] = Number(done.toFixed(2));
                                    object['lifted_pending'] = Number((100 - done).toFixed(2));
                                }

                            }
                        }

                        const data = await dashboardData.create(object);
                    })
                });


            })

            return response(res, status.DATA_AVAILABLE, 200);
        }
        catch (error) {
            console.log(error)
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

};

module.exports = DashboardData;
