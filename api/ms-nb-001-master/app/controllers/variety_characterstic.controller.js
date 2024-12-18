require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const paginateResponse = require("../_utility/generate-otp");
let Validator = require('validatorjs');
const masterHelper = require('../_helpers/masterhelper')
const JWT = require('jsonwebtoken')
const e = require('express');
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
class varietyCharacterstic {

  static getAgroEcologicalRegionsStateWise = async (req, res) => {
    try {
      let condition ={
        include:[
          {
            model:db.mAgroLogicalRegionstatesModel,
            where:{},
            include:[
              {
                model:db.stateModel
              }
            ]
          }
        ],
        attributes: ['id', 'regions_name',
          [sequelize.col('"m_agro_logical_region_state.state_code'),'state_code'],
          [sequelize.col('m_agro_logical_region_state->m_state.state_short_name'),'state_short_name'],
          [sequelize.col('m_agro_logical_region_state->m_state.state_name'),'state_name'],
        ],
        nest:true,
        raw:true
      }
      if(req.body){
        if(req.body.state_code && req.body.state_code.length){
          condition.include[0].where.state_code = {[Op.in]:req.body.state_code} 
        }
      }
      let agroData = await db.mAgroEcologicalRegionsModel.findAll(condition);
      if (agroData) {
        return response(res, status.DATA_AVAILABLE, 200, agroData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getMuturityDays = async (req, res ) => {
    try {
      let muturityDaysData = await db.mMatuarityDaysModel.findAll({
        attributes: ['id','days']
      });
      if (muturityDaysData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, muturityDaysData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCimateResilience = async (req, res ) => {
    try {
      let cimateResilienceData = await db.mClimateResiliencesModel.findAll({
        attributes: ['id','name']
      });
      if (cimateResilienceData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, cimateResilienceData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getReactionToMajorDiseasesData = async (req, res ) => {
    try {
      let reactionToMajorDiseasesData = await db.mReactionToMajorDiseasesModel.findAll({
        attributes: ['id','name']
      });
      if (reactionToMajorDiseasesData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, reactionToMajorDiseasesData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getReactionToMajorInsectPestsData = async (req, res ) => {
    try {
      let reactionToMajorInsectPestsData = await db.mReactionToMajorInsectPestsModel.findAll({
        attributes: ['id','name']
      });
      if (reactionToMajorInsectPestsData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, reactionToMajorInsectPestsData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getStateByBspc = async (req, res ) => {
    try {
      let bspc_id ;
      if(req.body && req.body.bspc_id){
        bspc_id = {
          id:req.body.bspc_id
        }
      }
      let agencyDetailData = await db.agencyDetailModel.findAll({
        include:[
          {
            model:db.stateModel,
            attribute:['state_name','state_code']
          }
        ],
        attributes: ['id','user_id','state_id'],
        where:{
          ...bspc_id
        },
        order:[['id','ASC']]
      });
      if (agencyDetailData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, agencyDetailData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
}
module.exports = varietyCharacterstic


