require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sequelize = require('sequelize');
const nodemailer = require('nodemailer')
// model import
const { seedForProductionModel, seasonModel, cropModel, varietyModel, directIndent, seedInventory, assignBspcCropNewFlow, assignCropNewFlow, bspProformaOneBspc, bspProformaOne, userModel, agencyDetailModel, monitoringTeamAssignedToBspcsModel, monitoringTeamOfPdpcsModel, indentorBreederSeedModel, monitoringTeamPdpcDetails, stateModel, districtModel, agencytypeModel, designationModel, mVarietyLines, indentOfBrseedLines, reportStatus } = db;
const ConditionCreator = require('../_helpers/condition-creator');
const indentor = require('../_helpers/indentor');
// const { indentOfBreederseedModel } = require('../../../ms-nb-006-production-center/app/models');
const Op = require('sequelize').Op;

class BspcProfarmaOne {
    static getBspProformaOneData = async (req, res) => {
        try {
            const { year, season, crop_code, variety_code_array, id ,} = req.body.search;
            let filter = await ConditionCreator.breederBspFormFilter(req.body.search);
            let crop_value = ``;
            let season_value = ``;
            let year_value = ``;
            let varietyValue = ``;
            let userId = ``;
            let userIdBreeder;
            if(req.body.search){
                if(req.body.search.report_status == "bsp_one_report"){
                    userIdBreeder = req.body.search.user_id
                    userId = `AND "bsp_proforma_1s"."user_id" = '${userIdBreeder ? userIdBreeder:''}'`
                }else{
                    if (req.body.loginedUserid && req.body.loginedUserid.id) {
                        userId = `AND "bsp_proforma_1s"."user_id" = '${req.body.loginedUserid.id ? req.body.loginedUserid.id :req.body.user_id ?req.body.user_id :''}'`
                    }
                }
            }
            // (req.body.user_id  ?req.body.user_id:
            
            if (crop_code) {
                crop_value = `"bsp_proforma_1s"."crop_code" = '${crop_code.toString()}'`;
            }
            if (season) {
                season_value = `AND "bsp_proforma_1s"."season" = '${season.toString()}'`;
            }
            if (year) {
                year_value = `AND "bsp_proforma_1s"."year" = '${year}'`;
            }

            if (variety_code_array && variety_code_array.length > 0) {
                let variety_code = [];
                variety_code_array.forEach(ele => {
                    variety_code.push(`'` + ele.toString() + `'`);
                })
                varietyValue = `AND "bsp_proforma_1s"."variety_code" IN (${variety_code})`;
            }
            // LEFT OUTER JOIN "indent_of_brseed_lines" AS "indent_of_brseed_line" ON "indent_of_breederseed"."id" = "indent_of_brseed_line"."indent_of_breederseed_id" 
            // ,"indent_of_brseed_line"."quantity" AS "line_quantity"
            // ,"indent_of_brseed_line"."quantity"
            // "indent_of_breederseed"."user_id" AS "indent_id","indent_of_breederseed"."id" AS brseed_id,
            let bspProformaOneData = await db.sequelize.query(`SELECT bsp_proforma_1s.id AS bspperformaOneId,  bsp_proforma_1s.variety_code AS variety_code,bsp_proforma_1s.user_id AS user_id,m_variety_line.line_variety_name AS line_variety_name,m_variety_line.line_variety_code AS line_variety_code, bsp_proforma_1s.id AS id, bsp_proforma_1s.year AS "year",
            SUM("indent_of_breederseed"."indent_quantity") AS "indent_quantity",
            "bsp_proforma_1s"."season" AS "season", "bsp_proforma_1s"."crop_code" AS "crop_code", "bsp_proforma_1s"."ref_no" AS "ref_no",
            "f"."variety_name" AS "variety_name","f"."not_date" AS "not_date","b->user->agency_detail"."agency_name" AS "bspc_name", "b->user->agency_detail"."state_id" AS "state_code","b->user->agency_detail"."district_id" AS "district_code","b->user->agency_detail"."user_id" AS "bspc_id",
            ("b"."target_qunatity" ) AS "target_qunatity" ,("b"."isPermission" ) AS "isPermission",("b"."production_type" ) AS "production_type"
            FROM "bsp_proforma_1s" AS "bsp_proforma_1s"
            LEFT OUTER JOIN "m_variety_lines" AS "m_variety_line" ON "bsp_proforma_1s"."variety_line_code" = "m_variety_line"."line_variety_code"
            INNER JOIN "bsp_proforma_1_bspcs" AS "b" ON "bsp_proforma_1s"."id" = "b"."bspc_proforma_1_id"
            INNER JOIN "users" AS "b->user" ON "b"."bspc_id" = "b->user"."id"
            INNER JOIN "agency_details" AS "b->user->agency_detail" ON "b->user"."agency_id" = "b->user->agency_detail"."id"
            INNER JOIN "m_crop_varieties" AS "f" ON "bsp_proforma_1s"."variety_code" = "f"."variety_code"
            INNER JOIN "indent_of_breederseeds" AS "indent_of_breederseed" ON 
            "bsp_proforma_1s"."crop_code" = "indent_of_breederseed"."crop_code"
            AND ("indent_of_breederseed"."season" = "bsp_proforma_1s"."season" AND "indent_of_breederseed"."year" = "bsp_proforma_1s"."year"
            AND "indent_of_breederseed"."variety_code" = "bsp_proforma_1s"."variety_code" AND "indent_of_breederseed"."crop_code" = "bsp_proforma_1s"."crop_code")
            WHERE ${crop_value} ${season_value} ${year_value} ${varietyValue} ${userId}  
            GROUP BY bsp_proforma_1s.variety_code, bsp_proforma_1s.id ,m_variety_line.line_variety_name, m_variety_line.line_variety_code, bsp_proforma_1s.year,"b"."bspc_id", 
            "bsp_proforma_1s"."season", "bsp_proforma_1s"."crop_code","bsp_proforma_1s"."ref_no",
            "f"."variety_name" , "b->user->agency_detail"."agency_name","b->user->agency_detail"."user_id",
            "b"."target_qunatity","b->user->agency_detail"."state_id","b->user->agency_detail"."district_id","f"."not_date","b"."isPermission","b"."production_type"
             ORDER BY "b"."bspc_id" DESC ;`);
            //  ,"indent_of_breederseed"."user_id","indent_of_breederseed"."id"
            // new logic
            let bsp1Data = [];
            const bsp1Data1 = await Promise.all(bspProformaOneData[0].map(async (ele, i) => {
                let condition;
                if (ele.line_variety_code) {
                    condition = {
                        where: {
                            season: ele.season,
                            year: ele.year,
                            variety_code: ele.variety_code,
                            crop_code: ele.crop_code,
                            variety_line_code: ele.line_variety_code,
                            user_id: ele.bspc_id
                        },
                    }
                } else {
                    condition = {
                        where: {
                            season: ele.season,
                            year: ele.year,
                            variety_code: ele.variety_code,
                            crop_code: ele.crop_code,
                            user_id: ele.bspc_id
                        },
                    }
                }

                let productionCenter = await seedForProductionModel.findOne(
                    {
                        ...condition,
                        raw: true,
                        attribites: [
                            [sequelize.col('seed_for_production.nucleus_seed_to_use'), 'nucleus_seed_to_use'],
                            [sequelize.col('seed_for_production.breeder_seed_to_use'), 'breeder_seed_to_use']
                        ]
                    }
                );
                let parentalLine = [];
                if (ele.line_variety_code) {
                    parentalLine = await db.sequelize.query(`SELECT  SUM("indent_of_brseed_line"."quantity") AS "quantity" 
                    FROM "indent_of_breederseeds" AS "indent_of_breederseeds" 
                    INNER JOIN "indent_of_brseed_lines" AS "indent_of_brseed_line" ON "indent_of_breederseeds"."id" = "indent_of_brseed_line"."indent_of_breederseed_id"  WHERE "indent_of_breederseeds"."crop_code" = '${ele.crop_code.toString()}' AND "indent_of_breederseeds"."variety_code" = '${ele.variety_code.toString()}' AND "indent_of_breederseeds"."season" =  '${ele.season.toString()}' AND "indent_of_breederseeds"."year" = ${ele.year} AND "indent_of_brseed_line"."variety_code_line" = '${ele.line_variety_code.toString()}' LIMIT 1;
                    `);
                }
                // AND "indent_of_brseed_line"."indent_of_breederseed_id" = ${ele.brseed_id}
                // AND "indent_of_breederseeds"."user_id" = ${ele.indent_id}
                let teamDataTemp = await db.sequelize.query(`SELECT "monitoring_team_of_pdpc"."id","monitoring_team_of_pdpc"."name"
                From "bsp_proforma_1s" AS "bsp_proforma_1s" 
                INNER JOIN "bsp_proforma_1_bspcs" AS "bsp_proforma_1_bspcs" ON "bsp_proforma_1_bspcs"."bspc_proforma_1_id" = "bsp_proforma_1s"."id"
                INNER JOin "monitoring_team_assigned_to_bspcs" As "monitoring_team_assigned_to_bspc" ON "monitoring_team_assigned_to_bspc"."bspc_id" = "bsp_proforma_1_bspcs"."bspc_id"
                INNER JOIN "monitoring_team_of_pdpcs" As "monitoring_team_of_pdpc" ON "monitoring_team_of_pdpc"."crop_code" = "bsp_proforma_1s"."crop_code" AND "monitoring_team_of_pdpc"."season" = "bsp_proforma_1s"."season" AND "monitoring_team_of_pdpc"."year" = "bsp_proforma_1s"."year" AND "monitoring_team_of_pdpc"."user_id" = "bsp_proforma_1s"."user_id" AND  "monitoring_team_of_pdpc"."id" = "monitoring_team_assigned_to_bspc"."monitoring_team_of_pdpc_id"
                WHERE ${crop_value} ${season_value} ${year_value} AND "bsp_proforma_1_bspcs"."bspc_id" = ${ele.bspc_id}
                GROUP BY "monitoring_team_of_pdpc"."id","monitoring_team_of_pdpc"."name"
                `)
                ele['breeder_seed_available_qnt'] = productionCenter && productionCenter.breeder_seed_to_use ? productionCenter.breeder_seed_to_use : 0;
                ele['nucleus_seed_available_qnt'] = productionCenter && productionCenter.nucleus_seed_to_use ? productionCenter.nucleus_seed_to_use : 0;
                ele['team_id'] = teamDataTemp[0] && teamDataTemp[0][0] && teamDataTemp[0][0]['id'] ? teamDataTemp[0][0]['id'] : '';
                ele['team_name'] = teamDataTemp[0] && teamDataTemp[0][0] && teamDataTemp[0][0]['name'] ? teamDataTemp[0][0]['name'] : '';
                ele['line_quantity'] = parentalLine && parentalLine[0] && parentalLine[0][0] && parentalLine[0][0]['quantity'] ? parentalLine[0][0]['quantity'] : '';
                bsp1Data.push(ele)

            }));
            let whereClause = {};
            if (req.body) {
                if (req.body.search) {
                    if (req.body.search.year) {
                        whereClause.year = req.body.search.year
                    }
                    if (req.body.search.season) {
                        whereClause.season = req.body.search.season
                    }
                    if (req.body.search.crop_code) {
                        whereClause.crop_code = req.body.search.crop_code
                    }
                }
            }
            if (bsp1Data && bsp1Data[0] && bsp1Data[0].bspc_id) {
                // whereClause.user_id = bsp1Data[0].bspc_id
            }

            let seeds = await seedForProductionModel.findAll({
                // attribites:[],
                where: {
                    ...whereClause
                },

                attributes: [
                    [sequelize.col('seed_for_production.id'), 'seed_for_production_id'],
                    'year', 'season', 'crop_code', 'variety_code', 'variety_line_code',
                ],
                raw: true
            })
            // con

            const result = [];
            if (bsp1Data && bsp1Data.length > 0) {

                for (const data of bsp1Data) {
                    const { variety_code, variety_line_code } = data;

                    // Find a match in bspData
                    const match = seeds.find(bsp =>
                        bsp.variety_code === variety_code &&
                        (bsp.line_variety_code === variety_line_code || (variety_line_code === null && bsp.line_variety_code === null))
                    );

                    if (match) {
                        result.push({
                            ...data,
                            bspMatch: match
                        });
                    }
                }
            }

            // json structure
            const filteredData = [];
            result.forEach(el => {
                // console.log('el.isPermission===', el);
                const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code);
                if (spaIndex === -1) {
                    filteredData.push({
                        variety_name: el.variety_name,
                        variety_code: el.variety_code,
                        indent_qnt: el.indent_quantity,
                        crop_code: el.crop_code,
                        ref_no: el.ref_no ? el.ref_no : '',
                        count: 1,
                        "variety_line": [
                            {
                                id: el.id,
                                variety_name: el.variety_name,
                                bspperformaoneid: el.bspperformaoneid,
                                variety_code: el.variety_code,
                                line_variety_name: el.line_variety_name,
                                line_variety_code: el.line_variety_code,
                                // indent_qnt: 120,
                                indent_qnt: el.line_quantity ? el.line_quantity : '',
                                year: el.year,
                                season: el.season,
                                crop_code: el.crop_code,
                                not_date: el && el.not_date ? el.not_date : '',
                                seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
                                count: 1,
                                "bspc": [
                                    {
                                        state_code: el && el.state_code ? el.state_code : '',
                                        district_code: el && el.district_code ? el.district_code : '',
                                        team_name: el && el.team_name ? el.team_name : '',
                                        team_id: el && el.team_id ? el.team_id : '',
                                        bspperformaoneid: el.bspperformaoneid,
                                        bspc_name: el.bspc_name,
                                        include_seed: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : 0,
                                        breeder_seed: el && el.breeder_seed_available_qnt ? el.breeder_seed_available_qnt : 0,
                                        target_quantity: el.target_qunatity,
                                        count: 1,
                                        id: el.bspc_id,
                                        isPermission: el.isPermission ? el.isPermission : '',
                                        production_type: el.production_type ? el.production_type : '',
                                        seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
                                    }
                                ]
                            }
                        ]
                    });
                } else {
                    const cropIndex = filteredData[spaIndex].variety_line.findIndex(item => item.line_variety_code == el.line_variety_code);
                    if (cropIndex !== -1) {
                        filteredData[spaIndex].variety_line[cropIndex].bspc.push(
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                district_code: el && el.district_code ? el.district_code : '',
                                team_name: el && el.team_name ? el.team_name : '',
                                team_id: el && el.team_id ? el.team_id : '',
                                bspc_name: el.bspc_name,
                                include_seed: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : 0,
                                breeder_seed: el && el.breeder_seed_available_qnt ? el.breeder_seed_available_qnt : 0,
                                target_quantity: el.target_qunatity,
                                count: 1,
                                id: el.bspc_id,
                                isPermission: el.isPermission ? el.isPermission : '',
                                production_type: el.production_type ? el.production_type : '',
                                bspperformaoneid: el.bspperformaoneid,
                                seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
                            }
                        );
                    } else {
                        filteredData[spaIndex].variety_line.push({
                            id: el.id,
                            variety_name: el.variety_name,
                            variety_code: el.variety_code,
                            line_variety_name: el.line_variety_name,
                            line_variety_code: el.line_variety_code,
                            bspperformaoneid: el.bspperformaoneid,
                            // indent_qnt: 120,
                            indent_qnt: el.line_quantity ? el.line_quantity : '',
                            year: el.year,
                            season: el.season,
                            crop_code: el.crop_code,
                            not_date: el && el.not_date ? el.not_date : '',
                            seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
                            count: 1,
                            "bspc": [
                                {
                                    state_code: el && el.state_code ? el.state_code : '',
                                    district_code: el && el.district_code ? el.district_code : '',
                                    team_name: el && el.team_name ? el.team_name : '',
                                    team_id: el && el.team_id ? el.team_id : '',
                                    bspc_name: el.bspc_name,
                                    include_seed: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : 0,
                                    breeder_seed: el && el.breeder_seed_available_qnt ? el.breeder_seed_available_qnt : 0,
                                    target_quantity: el.target_qunatity,
                                    count: 1,
                                    id: el.bspc_id,
                                    isPermission: el.isPermission ? el.isPermission : '',
                                    production_type: el.production_type ? el.production_type : '',
                                    bspperformaoneid: el.bspperformaoneid,
                                    seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
                                }
                            ]
                        });
                    }
                }
            });
            let responseData = [];
            if (filteredData && filteredData.length) {
                filteredData.forEach((item, i) => {
                    filteredData[i].count = 0;
                    if (item.variety_line && item.variety_line.length > 0) {
                        item.variety_line.forEach((ele, j) => {
                            filteredData[i].variety_line[j].count = 0;
                            filteredData[i].count += (ele.bspc.length)
                            filteredData[i].variety_line[j].count = (ele.bspc.length)
                        })
                    }
                });
                responseData = filteredData;
            }
            return response(res, status.DATA_AVAILABLE, 200, responseData);
        } catch (error) {
            console.log("error", error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static addBspProformaOneData = async (req, res) => {
        try {
            let { crop_code, variety_code, year, season, user_id, bspc_array, id, variety_parental_line } = req.body;
            let dataRow = {
                "crop_code": crop_code,
                "variety_code": variety_code,
                "year": year,
                "season": season,
                "user_id": user_id,
                "variety_line_code": variety_parental_line ? variety_parental_line : ''
            }
            let varietyParentalCode;
            if (variety_parental_line) {
                varietyParentalCode = { variety_line_code: variety_parental_line }
            }
            if (id) {
                let bspProformaOneData = await bspProformaOne.update(dataRow, { where: { id: id } });
                let bspDataArrayValue = []
                if (bspc_array && bspc_array !== undefined && bspc_array.length > 0) {
                    let isDeleted = bspProformaOneBspc.destroy({ where: { bspc_proforma_1_id: id } });
                    if (isDeleted) {
                        bspc_array.forEach((bspcArray) => {
                            if (bspcArray.willing_to_produce == 0) {
                                // let dataDelete = bspProformaOne.destroy({ where: { id: id } });
                                // if (dataDelete) {
                                let dataDelete = bspProformaOneBspc.destroy({ where: { bspc_proforma_1_id: id } });
                                // return response(res, status.DATA_DELETED, 200, {});
                                // }
                            } else {
                                bspDataArrayValue = bspProformaOneBspc.build({
                                    bspc_proforma_1_id: id,
                                    bspc_id: bspcArray.id,
                                    isPermission: bspcArray && bspcArray.isPermission ? bspcArray.isPermission : false,
                                    target_qunatity: bspcArray && bspcArray.target_qunatity ? parseFloat(bspcArray.target_qunatity) : null,
                                    production_type: bspcArray && bspcArray.production_type ?  bspcArray.production_type: "NORMAL"
                                });
                                bspDataArrayValue.save();
                            }
                        });
                        if (bspProformaOneData) {
                            let updatedValue = await bspProformaOne.findOne({ raw: true, where: { id: id } });
                            return response(res, status.DATA_UPDATED, 200, updatedValue);
                        } else {
                            return response(res, "Data Not Updated", 201, []);
                        }
                    }
                } else {
                    return response(res, "bspc is required", 201, [])
                }
            } else {
                let isExits = await bspProformaOne.findAll({ where: { year: year, season: season, crop_code: crop_code, variety_code: variety_code, ...varietyParentalCode } });
                console.log("isExits", isExits);
                if (isExits && isExits.length) {
                    return response(res, "Data Already Exist", 201, []);
                } else {
                    let bspProformaOneData = await bspProformaOne.create(dataRow);
                    if (bspProformaOneData) {
                        let bspDataArrayValue = [];
                        if (bspc_array && bspc_array !== undefined && bspc_array.length > 0) {
                            // if(willing_to_produce)
                            bspc_array.forEach((bspcArray) => {
                                if (bspcArray.willing_to_produce == 0) {
                                    // let dataDelete = bspProformaOne.destroy({ where: { id: bspProformaOneData.dataValues.id } });
                                    // if (dataDelete) {
                                    let dataDelete = bspProformaOneBspc.destroy({ where: { bspc_proforma_1_id: bspProformaOneData.dataValues.id } });
                                    // return response(res, status.DATA_DELETED, 200, {});
                                    // }
                                } else {
                                    bspDataArrayValue = bspProformaOneBspc.build({
                                        bspc_proforma_1_id: bspProformaOneData.dataValues.id,
                                        bspc_id: bspcArray.id,
                                        isPermission: bspcArray && bspcArray.isPermission ? bspcArray.isPermission : false,
                                        target_qunatity: bspcArray && bspcArray.target_qunatity ? bspcArray.target_qunatity : null,
                                        production_type: bspcArray && bspcArray.production_type ?  bspcArray.production_type: "NORMAL"
                                    })
                                    bspDataArrayValue.save();
                                }
                            });
                            if (bspDataArrayValue) {
                                return response(res, status.DATA_SAVE, 200, dataRow);
                            } else {
                                return response(res, status.DATA_NOT_SAVE, 200, dataRow);
                            }
                        } else {
                            return response(res, "bspc is required", 201, [])
                        }
                    }
                }
            }
        } catch (error) {
            console.log("error", error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);

        }
    }

    static deleteBspProformaOneData = async (req, res) => {
        try {
            let { id } = req.body;
            if (id) {
                let dataDelete = await bspProformaOne.destroy({ where: { id: id } });
                if (dataDelete) {
                    let dataDelete = await bspProformaOneBspc.destroy({ where: { bspc_proforma_1_id: id } });
                    return response(res, status.DATA_DELETED, 200, {});
                } else {
                    return response(res, "Data Not Deleted", 200, {});
                }
            } else {
                return response(res, status.ID_NOT_FOUND, 200, {});
            }
        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 501, [])
        }
    }

    static getAllBspcData = async (req, res) => {
        let returnResponse;
        try {
            let { search } = req.body;
            let filter = await ConditionCreator.breederBspFormFilter(search);
            let condition = {
                include: [
                    {
                        model: userModel,
                        attributes: [],
                        where: {
                            user_type: "BPC"
                        },
                        include: [
                            {
                                model: agencyDetailModel,
                                attributes: []
                            }
                        ]
                    }
                ],
                raw: true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('seed_for_production.user_id')), "user_id"],
                    [sequelize.fn('SUM', sequelize.col('seed_for_production.nucleus_seed_available_qnt')), "nucleus_avl_qnt"],
                    [sequelize.col('seed_for_production.crop_code'), "crop_code"],
                    [sequelize.col('seed_for_production.variety_code'), "variety_code"],
                    [sequelize.col('seed_for_production.year'), "year"],
                    [sequelize.fn('SUM', sequelize.col('seed_for_production.breeder_seed_available_qnt')), "breeder_avl_qnt"],
                    [sequelize.col('user.name'), "bspc_name"],
                    [sequelize.col('user->agency_detail.agency_name'), "name"],
                    [sequelize.col('user.id'), "id"],
                ],
                group: [
                    [sequelize.col('seed_for_production.user_id'), "user_id"],
                    [sequelize.col('seed_for_production.crop_code'), "crop_code"],
                    [sequelize.col('seed_for_production.variety_code'), "variety_code"],
                    [sequelize.col('seed_for_production.year'), "year"],
                    [sequelize.col('user.name'), "bspc_name"],
                    [sequelize.col('user->agency_detail.agency_name'), "name"],
                    [sequelize.col('user.id'), "id"],
                ],
                where: {
                    ...filter
                }
            };
            let getBspcData = await seedForProductionModel.findAll(condition);
            returnResponse = getBspcData
            return response(res, status.DATA_AVAILABLE, 200, returnResponse)
        } catch (error) {
            console.log('error==', error);
            return response(res, status.UNEXPECTED_ERROR, 501, returnResponse)
        }
    }

    static getBspProformaOneYear = async (req, res) => {
        try {
            let { search } = req.body;

            let breederId;
            let production_type;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_delay: 1 }
                }
            }
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                breederId = {
                    breeder_id: req.body.loginedUserid.id
                }
            }
            let filter = await ConditionCreator.breederBspFormFilter(search);

            let condition = {
                include: [
                    {
                        model: cropModel,
                        attributes: [],
                        where: {
                            ...breederId
                        }
                    }
                ],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('seed_for_production.year')), 'year']
                ],
                required: true,
                raw: true,
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    is_final_submitted: 1,
                    // ...production_type
                },
                order: [['year', 'DESC']]
            }
            let getBspOneYears = await seedForProductionModel.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static getBspProformaOneSeason = async (req, res) => {
        try {
            let { search } = req.body;
            let breederId;
            let production_type;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_delay: 1 }
                }
            }
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                breederId = {
                    breeder_id: req.body.loginedUserid.id
                }
            }
            let filter = await ConditionCreator.breederBspFormFilter(search);
            let condition = {
                include: [
                    {
                        model: seasonModel,
                        attributes: []
                    },
                    {
                        model: cropModel,
                        attributes: [],
                        where: {
                            ...breederId
                        }
                    }
                ],
                required: true,
                raw: true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('seed_for_production.season')), 'season__code'],
                    [sequelize.col('m_season.season'), 'season_name'],
                ],
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    is_final_submitted: 1,
                    // ...production_type
                },
                order: [[sequelize.col('seed_for_production.season'), 'ASC']]
            }
            let getBspOneYears = await seedForProductionModel.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    // static getBspProformaOneCrop = async (req, res) => {
    //     try {
    //         let { search } = req.body;
    //         let userId;
    //         if (search) {
    //             if (search.report_status == "bsp_one_report") {
    //                 // reportStatus = {report_status:"bsp_one_report"};
    //                 // userId = { breeder_id: search.user_id };
    //             } else{
    //                 if (req.body.loginedUserid && req.body.loginedUserid.id) {
    //                     userId = { breeder_id: req.body.loginedUserid.id }
    //                 }
    //             }
    //         }  
             
    //         let filter = await ConditionCreator.breederBspFormFilter(search);
    //         let condition = {
    //             include: [
    //                 {
    //                     model: cropModel,
    //                     attributes: [],
    //                     where: {
    //                         ...userId,
    //                     }
    //                 }
    //             ],
    //             raw: true,
    //             attributes: [
    //                 [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
    //                 [sequelize.col('m_crop.crop_name'), 'crop_name'],
    //             ],
    //             where: {
    //                 ...filter,
    //                 // willing_to_produce: 1,
    //                 is_final_submitted: 1
    //             },
    //             order: [[sequelize.col('m_crop.crop_code'), 'ASC']]
    //         }
    //         let getBspOneYears = await seedForProductionModel.findAll(condition);
    //         return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);
    //     } catch (error) {
    //         console.log('error', error);
    //         return response(res, status.UNEXPECTED_ERROR, 500, []);
    //     }
    // }
    static getBspProformaOneCrop = async (req, res) => {
        try {
            let { search } = req.body;
            let userId;
            let production_type;
            
            // if (req.body.loginedUserid && req.body.loginedUserid.id) {
            //     userId = { breeder_id: req.body.loginedUserid.id }
            // }
             
            if (search) {

                if (search.production_type) {
                    if (search.production_type == "DELAY") {
                        production_type = { production_delay: 1 }
                    }
                }
                
                if (search.report_status == "bsp_one_report") {
                    // reportStatus = {report_status:"bsp_one_report"};
                    // userId = { breeder_id: search.user_id };
                } else{
                    if (req.body.loginedUserid && req.body.loginedUserid.id) {
                        userId = { breeder_id: req.body.loginedUserid.id }
                    }
                }
            }
            let filter = await ConditionCreator.breederBspFormFilter(search);
            let condition = {
                include: [
                    {
                        model: cropModel,
                        attributes: [],
                        where: {
                            ...userId,
                        }
                    }
                ],
                raw: true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
                    [sequelize.col('m_crop.crop_name'), 'crop_name'],
                ],
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    is_final_submitted: 1,
                    // ...production_type
                },
                order: [[sequelize.col('m_crop.crop_code'), 'ASC']]
            }
            let getBspOneYears = await seedForProductionModel.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    

    static getBspProformaOneVariety = async (req, res) => {
        try {
            let { search } = req.body;
            let production_type;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_delay: 1 }
                }
            }
            let filter = await ConditionCreator.breederBspFormFilter(search)
            let condition = {
                // attributes: [[sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'], [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code']],
                attributes: ['variety_code', 'variety_line_code'],
                where: { ...filter }, raw: true
            }
            let bspProformaOneData = await bspProformaOne.findAll(condition);
            console.log('bspProformaOneData====', bspProformaOneData);
            let varietyCode = [];
            let varietyLineCode = [];
            if (bspProformaOneData && bspProformaOneData.length) {
                bspProformaOneData.forEach(ele => {
                    varietyCode.push(ele.variety_code);
                    if (ele.variety_line_code && ele.variety_line_code != null && ele.variety_line_code != undefined) {
                        varietyLineCode.push(ele.variety_line_code);
                    }
                })
            }

            let varietyCodeValue;
            if (varietyLineCode && varietyLineCode.length > 0) {
                varietyCodeValue = {
                    variety_line_code: {
                        [Op.notIn]: varietyLineCode
                    }
                }
            }

            if ((varietyLineCode && varietyLineCode.length > 0)) {
                let condition = {
                    include: [
                        {
                            model: varietyModel,
                            attributes: [],
                            where: {
                                [Op.or]: [
                                    {
                                        status: {
                                            [Op.not]: 'other'
                                        },
                                    },
                                    {
                                        status: {
                                            [Op.eq]: null
                                        },
                                    }
                                ]
                            }
                        }
                    ],
                    raw: true,
                    where: {
                        ...filter,
                        // willing_to_produce: 1,
                        is_final_submitted: 1,
                        // ...production_type,
                        [Op.or]: [
                            {
                                variety_code: {
                                    [Op.notIn]: varietyCode
                                },
                            },
                            { ...varietyCodeValue }
                        ]
                    },
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
                        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
                        [sequelize.col('m_crop_variety.status'), 'status']
                    ],
                    order: [[sequelize.col('m_crop_variety.variety_code'), 'ASC']]
                }

                let getBspOneYears = await seedForProductionModel.findAll(condition);
                return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);
            }
            if (varietyCode && varietyCode.length > 0) {
                let condition = {
                    include: [
                        {
                            model: varietyModel,
                            attributes: []
                        }
                    ],
                    raw: true,
                    where: {
                        ...filter,
                        // willing_to_produce: 1,
                        variety_code: {
                            [Op.notIn]: varietyCode
                        },
                    },
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
                        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
                        [sequelize.col('m_crop_variety.status'), 'status']
                    ],
                    order: [[sequelize.col('m_crop_variety.variety_code'), 'ASC']]
                }
                let getBspOneYears = await seedForProductionModel.findAll(condition);
                return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);
            } else {
                let condition = {
                    include: [
                        {
                            model: varietyModel,
                            attributes: []
                        }
                    ],
                    raw: true,
                    where: {
                        ...filter,
                        // willing_to_produce: 1,
                        is_final_submitted: 1
                    },
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
                        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
                        [sequelize.col('m_crop_variety.status'), 'status']
                    ],
                    order: [[sequelize.col('m_crop_variety.variety_code'), 'ASC']]
                }
                let getBspOneYears = await seedForProductionModel.findAll(condition);
                return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);
            }
        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspProformaOneVarietyFilter = async (req, res) => {
        try {
            let { search } = req.body;
            let filter = await ConditionCreator.breederBspFormFilter(search)

            let condition = {
                include: [
                    {
                        model: varietyModel,
                        attributes: []
                    }
                ],
                raw: true,
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    // is_final_submitted: 1,
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
                    [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
                ],
                order: [[sequelize.col('m_crop_variety.variety_code'), 'ASC']]
            }
            let getBspOneYears = await bspProformaOne.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static getBspProformaOneVarietySecond = async (req, res) => {
        try {
            let { search } = req.body;
            let filter = await ConditionCreator.breederBspFormFilter(search)
            let condition = {
                include: [
                    {
                        model: varietyModel,
                        attributes: []
                    }
                ],
                raw: true,
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    is_final_submitted: 1
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
                    [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
                ],
                order: [[sequelize.col('m_crop_variety.variety_code'), 'ASC']]
            }
            let getBspOneYears = await seedForProductionModel.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static getBspProformaOneVarietyBasicData = async (req, res) => {
        try {
            let { search } = req.body;
            let filter = await ConditionCreator.breederBspFormFilter(search);
            let condition = {
                include: [
                    {
                        model: userModel,
                        attributes: [],
                        include: [
                            {
                                model: agencyDetailModel,
                                attributes: []
                            }
                        ]
                    }
                ],
                raw: true,
                attributes: [
                    [sequelize.col('user->agency_detail.user_id'), 'id'],
                    [sequelize.col('user->agency_detail.agency_name'), 'bspc_name'],
                    [sequelize.col('seed_for_production.breeder_seed_to_use'), 'breeder_seed_available_qnt'],
                    [sequelize.col('seed_for_production.nucleus_seed_to_use'), 'nucleus_seed_available_qnt'],
                    [sequelize.col('seed_for_production.willing_to_produce'), 'willing_to_produce'],
                    [sequelize.col('seed_for_production.comment_id'), 'reason'],
                    [sequelize.col('seed_for_production.production_type'), 'production_type'],
                    [sequelize.col('seed_for_production.reason_for_delay'), 'reason_for_delay'],
                    [sequelize.col('seed_for_production.expected_date'), 'expected_date'],
                ],
                where: {
                    ...filter,
                    // willing_to_produce: 1,
                    is_final_submitted: 1

                },
                order: [[sequelize.col('user->agency_detail.user_id'), 'DESC']]
            };
            let varietyBasicData = await seedForProductionModel.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, varietyBasicData);
        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspProformaOneVarietyBasicDataSecond = async (req, res) => {
        try {
            let { search } = req.body;
            let userId;
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                userId = { user_id: req.body.loginedUserid.id }
            }
            let filter = await ConditionCreator.breederBspFormFilter(search);
            let condition = {
                include: [
                    {
                        model: userModel,
                        attributes: [],
                        include: [
                            {
                                model: agencyDetailModel,
                                attributes: []
                            }
                        ]
                    },
                    {
                        model: bspProformaOne,
                        attributes: [],
                        where: {
                            ...filter,
                            ...userId
                        }

                    }
                ],

                // 'breeder_seed_available_qnt', 'nucleus_seed_available_qnt',
                attributes: [
                    [sequelize.fn("DISTINCT", sequelize.col('bsp_proforma_1_bspcs.bspc_id')), 'id'],
                    [sequelize.col('user->agency_detail.agency_name'), 'bspc_name'],
                    [sequelize.col('user->agency_detail.state_id'), 'state_code']
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        {
                            target_qunatity: {
                                [Op.not]: 0
                            }
                        },
                        {
                            target_qunatity: {
                                [Op.not]: null
                            }
                        },

                        // {
                        //     id:sequelize.col('bsp_proforma_1_bspcs"."bspc_proforma_1_id')
                        // }
                    ],
                    [Op.or]: [
                        {
                            target_qunatity: {
                                [Op.not]: 'nan'
                            }
                        }
                    ]
                    // willing_to_produce: 1
                }

            };
            let varietyBasicData = await bspProformaOneBspc.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, varietyBasicData);
        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspMonitoringTeam = async (req, res) => {
        try {
            let { search } = req.body;
            let filters = await ConditionCreator.breederBspFormFilter(search);
            let stateCode;
            if (search && search.state_code) {
                stateCode = {
                    state_code: search.state_code
                }

            }
            let condition = {
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('monitoring_team_of_pdpcs.id')), 'id'],
                    [sequelize.col('monitoring_team_of_pdpcs.name'), 'team_name'],
                    [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_code'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_type'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'), 'desingnation_name']
                ],
                raw: true,
                include: [
                    {
                        model: monitoringTeamPdpcDetails,
                        attributes: [],
                        // where: {
                        //     ...stateCode,
                        // },
                        include: [
                            {
                                model: agencytypeModel,
                                attributes: []
                            },
                            {
                                model: stateModel,
                                attributes: []
                            },
                            {
                                model: districtModel,
                                attributes: []
                            },
                            {
                                model: designationModel,
                                attibute: []
                            }
                        ]
                    }
                ],
                where: {
                    ...filters,
                    ...stateCode
                }
            }
            let monitoringTeamData = await monitoringTeamOfPdpcsModel.findAll(condition);

            return response(res, status.DATA_AVAILABLE, 200, monitoringTeamData);
        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static sendMail = async (req) => {
        try {
            console.log('req.body', req)
            const { text, email, subject } = req;
            // console.log('process.env.EMAIL==',process.env.EMAIL);
            // console.log('process.env.PASSWORD==',process.env.PASSWORD);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });
            // email
            console.log(email);
            const mailOptions = {
                form: process.env.EMAIL,
                to: email,
                subject: subject,
                text: text,

            };
            await transporter.sendMail(mailOptions);
            // return response(res, 'Data sent successfully on Email', 200,{});
        } catch (error) {
            console.error("Error sending email:", error);
            // return response(res, status.UNEXPECTED_ERROR, 500, {});
        }
    }

    static addBspMonitoringTeam = async (req, res) => {
        try {
            let { team, year, season, crop_code, user_id, ref_no } = req.body;
            let userId;
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                userId = { user_id: req.body.loginedUserid.id }
            }
            let monitoringTeamData;
            if (team && team.length > 0 || team !== undefined) {
                team.forEach(async (ele) => {
                    monitoringTeamData = monitoringTeamAssignedToBspcsModel.build(
                        {
                            monitoring_team_of_pdpc_id: ele.team,
                            bspc_id: ele.id
                        }
                    );
                    monitoringTeamData.save();
                    let bspc_data = await agencyDetailModel.findOne({
                        include: [
                            {
                                model: userModel,
                                attribites: ['name', 'email_id']
                            }
                        ],
                        raw: true,
                        where: {
                            user_id: ele.id
                        }
                    });
                    let variety_data = await bspProformaOneBspc.findAll({
                        include: [
                            {
                                model: bspProformaOne,
                                attributes: [],
                                include: [{ model: varietyModel, attributes: [] }],
                                where: {
                                    season: season,
                                    year: year,
                                    crop_code: crop_code,
                                    ...userId
                                }
                            }
                        ],
                        attributes: [
                            [sequelize.col('bsp_proforma_1.crop_code'), 'crop_code'],
                            [sequelize.fn('STRING_AGG', sequelize.col('bsp_proforma_1->m_crop_variety.variety_name'), ','), 'aggregatedString']
                        ],
                        group: [
                            [sequelize.col('bsp_proforma_1.crop_code'), 'crop_code']
                        ],
                        raw: true,
                        where: {
                            bspc_id: ele.id,
                            isPermission: true
                        }
                    })

                    let crop_data = await cropModel.findOne({
                        attributes: ['crop_name'],
                        where: {
                            crop_code: crop_code
                        },
                        raw: true,
                    });


                    let season_data = await seasonModel.findOne({
                        attribites: ['season'],
                        where: {
                            season_code: season
                        },
                        raw: true
                    });

                    let userData = await agencyDetailModel.findOne({
                        attribites: ['agency_name', 'contact_person_name'],
                        where: {
                            ...userId
                        }
                    })
                    if (variety_data && variety_data.length) {
                        let incharge_name = userData && userData.contact_person_name ? userData.contact_person_name : 'NA';
                        let institute_name = userData && userData.agency_name ? userData.agency_name : 'NA';
                        const data = {
                            email: bspc_data['users.email_id'],
                            subject: 'Regarding permission for B/S to B/S production',
                            // text: `Hi ${bspc_data.contact_person_name},${bspc_data['users.name']} has been assigned to produce varieties of ${crop_data.crop_name} for ${season_data.season} ${year}-${(year - 2000) + 1}. Please confirm your willingness by filling the "Add Nucleus/Breeder seed quantity willing to use for production" form on the SATHI portal within 7 days.`
                            text: `Dear Sir/Madam,\n\nThis is to inform you that your BSPC has been granted the permission for B/S to B/S production of the following ${crop_data.crop_name} varieties: ${variety_data && variety_data[0] && variety_data[0].aggregatedString} for the Year of Indent ${year}-${(year - 2000) + 1} and Season ${season_data.season}. Kindly ensure to fill out the production schedule accordingly.\n\nThank you,\n${incharge_name}\n${institute_name}
                           ` // Email body
                        }

                        if (data || data !== undefined) {
                            this.sendMail(data);
                        }
                    }
                });
            }
            if (monitoringTeamData) {
                let updateStatus = bspProformaOne.update({ is_final_submit: 1, ref_no: ref_no }, {
                    where: {
                        year: year,
                        season: season,
                        crop_code: crop_code,
                        user_id: user_id
                    }
                })
                return response(res, status.DATA_SAVE, 200, []);
            } else {
                return response(res, status.DATA_NOT_SAVE, 201, []);
            }
        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }


    static checkBspOneVarietyAvailability = async (req, res) => {
        try {
            let { crop_code, variety_code, year, season, user_id } = req.body;
            let assignVarietyCount = await bspProformaOne.findAll({ where: { is_final_submit: 1, crop_code: crop_code, year: year, season: season, user_id: user_id } });
            if ((assignVarietyCount && assignVarietyCount.length > 0)) {
                return response(res, "Submit disable", 200, [{ isDisable: "true" }]);
            } else {
                return response(res, "Submit Enable", 200, [{ isDisable: "false" }]);
            }
        } catch (error) {
            console.log('error', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspProformaOneVarietyLineData = async (req, res) => {
        try {
            let breederId;
            if (req.body && req.body.search && req.body.search.user_type == "bspc") {
            } else {
                breederId = {
                    breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
                }
            }
            let { search } = req.body;
            let filters = await ConditionCreator.breederBspFormFilter(search);
            let assignCropVarietyData = await assignCropNewFlow.findAll({
                attributes: ['variety_code', 'variety_line_code'], where: { ...filters }, raw: true
            });
            let varietyCode = [];
            let varietyLineCode = [];
            if (assignCropVarietyData && assignCropVarietyData.length) {
                assignCropVarietyData.forEach(ele => {
                    varietyCode.push(ele.variety_code);
                    if (ele.variety_line_code && ele.variety_line_code != null && ele.variety_line_code != undefined) {
                        varietyLineCode.push(ele.variety_line_code);
                    }
                })
            }
            let varietyCodeValue;
            if (varietyLineCode && varietyLineCode.length > 0) {
                varietyCodeValue = {
                    line_variety_code: {
                        [Op.notIn]: varietyLineCode
                    }
                }
            }
            // else {
            //   return response(res, status.DATA_NOT_AVAILABLE, 201, returnResponse);
            // }
            if (req.body && req.body.search && req.body.search.variety_code) {
                varietyCode = {
                    variety_code: req.body.search.variety_code
                }
            }
            if (varietyLineCode && varietyLineCode.length > 0) {
                let condition = {
                    include: [
                        {
                            required: true,
                            model: cropModel,
                            raw: true,
                            required: true,
                            attributes: [],
                            where: {
                                ...breederId
                            }
                        },
                        {
                            model: indentOfBrseedLines,
                            attributes: [],
                            required: true,
                            include: [
                                {
                                    model: mVarietyLines,
                                    attributes: [],
                                    where: {
                                        [Op.or]: [
                                            { ...varietyCodeValue }
                                        ]

                                    }
                                }
                            ]
                        },
                    ],
                    attributes: [
                        [sequelize.fn("DISTINCT", sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_code')), 'line_variety_code'],
                        [sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_name'), 'line_variety_name']
                    ],
                    raw: true,
                    where: {
                        ...filters,
                    }
                }
                let mVarietyLinesDta = await indentorBreederSeedModel.findAll(condition);
                let returnResponse = mVarietyLinesDta
                return response(res, status.DATA_AVAILABLE, 200, returnResponse);
            } else {
                let condition = {
                    include: [
                        {
                            required: true,
                            model: cropModel,
                            raw: true,
                            required: true,
                            attributes: [],
                            where: {
                                ...breederId
                            }
                        },
                        {
                            model: indentOfBrseedLines,
                            attributes: [],
                            required: true,
                            include: [
                                {
                                    model: mVarietyLines,
                                    attributes: [],
                                    where: {
                                        // ...varietyCodeValue
                                    }
                                }
                            ]
                        },
                    ],
                    attributes: [
                        [sequelize.fn("DISTINCT", sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_code')), 'line_variety_code'],
                        [sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_name'), 'line_variety_name']
                    ],
                    raw: true,
                    where: {
                        ...filters
                    }
                }
                let mVarietyLinesDta = await indentorBreederSeedModel.findAll(condition);
                let returnResponse = mVarietyLinesDta
                return response(res, status.DATA_AVAILABLE, 200, returnResponse);
            }

        } catch (error) {
            console.log('error====', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspProformaOneVarietyLineDataSecond = async (req, res) => {
        try {
            let varietyCode;
            if (req.body && req.body.variety_code) {
                varietyCode = {
                    variety_code: req.body.variety_code
                }
            }
            let condition = {
                where: {
                    ...varietyCode
                }
            }
            let mVarietyLinesDta = await mVarietyLines.findAll(condition);
            let returnResponse = mVarietyLinesDta
            return response(res, status.DATA_AVAILABLE, 200, returnResponse);


        } catch (error) {
            console.log('error====', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static getBspProformaOneVarietyLineNewData = async (req, res) => {
        try {
            let { variety_code } = req.body;
            let filters = await ConditionCreator.breederBspFormFilter(req.body);
            let assignCropVarietyData = await bspProformaOne.findAll({
                attributes: ['variety_code', 'variety_line_code'], where: { ...filters }, raw: true
            });
            let varietyCode = [];
            let varietyLineCode = [];
            if (assignCropVarietyData && assignCropVarietyData.length) {
                assignCropVarietyData.forEach(ele => {
                    varietyCode.push(ele.variety_code);
                    if (ele.variety_line_code && ele.variety_line_code != null && ele.variety_line_code != undefined) {
                        varietyLineCode.push(ele.variety_line_code);
                    }
                })
            }
            let varietyCodeValue;
            if (varietyLineCode && varietyLineCode.length > 0) {
                varietyCodeValue = {
                    variety_line_code: {
                        [Op.notIn]: varietyLineCode
                    }
                }
            }
            // else {
            //   return response(res, status.DATA_NOT_AVAILABLE, 201, returnResponse);
            // }
            if (req.body && req.body.variety_code) {
                varietyCode = {
                    variety_code: req.body.variety_code
                }
            }
            if (varietyLineCode && varietyLineCode.length > 0) {
                let condition = {
                    include: [
                        {
                            model: mVarietyLines,
                            attributes: [],
                            required: true,
                        }
                    ],
                    attributes: [
                        [sequelize.fn("DISTINCT", sequelize.col('m_variety_line.line_variety_code')), 'line_variety_code'],
                        [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
                        'variety_line_code',
                    ],
                    required: true,
                    raw: true,
                    where: {
                        ...filters,
                        ...varietyCode,
                        ...varietyCodeValue
                    }
                }
                let mVarietyLinesDta = await seedForProductionModel.findAll(condition);
                let returnResponse = mVarietyLinesDta
                return response(res, status.DATA_AVAILABLE, 200, returnResponse);
            } else {
                let condition = {
                    include: [
                        {
                            model: mVarietyLines,
                            attributes: [],
                            required: true,
                        }
                    ],
                    attributes: [
                        [sequelize.fn("DISTINCT", sequelize.col('m_variety_line.line_variety_code')), 'line_variety_code'],
                        [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
                        'variety_line_code',
                    ],
                    required: true,
                    raw: true,
                    where: {
                        ...filters,
                        ...varietyCode
                    }
                }
                let mVarietyLinesDta = await seedForProductionModel.findAll(condition);
                let returnResponse = mVarietyLinesDta
                return response(res, status.DATA_AVAILABLE, 200, returnResponse);
            }

        } catch (error) {
            console.log('error====', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static getBspProformaOneVarietyLineDataNewSecond = async (req, res) => {
        try {
            let varietyCode;
            if (req.body && req.body.variety_code) {
                varietyCode = {
                    variety_code: req.body.variety_code
                }
            }
            let condition = {
                include: [
                    {
                        model: mVarietyLines,
                        attributes: [],
                        required: true,
                    }
                ],
                attributes: [
                    [sequelize.fn("DISTINCT", sequelize.col('m_variety_line.line_variety_code')), 'line_variety_code'],
                    [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'], 'variety_line_code',
                ],
                required: true,
                raw: true,
                where: {
                    ...varietyCode
                }
            }
            let mVarietyLinesDta = await seedForProductionModel.findAll(condition);
            let returnResponse = mVarietyLinesDta
            return response(res, status.DATA_AVAILABLE, 200, returnResponse);


        } catch (error) {
            console.log('error====', error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }

    static checkReportRuningNumber = async (req, res) => {
        try {
            const { report_type, year, season } = req.body;
            let condition = {
                // attributes:['running_number'],
                where: {
                    report_name: report_type,
                    year: year,
                    season: season
                }
            };

            let reportStatusData = await reportStatus.findOne(condition);
            // console.log('reportStatus===',reportStatusData);
            if (reportStatusData) {
                return response(res, status.DATA_AVAILABLE, 200, reportStatusData);
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 201, []);
            }

        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static updateReportRuningNumber = async (req, res) => {
        try {
            const { report_type, next_val, year, season, isCreate } = req.body;
            if (isCreate && isCreate !== null) {
                console.log('isCreate=========', isCreate);
                let reportDataSave = reportStatus.build({ running_number: next_val, year: year, season: season, report_name: report_type });
                reportDataSave.save();
                return response(res, status.DATA_SAVE, 200, []);
            } else {
                let reportStatusData = await reportStatus.update({ running_number: next_val }, { where: { report_name: report_type } });
                return response(res, status.DATA_UPDATED, 200, []);
            }

        } catch (error) {
            console.log(error);
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
    static generateReferenceNumber = async (req, res) => {
        try {
            let condition = {
                where: {
                    year: req.body.search.year,
                    season: req.body.search.season,
                    report_name: req.body.search.report_name
                },
                raw: true,

            }

            // condition.order = [[sequelize.col('m_states.state_name'), 'ASC']];
            //   if (req.body.search) {
            //     if (req.body.search.year) {
            //       condition.where.year = (req.body.search.year);
            //     }
            //     if (req.body.search.season) {
            //       condition.where.season = (req.body.search.season);
            //     }
            //     if (req.body.search.report_name) {
            //       condition.where.report_name = req.body.search.report_name;
            //     }
            //     if (req.body.search.variety_code) {
            //       condition.where.variety_code = {
            //         [Op.in]: req.body.search.variety_code
            //       };
            //     }
            //     if (req.body.search.user_id) {
            //       condition.where.user_id = (req.body.search.user_id);
            //     }
            //   }
            let dataValue;
            let data = await reportStatus.findAll(condition);
            if (data && data.length < 1) {
                const dataRow = {
                    year: req.body.search.year,
                    season: req.body.search.season,
                    report_name: req.body.search.report_name,
                    running_number: 1
                }
                const responses = await reportStatus.create(dataRow);
                if (responses) {
                    return response(res, status.DATA_SAVE, 200, responses);
                } else {
                    return response(res, status.DATA_NOT_SAVE, 400, responses);
                }
            } else {

                dataValue = await reportStatus.update({
                    year: req.body.search.year,
                    season: req.body.search.season,
                    report_name: req.body.search.report_name,
                    running_number: data && data[0] && data[0].running_number ? (parseInt(data[0].running_number) + 1) : 0
                }, {
                    where: {
                        year: req.body.search.year,
                        season: req.body.search.season,
                        report_name: req.body.search.report_name,
                    }
                }

                );
                if (dataValue) {
                    let datas = await reportStatus.findAll({
                        where: {
                            year: req.body.search.year,
                            season: req.body.search.season,
                            report_name: req.body.search.report_name,
                        }, raw: true
                    });
                    return response(res, status.DATA_SAVE, 200, datas);
                } else {
                    return response(res, status.DATA_NOT_SAVE, 200, dataValue);
                }
            }


        }
        catch (error) {
            console.log(error)
            return response(res, status.DATA_NOT_AVAILABLE, 500, error);
        }
    }
}
module.exports = BspcProfarmaOne
