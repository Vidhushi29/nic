require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const stateModel = db.stateModel;


const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
class UserController {

  static addState = async (req, res) => {
    const data = stateModel.build({
      name: req.body.name,
      state_code: req.body.state_code
    });
    await data.save();

    if (data) {
      return response(res, status.DATA_SAVE, 200, data)
    } else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static viewState = async (req, res) => {
    try {
      var data = {}
      data = await stateModel.findAll({
        raw: true
      });

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getAllState = async (req, res) => {
    try {
      var data = {}
      let id = req.body.id;
      let filter = await ConditionCreator.masterFilter(req.body);
      console.log(filter)

      if (id) {
        data = await stateModel.findAll({
          //     include: [
          //         {
          //         model:stateModel,
          //         attributes: []
          //     },
          // ],
          attributes: ['*',
            // [sequelize.col('districts.id'),'id'],
            [sequelize.col('states.id'), 'id'],
            [sequelize.col('states.name'), 'state_name'],
            [sequelize.col('states.state_code'), 'state_code'],
            // [sequelize.col('districts.district_name'),'district_name'],
            // [sequelize.col('districts.district_code'),'district_code']
          ],
          where: { ...filter },
          raw: false,
          where: {
            id: id
          }
        });

      } else {
        data = await stateModel.findAll({
          // include: [
          //     {
          //     model:stateModel,
          //     attributes: []
          // },
          // ],
          attributes: ['*',
            // [sequelize.col('districts.id'),'id'],
            [sequelize.col('states.id'), 'id'],
            [sequelize.col('states.name'), 'state_name'],
            [sequelize.col('states.state_code'), 'state_code'],
            // [sequelize.col('districts.district_name'),'district_name'],
            // [sequelize.col('districts.district_code'),'district_code']
          ],
          where: { ...filter },
          raw: false,
        });
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static editState = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await stateModel.update({
        name: req.body.name,
        state_code: req.body.state_code
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
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static deleteState = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await stateModel.destroy({
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_DELETED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
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
  
}
module.exports = UserController


