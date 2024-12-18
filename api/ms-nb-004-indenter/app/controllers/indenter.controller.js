require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const indenterModel = db.indenterModel;
const agencyDetailModel = db.agencyDetailModel
const userModel = db.userModel
const stateModel = db.stateModel;
const seasonModel = db.seasonModel;


const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const cropGroupModel = db.cropGroupModel;
const paginateResponse = require("../_utility/generate-otp");
const { cropModel } = require('../models');
const { raw } = require('body-parser');
// const { cropVerietyModel } = require('../../../ms-nb-005-seed-division-center/app/models');
const cropVerietyModel = db.cropVerietyModel;

const breederCropModel = db.breederCropModel;
const varietyModel = db.varietyModel;
const allocationBreederProdModel = db.allocationBreederProdModel;
const bsp1Model = db.bsp1Model;
const bsp5bModel = db.bsp5bModel;
const allocationToIndentor = db.allocationToIndentor;
const indentOfSpaModel = db.indentOfSpa;
const cropDataModel = db.cropModel
const districtModel = db.districtModel
const allocationToIndentorLiftingSeedsModel = db.allocationToIndentorLiftingSeedsModel;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed;
const allocationToIndentorSeed = db.allocationToIndentorSeed;

class IndenterController {

  // static breederSeedssubmision = async (req, res) => {
  //   try {
  //     // console.log('req======>', req.body); return;
  //     console.log('req======>', req.body.cropName.name);
  //     let cropType = '';
  //     if (req.body) {
  //       if (req.body.cropName) {
  //         if ((req.body.cropName.value).slice(0, 1) == 'A') {
  //           cropType = 'agriculture';
  //         } else if ((req.body.cropName.value).slice(0, 1) == 'H') {
  //           cropType = 'horticulture'
  //         } else {
  //           cropType = "";
  //         }
  //       }
  //     }
  //     //   let varitData = await indenterModel.findAll({
  //     //     where: {
  //     //       [Op.and]: [{ year: req.body.yearofIndent.value }],
  //     //       // is_active: 1
  //     //     }
  //     // });


  //     // if ((varitData && varitData.length )) {
  //     //   const errorResponse = {
  //     //     inValid: true
  //     //   }
  //     //   return response(res, status.USER_EXISTS, 409, errorResponse)
  //     // }

  //     //  else{
  //     const existingData = await breederCropModel.findOne(
  //       {
  //         where: {
  //           crop_code: req.body.cropName.value,
  //         },
  //         row: true
  //       }
  //     );
  //     // console.log("iiiiiiiiiiiiiiiiiexistingData", existingData);
  //     if (existingData) {
  //       //  console.log("uuuuuuuuuuuuuuuuuta");
  //       const allocationDataRow = {
  //         breeder_id: existingData.user_id,
  //         // available_nucleus_seed: element.available_nucleus_seed,
  //         crop_code: req.body.cropName.value,// done
  //         variety_id: req.body.varietyName.value,// done
  //         user_id: 1, //Default userid
  //         year: req.body.yearofIndent.value,// done
  //         is_active: 1,
  //         allocate_nucleus_seed: req.body.indentQuantity, // done
  //         agency_id: 210 //Default agency id
  //       };

  //       const newData = await allocationBreederProdModel.build(allocationDataRow);
  //       await newData.save();

  //       let yearVariety = new Date(req.body.varietyName.createdAt);
  //       const dataRow = {
  //         year: req.body.yearofIndent.value,
  //         crop_type: cropType,
  //         season: req.body.season.value,
  //         variety_id: req.body.varietyName.value,
  //         variety_notification_year: yearVariety.getUTCFullYear(),
  //         indent_quantity: req.body.indentQuantity,
  //         user_id: req.body.userId || 1,
  //         unit: req.body.unitKgQ.value,
  //         updated_at: '',
  //         crop_code: req.body.cropName.value,
  //         crop_name: req.body.cropName.name,
  //         group_name: req.body.cropGroup.group_name,
  //         group_code: req.body.cropGroup.group_code
  //       };
  //       // console.log("check",dataRow);

  //       let tabledAlteredSuccessfully = false;
  //       if (req.params && req.params["id"]) {
  //         const existingData = await indenterModel.findAll({
  //           where: {
  //             year: req.body.yearofIndent.value,
  //             crop_name: req.body.cropName.name,
  //             group_name: req.body.cropGroup.name,
  //             group_code: req.body.cropGroup.value,
  //             crop_code: req.body.varietyName.crop_code,
  //             variety_id: req.body.varietyName.value.toString(),
  //             user_id: req.body.userId || 1,
  //             id: {
  //               [Op.ne]: req.params.id
  //             }
  //           }
  //         });

  //         if (existingData === undefined || existingData.length < 1) {
  //           await indenterModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
  //             tabledAlteredSuccessfully = true;
  //           }).catch(function (err) {
  //             console.log("error", err)
  //           });
  //         }
  //       }
  //       else {
  //         const existingData = await indenterModel.findAll(
  //           {
  //             where: {
  //               year: req.body.yearofIndent.value,
  //               crop_name: req.body.cropName.name,
  //               group_name: req.body.cropGroup.group_name,
  //               group_code: req.body.cropGroup.group_code,
  //               crop_code: req.body.cropName.value,
  //               variety_id: req.body.varietyName.value.toString(),
  //               user_id: req.body.userId || 1
  //             }
  //           }
  //         );
  //         if (existingData === undefined || existingData.length < 1) {
  //           const data = indenterModel.build(dataRow);
  //           await data.save();
  //           console.log(tabledAlteredSuccessfully);
  //           tabledAlteredSuccessfully = true;
  //         }
  //       }
  //       if (tabledAlteredSuccessfully) {

  //         return response(res, status.DATA_SAVE, 200, {})
  //       } else {
  //         return response(res, status.DATA_NOT_AVAILABLE, 404)
  //       }
  //       // }
  //     } else {
  //       return response(res, "Breeder not found for this crop", 405)
  //     }
  //   }
  //   catch (error) {
  //     console.log("error", error)
  //     return response(res, status.DATA_NOT_SAVE, 500)
  //   }
  // }
  static breederSeedssubmision = async (req, res) => {
    try {
      // console.log('req======>', req.body); return;
      // console.log('req======>', req.body.cropName.name);
      let cropType = '';
      let unitKgQ = '';
      if (req.body) {
        if (req.body.cropName) {
          if ((req.body.cropName).slice(0, 1) == 'A') {
            cropType = 'agriculture';
            unitKgQ = 'quintal';
          } else if ((req.body.cropName).slice(0, 1) == 'H') {
            cropType = 'horticulture';
            unitKgQ = 'kilogram';
          } else {
            cropType = "";
          }
        }
      }
      //   let varitData = await indenterModel.findAll({
      //     where: {
      //       [Op.and]: [{ year: req.body.yearofIndent.value }],
      //       // is_active: 1
      //     }
      // });


      // if ((varitData && varitData.length )) {
      //   const errorResponse = {
      //     inValid: true
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }

      //  else{
      const existingData = await cropModel.findOne(
        {

          // attribute: ['id', 'botanic_name', 'crop_code', 'crop_group', 'crop_name', 'group_code', 'season', 'srr', 'breeder_id', 'is_active', 'created_at', 'updated_at', 'createdAt'],
          where: {
            crop_code: req.body.cropName,
            breeder_id: {
              [Op.not]: null,
            },
          },
          row: true
        }
      );

      console.log('existingData===============', existingData);
      if (existingData) {
        req.body.variety_items.forEach(async (items) => {
          const allocationDataRow = {
            breeder_id: existingData.breeder_id,
            // available_nucleus_seed: element.available_nucleus_seed,
            crop_code: req.body.cropName,// done
            variety_id: items.varietyName.id,// done//**************** */
            user_id: req.body.user_id, //Default userid
            year: req.body.yearofIndent,// done
            is_active: 1,
            allocate_nucleus_seed: items.indentQuantity, // done//************* */
            agency_id: req.body.agency_id //Default agency id
          };
          const newData = await allocationBreederProdModel.build(allocationDataRow);
          await newData.save();

        });

        var tabledAlteredSuccessfully = false;
        req.body.variety_items.forEach(async (items) => {
          const dataRow = {
            year: req.body.yearofIndent,
            crop_type: cropType,
            season: req.body.season,
            variety_id: items.varietyName.id,
            variety_notification_year: items.varietyNotificationYear,
            indent_quantity: items.indentQuantity,
            user_id: req.body.user_id,
            unit: unitKgQ,
            updated_at: '',
            crop_code: req.body.cropName,
            crop_name: req.body.crop_name,
            group_name: req.body.group_name,
            group_code: req.body.cropGroup
          };


          if (req.params && req.params["id"]) {
            const existingData = await indenterModel.findAll({
              where: {
                year: req.body.yearofIndent,
                // crop_name: req.body.crop_name,
                // group_name: req.body.group_name,
                group_code: req.body.cropGroup,
                crop_code: req.body.cropName,
                variety_id: items.varietyName.id,
                user_id: req.body.user_id,
                id: {
                  [Op.ne]: req.params.id
                }
              }
            });

            if (existingData === undefined || existingData.length < 1) {
              await indenterModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
                tabledAlteredSuccessfully = true;
              }).catch(function (err) {
                console.log("error", err)
              });
            }
          }
          else {
            const existingData = await indenterModel.findAll(
              {
                where: {
                  year: req.body.yearofIndent,
                  // crop_name: req.body.crop_name,
                  season: req.body.season,
                  group_code: req.body.cropGroup,
                  crop_code: req.body.cropName,
                  variety_id: items.varietyName.id,
                  user_id: req.body.user_id
                }
              }
            );
            // console.log('exitdata===============',existingData);
            if (existingData === undefined || existingData.length < 1) {
              const data = indenterModel.build(dataRow);
              await data.save();
              console.log(tabledAlteredSuccessfully);
              tabledAlteredSuccessfully = true;
            }
          }

        });
        // 
        if (tabledAlteredSuccessfully || 1) {

          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }
        // }
      } else {
        return response(res, "Breeder not found for this crop", 405)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static getBreederSeedssubmisionWithId = async (req, res) => {
    try {
      const data = await indenterModel.findAll({
        include: [{
          model: varietyModel
        }],
        where: {
          id: req.params.id
        }
      });
      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data[0]);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }


  static getBreederSeedsSubmisionList = async (req, res) => {
    try {
      let returnResponse = {};
      let agencyDetailCondition = {
        model: db.agencyDetailModel,
        where: {
          is_active: '1'
        }
      };


      let userCondition = {
        model: db.userModel,
        attributes: [],
        where: {
          is_active: '1',
          //  user_type: 'IN'
        }
      };
      let condition = {
        distinct: true,
        include: [
          {
            model: db.cropModel,
            order: []
          },
          {
            model: db.varietyModel,
            order: []
          },
          userCondition,
          agencyDetailCondition,
          //  userCondition,
          //           {
          // order: [['id', 'ASC']]
          // }
        ],
        where: {

        },
        order: [['id', 'DESC']]
      }

      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
        // set pageSize to -1 to prevent sizing pageSize = 10;

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }

      }

      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          else if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          else if (element.columnNameInItemList.toLowerCase() == "agency_id") {
            agencyDetailCondition.where["id"] = element.value;
          }
          else if (element.columnNameInItemList.toLowerCase() == "agencies_id") {
            agencyDetailCondition.where["id"] = {
              [Op.in]: element.value
            };
          }
          else {
            condition.where[element.columnNameInItemList] = element.value;
          }
        }
        if (req.body.search.year) {
          condition.where["year"] = req.body.search.year;
        }
        if (req.body.search.crop_code) {
          condition.where["crop_code"] = req.body.search.crop_code;
          condition.order = [['variety_name', 'ASC']];
        }
        if (req.body.search.season) {
          condition.where["season"] = req.body.search.season;
        }
        if (req.body.search.variety_name) {
          condition.where["variety_id"] = req.body.search.variety_name;
        }
        if (req.body.search.id) {
          condition.where["user_id"] = req.body.search.id;
        }
      } else {
        condition.order = [['id', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
          condition.order = [['variety_name', 'ASC']];
        }
      } else {
        condition.order = [['id', 'DESC']];
      }


      // condition.order = [['year', 'ASC']];
      let data = await indenterModel.findAndCountAll(condition);
      ;
      // returnResponse = await paginateResponse(data, page, pageSize);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }


  static deleteBreederSeedssubmisionWithId = async (req, res) => {
    try {
      indenterModel.destroy({
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

  static test = async (req, res) => {
    try {
      response(res, "Api Working fine", 200, "Success")
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static IndentorCropGroup = async (req, res) => {
    let data = {};
    try {
      let condition = {
        //     include: [
        //         {
        //         model:stateModel,
        //         attributes: []
        //     },
        // ],
        where: {

        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'group_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
      }
      data = await cropGroupModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static IndentorCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search.view) {
        condition = {
          //     include: [
          //         {
          //         model:stateModel,
          //         attributes: []
          //     },
          // ],
          where: {

          }
        };
      }
      else {
        condition = {
          //     include: [
          //         {
          //         model:stateModel,
          //         attributes: []
          //     },
          // ],
          where: {
            is_active: 1

          }
        };
      }
      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
      }
      data = await cropModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static IndentorDashboardCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        //     include: [
        //         {
        //         model:stateModel,
        //         attributes: []
        //     },
        // ],
        where: {

        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
      }
      data = await cropModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static IndentorDashboardVarietyName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        //     include: [
        //         {
        //         model:stateModel,
        //         attributes: []
        //     },
        // ],
        where: {

        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        // if (req.body.search.group_code) {
        //   condition.where.group_code = req.body.search.group_code;
        // }
      }
      data = await varietyModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getIndenterDetails = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      // if (req.body.search.year && req.body.search.season) {
      condition = {
        include: [
          {
            model: cropModel,
            attributes: ['id', 'crop_code', 'crop_name'],
            left: true
          },
          {
            model: varietyModel,
            attributes: ['id', 'variety_code', 'variety_name'],
            left: true
          },
          {
            model: bsp5bModel,
            attributes: ['id'],
            left: true
          },
          {
            model: bsp1Model,
            attributes: ['id'],
            left: true
          }
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      // }else{
      //   condition = {
      //     include: [
      //       {
      //         model:bsp5bModel,
      //         attributes: ['id'],
      //         left:true
      //       },
      //       {
      //         model:bsp1Model,
      //         attributes: ['id'],
      //         left:true
      //       }
      //     ],
      //     attributes:['year'],
      //     where: {
      //       user_id:req.body.search.user_id,
      //       crop_code:{
      //         [Op.like]:req.body.search.crop_type+'%'
      //       }
      //     }
      //   };
      // }
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
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety) {
          condition.where.variety_id = req.body.search.variety;
        }
        if (req.body.search.graphType == "indenter") {
          if (req.body.search.user_id) {
            condition.where.user_id = req.body.search.user_id;
          }
        }

      }
      data = await indenterModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCountData = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
            [sequelize.literal("COUNT(DISTINCT(variety_id))"), "variety_id"],
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"],
          ],
          where: {
            user_id: req.body.search.user_id,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
            [sequelize.literal("COUNT(DISTINCT(variety_id))"), "variety_id"],
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"],
          ],
          where: {
            user_id: req.body.search.user_id,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      // // const sortOrder = req.body.sort ? req.body.sort : 'year';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];
      // if (req.body.search) {
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_data && req.body.search.crop_data !== undefined && req.body.search.crop_data.length > 0) {
          condition.where.crop_code = {
            [Op.and]: {
              [Op.in]: req.body.search.crop_data
            }
          }
        }
      }
      // }
      data = await indenterModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  // static getTotalLiftedCount = async (req, res) => {
  //   let data = {};
  //   try {
  //     let condition = {
  //       include:[
  //         {
  //           model:indenterModel,
  //           attributes:[],
  //           where: {
  //             user_id:req.body.search.user_id,
  //             crop_code:{
  //               [Op.like]:req.body.search.crop_type+'%'
  //             }
  //           }
  //         }
  //       ],
  //       attributes:[
  //             // [sequelize.fn('sum', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')),'quantity']
  //             'quantity'
  //       ],
  //       where:{

  //       },
  //       row:true
  //     };
  //     data = await allocationToIndentor.findAll(condition);
  //     let qt = [];
  //     let total = 0;
  //     if(data.length != 0){
  //       data.forEach(element => {
  //         qt.push(element.dataValues.quantity);
  //       });
  //       total = qt.reduce(function (curr, prev) { return curr + prev; });
  //     }
  //     response(res, status.DATA_AVAILABLE, 200, total);
  //   } catch (error) {
  //     console.log(error)
  //     response(res, status.DATA_NOT_AVAILABLE, 500)
  //   }
  // }

  static getTotalLiftedCount = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp5bModel,
            attributes: [],
            required: true
          },
        ],
        attributes: [
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }
      }
      condition.group = [['crop_name']];
      data = await indenterModel.findAll(condition);
      // let qt = [];
      // let total = 0;
      // if(data.length != 0){
      //   data.forEach(element => {
      //     qt.push(element.dataValues.lifting_quantity);
      //   });
      //   total = qt.reduce(function (curr, prev) { return curr + prev; });
      // }
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartIndentData = async (req, res) => {
    // let data = [];
    try {
      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          {
            model: bsp5bModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
          [sequelize.col('indent_of_breederseeds.crop_name'), 'crop_name'],
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }

        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = req.body.search.crop_code
        // }
      }
      condition.group = [
        ['crop_name'],
        [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']];
      let data = await indenterModel.findAll(condition);

      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }

      if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },

        })
      }

      let AllocatedData = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            // where: {
            //   is_report_pass: true
            // }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
        ],
        where: {
          [Op.and]: filterData ? filterData : []
        },
        raw: true,
        group: [[sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')]],
      });

      // AllocatedData.forEach(elem => {
      //   data.forEach((ele, i) => {
      //     console.log(ele,'eleele')
      //     if (ele.crop_code == elem.crop_code) {
      //       data[i].allocated = elem.allocated ? elem.allocated : 0
      //     }

      //   })
      // })

      data.forEach((ele, i) => {
        data.allocated = 0;
        if (AllocatedData && AllocatedData !== undefined && AllocatedData.length > 0) {
          AllocatedData.forEach((elem) => {
            if (ele.crop_code == elem.crop_code) {
              data[i].allocated = elem.allocated ? elem.allocated : 0;
            }
          })
        }
      });

      if (data && data !== undefined && data.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 500)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static getChartDataByCrop = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: bsp5bModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_name')), 'variety_name'],
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [['indent_of_breederseeds.crop_name'], ['m_crop_variety.variety_name']];
      data = await indenterModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attribute: ['id', 'variety_code', 'variety_name']
          }
        ],
        attributes: ['id', 'variety_id'],
        where: {
          crop_code: req.body.search.crop_code,
          user_id: req.body.search.user_id
        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      data = await indenterModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static IndentoryearList = async (req, res) => {
    try {
      let returnResponse = {};



      let condition = {
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ],
        distinct: true,
        where: {
          user_id: req.body.loginedUserid.id
        }
      }


      // condition.order = [['year', 'ASC']];
      let data = await indenterModel.findAndCountAll(condition);
      ;
      // returnResponse = await paginateResponse(data, page, pageSize);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static IndentorSeasonList = async (req, res) => {
    try {
      let returnResponse = {};
      let condition = {
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],
        ],
        // distinct: true,
        where: {
          year: req.body.search.year
        }
      }
      if (req.body.search) {
        if (req.body.search.user_id) {
          condition.where.user_id = req.body.loginedUserid.id;
          // user_id: req.body.loginedUserid.id
        }
      }

      // condition.order = [['year', 'ASC']];
      let data = await indenterModel.findAndCountAll(condition);
      ;
      // returnResponse = await paginateResponse(data, page, pageSize);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static IndentorCropNameList = async (req, res) => {
    try {
      let returnResponse = {};



      let condition = {
        include: [{
          model: cropModel,

        },

        ],


        // distinct: true,
        where: {
          year: parseInt(req.body.search.year),
          season: req.body.search.season

        }

      }

      if (req.body.search) {
        if (req.body.search.year) {
          console.log(req.body.search.year);
          condition.where.year = parseInt(req.body.search.year);
          // season = req.body.search.season
        }
        if (req.body.search.year) {
          // condition.include[0].where={}
          condition.where.season = req.body.search.season;
        }

      }
      console.log("req.body.loginedUserid", req.body.loginedUserid)
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        // condition.include[0].where={}
        condition.where.user_id = req.body.loginedUserid.id;
      }
      // condition.order = [['year', 'ASC']];
      let data = await indenterModel.findAndCountAll(condition);
      ;
      // returnResponse = await paginateResponse(data, page, pageSize);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static IndentorVarietyNameList = async (req, res) => {
    try {
      let returnResponse = {};



      let condition = {
        include: [{
          model: cropModel,

        },
        {
          model: cropVerietyModel,
          order: []
        }

        ],


        // distinct: true,
        where: {
          year: parseInt(req.body.search.year),
          season: req.body.search.season,
          crop_code: req.body.search.crop_code

        },
        order: []

      }

      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        // condition.include[0].where={}
        condition.where.user_id = req.body.loginedUserid.id;
      }
      // i  

      condition.order = [['variety_name', 'ASC']];
      let data = await indenterModel.findAndCountAll(condition);
      ;
      // returnResponse = await paginateResponse(data, page, pageSize);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static getIndentOfSpaDataOld = async (req, res) => {
    let returnResponse = {};
    try {
      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let groupCode;

      if (req.body.search) {
        if (req.body.search.group_code) {
          groupCode = {
            where: {
              group_code: req.body.search.group_code
            }
          }
        }
      }

      let condition = {
        include: [
          {
            model: cropDataModel,
            attributes: [],
            include: [{
              model: cropGroupModel,
              attributes: [],
              ...groupCode
            }],
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: stateModel,
            attributes: []
          },
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: []
            },
            ],

            attributes: [],
            where: {
              id: {
                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agancyData[0].state_id} AND user_type = 'SPA')`)
              }
            },
          }
        ],
        where: {
          state_code: agancyData[0].state_id,
          is_active: 1,
          variety_code: {
            [Op.not]: null,
          }
          /*id: {
           [Op.in]: sequelize.literal(`(SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agancyData[0].state_id} AND user_type = 'SPA')`)
          }*/
        },
        attributes: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
          [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('indent_of_spas.is_freeze'), 'is_freeze'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id'],
          [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
        ],
        group: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('indent_of_spas.is_freeze'), 'is_freeze'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id'],
          [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
          [sequelize.col('user->agency_detail.id'), 'id'],
        ],
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.spa_code) {
          condition.where.spa_code = req.body.search.spa_code;
        }
        if (req.body.search.year_of_indent) {
          condition.where.year = parseInt(req.body.search.year_of_indent);
        }
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }
      let getSpaIndentData = await indentOfSpaModel.findAll(condition);

      let data = [] = getSpaIndentData;
      let dataSet = [];
      let dataSet2 = [];
      const abc = data.map(element => {

        if (dataSet.hasOwnProperty(element['variety_code'])) {
          dataSet[element['variety_code']]['spa'] = [...dataSet[element['variety_code']]['spa'],
          { ...{ name: element['spa_name'], indent: element['indent_quantity'] } }]
        } else {
          dataSet[element['variety_code']] = element;
          dataSet[element['variety_code']]['spa'] = [{ name: element['spa_name'], indent: element['indent_quantity'] }]
        }
        return dataSet2;
      })
      let finaleData = {}
      const abc1 = data.map(element => {

        if (element.hasOwnProperty('spa')) {
          finaleData = [{ ...finaleData }, { ...element }]
          return element;
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, abc1);
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static getIndentOfSpaData = async (req, res) => {
    let returnResponse = {};
    try {
      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let groupCode;

      if (req.body.search) {
        if (req.body.search.group_code) {
          groupCode = {
            where: {
              group_code: req.body.search.group_code
            }
          }
        }
      }

      let condition = {
        include: [
          {
            model: cropDataModel,
            attributes: [],
            include: [{
              model: cropGroupModel,
              attributes: [],
              ...groupCode
            }],
          },
          {
            model: varietyModel,
            attributes: [],
            required:true
          },
          {
            model: stateModel,
            attributes: []
          },
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: indenterModel,
            attributes: []
          },
          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: []
            },
            ],

            attributes: [],
            where: {
              id: {
                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agancyData[0].state_id} AND user_type = 'SPA')`)
              }
            },
          },
          {
            model: db.indentOfSpaLinesModel,
            attributes: [],
            include: [
              {
                model: db.varietLineModel,
                attributes: [],
              }
            ]
          }
        ],
        where: {
          state_code: agancyData[0].state_id,
          is_active: 1,
          variety_code: {
            [Op.not]: null,
          }
          /*id: {
           [Op.in]: sequelize.literal(`(SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${agancyData[0].state_id} AND user_type = 'SPA')`)
          }*/
        },
        attributes: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
          [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('indent_of_spas.is_freeze'), 'is_freeze'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.fn('SUM', sequelize.col('indent_of_spa_line.quantity')), 'line_quantity'],
          [sequelize.col('indent_of_spa_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_spa_line->m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_breederseed.is_indenter_freeze'), 'is_indenter_freeze'],
          // 'is_indenter_freeze'
          [sequelize.col('indent_of_spa_line->m_variety_line.id'), 'line_variety_id'],
        ],
        group: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('indent_of_spas.is_freeze'), 'is_freeze'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
          [sequelize.col('user->agency_detail.id'), 'id'],
          [sequelize.col('indent_of_spa_line.quantity'), 'line_quantity'],
          [sequelize.col('indent_of_spa_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_spa_line->m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_breederseed.is_indenter_freeze'), 'is_indenter_freeze'],
          // 'is_indenter_freeze'
          [sequelize.col('indent_of_spa_line->m_variety_line.id'), 'line_variety_id'],
        ],
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.spa_code) {
          condition.where.spa_code = req.body.search.spa_code;
        }
        if (req.body.search.year_of_indent) {
          condition.where.year = parseInt(req.body.search.year_of_indent);
        }
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }
      let getSpaIndentData = await indentOfSpaModel.findAll(condition);

      const filteredData = [];
      getSpaIndentData.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code);
        if (spaIndex === -1) {
          filteredData.push({
            variety_name: el.variety_name,
            not_year: el.notification_year,
            variety_id: el.variety_id,
            variety_code: el.variety_code,
            parental_count: 1,
            total_spa_count: 1,
            is_freeze: el.is_freeze,
            is_indenter_freeze: el && el.is_indenter_freeze ? el.is_indenter_freeze:0,
            parental: [
              {
                parental_line: el.line_variety_name,
                total_indent: el.indent_quantity,
                spa_count: 1,
                spas: [
                  {
                    name: el.spa_name,
                    spa_code: el.spa_code,
                    indent_qunatity: el.line_quantity
                  },
                ]
              }
            ]
          });
        } else {
          // el.spa_code == el.spa_code
          const cropIndex = filteredData[spaIndex].parental.findIndex(item => item.variety_code == el.variety_code && item.line_variety_id == el.line_variety_id && item.spa_code == el.spa_code);
          if (cropIndex !== -1) {
            filteredData[spaIndex].parental[cropIndex].spas.push(
              {
                name: el.spa_name,
                spa_code: el.spa_code,
                indent_qunatity: el.line_quantity
              }
            );
          } else {
            filteredData[spaIndex].parental.push({
              parental_line: el.line_variety_name,
              total_indent: el.indent_quantity,
              spa_count: 1,
              spas: [
                {
                  name: el.spa_name,
                  spa_code: el.spa_code,
                  indent_qunatity: el.line_quantity
                },
              ]
            });
          }
        }
      });
      let responseData = [];
      if (filteredData && filteredData.length) {
        filteredData.forEach((item, i) => {
          filteredData[i].total_spa_count = 0;
          filteredData[i].parental_count = 0
          if (item.parental && item.parental.length > 0) {
            filteredData[i].parental_count += (item.parental.length)
            item.parental.forEach((ele, j) => {
              filteredData[i].parental[j].total_spa_count = 0;
              if (ele.spas && ele.spas.length) {
                ele.spas.forEach((val, k) => {
                  if (val.indent_qunatity) {
                    filteredData[i].parental[j].total_indent += parseFloat(ele.total_indent);
                  }
                })
                filteredData[i].total_spa_count += (ele.spas.length);
                filteredData[i].parental[j].spa_count = (ele.spas.length)
              }
              console.log(filteredData[i].parental[j].total_indent)
            })
          }
        });
        responseData = filteredData;
      }

      return response(res, status.DATA_AVAILABLE, 200, responseData);

    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static getIndentOfSpaCountData = async (req, res) => {
    let returnResponse = {};
    try {

      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });
      let totalIndentQuantity = await indentOfSpaModel.findAll({
        where: {
          state_code: agancyData[0].state_id
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'total_indent_quantity'],
        ],
      });

      let totalIndentVariety = await indentOfSpaModel.findAll({
        where: {
          state_code: agancyData[0].state_id
        },
        attributes: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
        ],
        group: [
          [sequelize.col('indent_of_spas.variety_code'), 'variety_code'],
        ],
      });

      let totalIndentSpa = await indentOfSpaModel.findAll({
        where: {
          state_code: agancyData[0].state_id
        },
        attributes: [
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
        ],
        group: [
          [sequelize.col('indent_of_spas.spa_code'), 'variety_code'],
        ],
      });

      let totalVariety = totalIndentVariety.length;
      let totalSPA = totalIndentSpa.length;
      let totalIndnet = parseInt(totalIndentQuantity[0].dataValues.total_indent_quantity);
      let overallData = {
        totalIndnet, totalVariety, totalSPA
      }

      if (overallData === undefined || overallData.length < 1) {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 404, returnResponse);
      } else {
        returnResponse = overallData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static getIndentOfSpaSeason = async (req, res) => {
    let returnResponse = {};
    try {

      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code']
        ],
        where: {
          state_code: agancyData[0].state_id
        },
        raw: true
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
      }

      let seasonData = await indentOfSpaModel.findAll(condition);
      returnResponse = seasonData;
      return response(res, status.DATA_AVAILABLE, 200, returnResponse);

    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getIndentOfSpaCropGroup = async (req, res) => {
    let returnResponse = {};
    try {
      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let condition = {
        include: [
          {
            model: cropDataModel,
            include: [{
              model: cropGroupModel,
              attributes: []
            }],
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
        ],
        order: [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']],
        where: {
          state_code: agancyData[0].state_id
        },
        raw: true
      }

      if (req.body.search) {
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
      }

      console.log(condition)

      let data = await indentOfSpaModel.findAll(condition);

      if (data === undefined || data.length < 1) {
        returnResponse = data;
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);

      } else {
        returnResponse = data;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      }

    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getIndentOfSpaCrop = async (req, res) => {
    let returnResponse = {};

    try {
      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let groupCode;

      if (req.body.search) {
        if (req.body.search.group_code) {
          groupCode = {
            where: {
              group_code: req.body.search.group_code
            }
          }
        }
      }

      let condition = {
        include: [
          {
            model: cropDataModel,
            include: [{
              model: cropGroupModel,
              attributes: [],
              ...groupCode
            }],
            attributes: []
          }
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        where: {
          state_code: agancyData[0].state_id
        },

        raw: true
      }

      if (req.body.search) {
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
      }


      let data = await indentOfSpaModel.findAll(condition);
      if (data === undefined || data.length < 1) {
        returnResponse = data;
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);

      } else {
        returnResponse = data;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static freezIndentOfSpaData = async (req, res) => {
    let returnResponse = {};
    let agancyData = await agencyDetailModel.findAll({
      where: {
        id: req.body.loginedUserid.agency_id
      },
      raw: true
    });
    try {
      let groupCode;
      if (req.body) {
        if (req.body.group_code) {
          groupCode = {
            where: {
              group_code: req.body.group_code
            }
          }
        }
      }

      let condition = {
        include: [
          {
            model: cropDataModel,
            include: [{
              model: cropGroupModel,
              attributes: [],
              ...groupCode
            }],
            attributes: []
          }
        ],
        where: {
          state_code: agancyData[0].state_id
        },
        raw: true
      }

      if (req.body) {
        if (req.body.season) {
          condition.where.season = req.body.season;
        }
        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code;
        }
        if (req.body.year) {
          condition.where.year = req.body.year;
        }
      }


      await indentOfSpaModel.update({ is_freeze: 1 }, condition);

      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse);

    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static freezIndentOfBreederSeedData = async (req, res) => {
    try {
      const freezArray = req.body.freezArray;

      const data = await Promise.all(freezArray.variety_id.map(async (variety) => {

        const condition = {
          where: {
            year: freezArray.year,
            season: freezArray.season,
            crop_code: freezArray.crop_code,
            user_id: freezArray.user_id,
            variety_id: variety,
          }
        };

        const row = await indenterModel.update({ is_indenter_freeze: 1 }, condition);
        return row;

      }));

      return response(res, status.DATA_UPDATED, 200, data);

    } catch (error) {
      console.log('error', error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getIndentOfSpaYear = async (req, res) => {
    let returnResponse = {};
    try {


      let agancyData = await agencyDetailModel.findAll({
        where: {
          id: req.body.loginedUserid.agency_id
        },
        raw: true
      });

      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_spas.year')), 'year'],
        ],
        where: {
          state_code: agancyData[0].state_id
        },
        raw: true
      }

      let seasonData = await indentOfSpaModel.findAll(condition);
      returnResponse = seasonData;
      return response(res, status.DATA_AVAILABLE, 200, returnResponse);

    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getTotalNumberOfSPA = async (req, res) => {
    try {
      const user_id = req.query.user_id;

      const agency_user = await agencyDetailModel.findOne({
        where: {
          user_id: user_id
        },
        raw: true
      });

      const condition = {
        where: {
          state_id: agency_user.state_id
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.user_id')), 'user_id'],
          "state_id"
        ],

        include: [
          {
            model: userModel,
            attributes: ['id', 'name', 'user_type', 'agency_id'],
            where: {
              user_type: 'SPA'
            },
            raw: true,
            left: true
          },
        ],
        raw: true
      };

      let data = await agencyDetailModel.findAll(condition);

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

  static getIndentOfBreederSeedDataForSPA = async (req, res) => {
    try {
      const { year, season, crop_code, user_id } = req.body;

      const agency_user = await agencyDetailModel.findOne({
        where: {
          user_id: user_id
        },
        raw: true
      });

      const condition = {
        where: {
          year: Number(year),
          season: season,
          state_code: agency_user.state_id,
          crop_code: crop_code,
          user_id: user_id
        },

        attributes: ['id', 'indent_quantity', 'variety_id', 'crop_code', 'state_code'],
        raw: true
      };

      console.log(condition)

      let data = await indentOfSpaModel.findAll(condition);

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

  static viewCrop = async (req, res) => {
    let data = {};

    try {
      let condition = {
        where: {
        }
      }
      condition.order = [['crop_name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      data = await cropDataModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static viewVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {}
      };
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code
        }
      }
      condition.order = [['variety_name', 'ASC']];
      data = await varietyModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static indenterLists = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            where: {},
            include: [
              {
                model: stateModel,
                attributes: [],
              }, {
                model: districtModel,
                attributes: [],
              }
            ],
          }
        ],
        raw: true,
        attributes: ['id',
          [sequelize.col('users.name'), 'intenter_name'],
          [sequelize.col('users.username'), 'intenter_username'],

          [sequelize.col('agency_detail.id'), 'agency_id'],
          [sequelize.col('agency_detail.contact_person_name'), 'contact_person_name'],
          [sequelize.col('agency_detail.name_of_insitution'), 'name_of_insitution'],
          [sequelize.col('agency_detail.contact_person_mobile'), 'contact_person_mobile'],
          [sequelize.col('agency_detail.phone_number'), 'contact_person_phone_no'],
          [sequelize.col('agency_detail.email'), 'contact_person_email'],
          [sequelize.col('agency_detail.pincode'), 'contact_person_pincode'],
          [sequelize.col('agency_detail.contact_person_designation'), 'contact_person_designation'],
          [sequelize.col('agency_detail.sector_id'), 'sector_id'],
          [sequelize.col('agency_detail.block_id'), 'block_id'],
          [sequelize.col('agency_detail.address'), 'address'],
          [sequelize.col('agency_detail.short_name'), 'short_name'],

          [sequelize.col('agency_detail->m_state.state_name'), 'state_name'],
          [sequelize.col('agency_detail->m_state.state_code'), 'state_code'],
          [sequelize.col('agency_detail->m_district.district_code'), 'district_code'],
          [sequelize.col('agency_detail->m_district.district_name'), 'district_name'],
        ],
        where: {
          user_type: 'IN'
        }
      };

      condition.order = [['name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.include[0].where.state_id = req.body.search.state_code
        }
      }
      data = await userModel.findAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentoryearlist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

          // 'user_id':req.body.user_id
        },
        /* include:[
           {
             model:indenterModel,
             where:{
               'user_id':req.body.user_id
             }
           }
 
         ],*/
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]

      };
      if (req.body && req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
            // condition.where.state_code = 3;
          }
        }
      }
      condition.order = [['year', 'DESC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentorSeasonlist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          year: req.body.search.year
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],
        ],


      };
      // if (req.body.search) {
      //   if (req.body.search.crop_code) {
      //     condition.where.crop_code = req.body.search.crop_code
      //   }
      //   if (req.body.search.variety_code) {
      //     condition.where.variety_code = req.body.search.variety_code
      //   }
      // }
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
            // condition.where.state_code = 3;
          }
        }
      }
      condition.order = [['season', 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentorCropGrouplist = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_type: req.body.search.crop_type

        },
        include: [
          {
            model: cropDataModel,
            // attributes:['id','crop_name','crop_code'],


          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          'crop_code'

        ],
        raw: true

      };
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == 'indenter') {
            condition.where.state_code = req.body.loginedUserid.state_id
          }
        }
      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentorCropTypelist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        ],


      };
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            // condition.where.state_code =3;
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }
      }
      condition.order = [['crop_type', 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentorCropTypelistSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {

        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            include: [
              {
                model: indenterModel,
                attributes: [],
                where: {
                  year: req.body.search.year,
                  season: req.body.search.season,
                },
              }
            ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_detail->indent_of_breederseed.crop_type')), 'crop_type'],
        ],
        group: [
          [sequelize.col('agency_detail->indent_of_breederseed.crop_type'), 'crop_type']

        ],
        raw: true,

        //   attributes:[
        //   [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        // ],


      };

      condition.order = [[sequelize.col('agency_detail->indent_of_breederseed.crop_type'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentoryearlistSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {

        /* include:[
           {
             model:agencyDetailModel,
             attributes:[],
             include:[
               {
                 model:indenterModel,
                 where: {
                   user_id:req.body.user_id,
                   // season:req.body.search.season,
                 },
                 attributes:[],
               }
             ]
 
           }
         ],*/
        // attributes:[],


        // attributes:[
        // [sequelize.fn('DISTINCT', sequelize.col('agency_detail->indent_of_breederseed.year')), 'year'],
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('indent_of_spas.year')), 'year'],
        ],
        group: [
          //        [sequelize.col('agency_detail->indent_of_breederseed.year'),'year']
          [sequelize.col('indent_of_spas.year'), 'year']

        ],
        raw: true,
      };

      condition.order = [[sequelize.col('indent_of_spas.year'), 'DESC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getindentorSeasonlistSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {

        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            include: [
              {
                model: indenterModel,
                where: {
                  user_id: req.body.user_id,
                  year: req.body.search.year

                  // season:req.body.search.season,
                },
                attributes: [],
              }
            ]

          }
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_detail->indent_of_breederseed.season')), 'season'],
        ],
        group: [
          [sequelize.col('agency_detail->indent_of_breederseed.season'), 'season']

        ],
        raw: true,


      };
      condition.order = [[sequelize.col('agency_detail->indent_of_breederseed.season'), 'ASC']];
      // condition.order = [['season', 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getindentorVarietylist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }

            },

          ]
        },

        include: [
          {
            model: varietyModel,
            // attributes:['id','crop_name','crop_code'],


          }
        ],

      };

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getindentorVarietylistNew = async (req, res) => {
    let data = {};
    try {
      let stateCode = {};
      if (req.body && req.body.search && req.body.search.type) {
        if (req.body.search.type == "indenter") {
          stateCode = {
            state_code: {
              [Op.eq]: req.body.loginedUserid.state_id
            }
          }
        }
      }

      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }

            },
            stateCode
          ]
        },

        include: [
          {
            model: varietyModel,
            // attributes:['id','crop_name','crop_code'],
            attributes: []
          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        raw: true,
      };

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndentorCropWiseBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      //      console.log("state_idstate_id9999999999999",req.body.loginedUserid.state_id, req.body.loginedUserid, req.body )
      if (req.body.loginedUserid && req.body.loginedUserid.state_id && req.body.search)
        req.body.search.state_code = req.body.loginedUserid.state_id

      let filters = await ConditionCreator.filters(req.body.search);

      console.log("filtersfilters", filters)
      if (1) {
        // console.log('crop_code',req.body.search.crop_code.length)

        condition = {
          where: filters,
          include: [
            {
              model: cropDataModel,
              attributes: [],
              attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                attributes: ['agency_name']
              },
              ],

              attributes: ['name'],
              where: {
                id: {
                  [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
                }
              },
            }
          ],
          attributes: [
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
          ],
        };
      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);
      // console.log("datadatadata -------", data)
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el.m_crop.crop_name,
            "crop_code": el.crop_code,
            "crop_total_indent": el.indent_quantity,
            "variety_count": 1,
            "total_spa_count": 1,
            "variety": [
              {
                "name": el.variety_name,
                "variety_id": el.variety_id,
                "variety_code": el.variety_code,
                "variety_name": el.m_crop_variety.variety_name,
                "not_date": el.m_crop_variety.not_date,
                "total_indent": el.indent_quantity,
                "spa_count": 1,
                "spas": [
                  {
                    "name": el.user.agency_detail.agency_name,
                    "spa_code": el.spa_code,
                    "state_code": el.state_code,
                    // "sector": "ABC",
                    "indent_qunatity": el.indent_quantity
                  }
                ]
              }
            ]
          });
        } else {
          // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_code === el.variety_code);
          //	          const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code );

          if (cropIndex !== -1) {
            // console.log('>>>>', cropIndex);
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].variety[cropIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety[cropIndex].variety_count = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            // filteredData[spaIndex].variety_count  = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].variety[cropIndex].spa_count = filteredData[spaIndex].variety[cropIndex].spa_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

            filteredData[spaIndex].variety[cropIndex].spas.push(
              {
                "name": el.user.agency_detail.agency_name,
                "spa_code": el.spa_code,
                "state_code": el.state_code,
                // "sector": "ABC",
                "indent_qunatity": el.indent_quantity
              }
            );
          } else {
            // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety_count = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

            filteredData[spaIndex].variety.push({
              "name": el.variety_name,
              "variety_id": el.variety_id,
              "variety_code": el.variety_code,
              "variety_name": el.m_crop_variety.variety_name,
              "not_date": el.m_crop_variety.not_date,
              "total_indent": el.indent_quantity,
              "spa_count": 1,
              "spas": [
                {
                  "name": el.user.agency_detail.agency_name,
                  "spa_code": el.spa_code,
                  "state_code": el.state_code,
                  "indent_qunatity": el.indent_quantity
                }
              ]
            });
          }
        }
      });

      // console.log("filteredDatafilteredDatafilteredData", filteredData);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndentorSpaWiseBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      console.log("state_idstate_id", req.body.search)
      if (req.body.loginedUserid && req.body.loginedUserid.state_id && req.body.search)
        req.body.search.state_code = req.body.loginedUserid.state_id

      let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: filters,
        include: [
          {
            model: cropDataModel,
            attributes: [],
            attributes: ['id', 'crop_name', 'crop_code'],
          },
          {
            model: varietyModel,
            attributes: ['variety_name']
          },
          //  {
          //    model:agencyDetailModel,
          //    attributes:['agency_name']
          //  },
          //  {
          //   model:userModel,
          //   attributes:['name']
          // }

          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: ['agency_name']
            },
            ],

            attributes: ['name'],
            where: {
              id: {
                // ${req.body.loginedUserid.state_id}
                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id ='${req.body.loginedUserid.state_id}' AND user_type = 'SPA')`)
              }
            },
          }
        ],
        attributes: [
          [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('user->agency_detail.state_id'), 'state_code'],
          [sequelize.col('user.spa_code'), "spa_code"],
        ],
      };

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }
      }
      data = await indentOfSpaModel.findAll(condition);
      let filteredData = []
      data.forEach(el => {
        //        const spaIndex = filteredData.findIndex(item => item.name === el.agency_detail.agency_name );        
        const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code);

        if (spaIndex === -1) {
          filteredData.push({
            "name": el.user.agency_detail.agency_name,
            "spa_code": el.spa_code,
            "state_code": el.state_code,
            // "sector": "ABC",
            "agency_name": el.agency_name,
            "total_indent": el.indent_quantity,
            "crop_count": 1,
            "variety_total_count": 1,
            "crops": [
              {
                "crop_name": el.m_crop.crop_name,
                "crop_code": el.crop_code,
                "crop_total_indent": el.indent_quantity,
                "variety_count": 1,
                "varieties": [
                  {
                    "name": el.m_crop_variety.variety_name,
                    "variety_id": el.variety_id,
                    "variety_code": el.variety_code,
                    "indent_qunatity": el.indent_quantity,
                  }
                ]
              }
            ]
          });
        } else {
          // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
          const cropIndex = filteredData[spaIndex].crops.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex !== -1) {
            // console.log('>>>>', cropIndex);
            filteredData[spaIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].crops[cropIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crops[cropIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;

            filteredData[spaIndex].crops[cropIndex].varieties.push(
              {
                "name": el.m_crop_variety.variety_name,
                "variety_id": el.variety_id,
                "variety_code": el.variety_code,
                "indent_qunatity": el.indent_quantity,
              }
            );
          } else {
            // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;
            filteredData[spaIndex].crop_count = filteredData[spaIndex].crop_count + 1;
            // filteredData[spaIndex].total_spa_count  = filteredData[spaIndex].total_spa_count  + 1;

            filteredData[spaIndex].crops.push({
              // "crops": [

              "crop_name": el.m_crop.crop_name,
              "crop_code": el.m_crop.crop_code,
              "crop_total_indent": el.indent_quantity,
              "variety_count": 1,

              "varieties": [
                {
                  "name": el.m_crop_variety.variety_name,
                  "variety_id": el.variety_id,
                  "variety_code": el.variety_code,
                  "indent_qunatity": el.indent_quantity,
                }
              ]


            });
          }
        }
      });



      // data = await indentOfSpaModel.findAll(condition);

      if (filteredData) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndentorSpaNameBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },
            {
              state_code: {
                [Op.eq]: req.body.loginedUserid.state_id
              }

            },


          ]
        },

        include: [
          {
            model: agencyDetailModel,
            // attributes:['id','crop_name','crop_code'],
            attributes: []

          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],
        group: [

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],


      };

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }




  static getSpaDetailsData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      // let rules = {
      //   // 'state_code': 'required',
      //   // 'spa_code': 'required|string',
      //   // 'indent_year': 'required|string',
      //   // 'season_code': 'required|string'
      // };

      // let validation = new Validator(req.query, rules);

      // const isValidData = validation.passes();

      // if (!isValidData) {
      //   let errorResponse = {};
      //   for (let key in rules) {
      //     const error = validation.errors.get(key);
      //     if (error.length) {
      //       errorResponse[key] = error;
      //     }
      //   }
      //   return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      // }

      const condition = {
        include: [
          {
            model: cropModel,

            attributes: []
          },
          {
            model: cropVerietyModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            include: [{
              model: userModel,

              attributes: [],
              include: [
                {
                  model: indenterModel,
                  // attributes:['id','user_id'],
                  include: [
                    {
                      model: allocationToIndentorProductionCenterSeed,
                      attributes: []
                    }
                  ]
                }
              ]
            }],
            attributes: [],
          }
        ],
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },



          ]
        },
        // where:{
        //   state_code:req.query.state_code,
        //   spa_code:req.query.spa_code,
        //   year:req.query.indent_year,
        //   season:req.query.season_code
        // },
        attributes: [

          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'crop_variety'],
          // [sequelize.col('agency_detail.id'), 'id'],
          [sequelize.col('agency_detail.agency_name'), 'bspc_centre_name'],
          [sequelize.col('agency_detail.short_name'), 'bspc_centre_code'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('indent_of_spas.crop_type'), 'crop_type'],
          // [sequelize.col('agency_detail->user->indent_of_breederseed->allocation_to_indentor_for_lifting_seed_production_cnter.allocated_quantity'), 'allocated_quantity'],
        ],
        // raw:true,
      }

      const data = await indentOfSpaModel.findAndCountAll(condition)
      if (data != undefined && data.count > 0) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {

        return response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }
  static getAllocatedIndentedQtyLifting = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },



          ]
        },

        // where: {
        //   year:req.body.search.year,
        //   season:req.body.search.season,
        //   crop_type:req.body.search.crop_type
        // },
        include: [
          {
            model: cropDataModel,
            attributes: []
            // attributes:['id','crop_name','crop_code'],        
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: []
          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
          [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
          [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          // [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
        ],
        group: [
          [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
          // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
        ],
        //   attributes:[
        //   [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.')), 'season'],
        // ],


      };
      if (req.body.search) {
        if (req.body.search.spa_name) {
          condition.where.user_id = (req.body.search.spa_name);
        }

      }


      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAllocatedSpanName = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      if (req.body.search.crop_code && req.body.search.crop_code.length > 0) {
        console.log('crop_code', req.body.search.crop_code)

        condition = {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.eq]: req.body.search.year
                }

              },
              {
                season: {
                  [Op.eq]: req.body.search.season
                }

              },
              {
                crop_type: {
                  [Op.eq]: req.body.search.crop_type
                }

              },
              {
                crop_code: {
                  [Op.in]: req.body.search.crop_code
                }

              },


            ]
          },
          // where: {
          //   year:req.body.search.year,
          //   season:req.body.search.season,
          //   crop_type:req.body.search.crop_type
          // },
          include: [
            {
              model: cropDataModel,
              attributes: []
              // attributes:['id','crop_name','crop_code'],        
            },
            {
              model: varietyModel,
              attributes: []
            },
            {
              model: agencyDetailModel,
              attributes: []
            }
          ],
          attributes: [
            // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            //  [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          ],
        };


      }
      if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.variety_code) {

        condition = {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.eq]: req.body.search.year
                }

              },
              {
                season: {
                  [Op.eq]: req.body.search.season
                }

              },
              {
                crop_type: {
                  [Op.eq]: req.body.search.crop_type
                }

              },
              {
                crop_code: {
                  [Op.in]: req.body.search.crop_code
                }

              },
              {
                variety_code: {
                  [Op.eq]: req.body.search.variety_code
                }

              },

            ]
          },
          include: [
            {
              model: cropDataModel,
              attributes: []
              // attributes:['id','crop_name','crop_code'],        
            },
            {
              model: varietyModel,
              attributes: []
            },
            {
              model: agencyDetailModel,
              attributes: []
            }
          ],
          attributes: [
            // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
            // [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          ],
          group: [
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          ],



        };
      }
      if (req.body.search.crop_code && req.body.search.crop_code.length < 1 && !req.body.search.variety_code) {
        console.log('span_na')

        condition = {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.eq]: req.body.search.year
                }

              },
              {
                season: {
                  [Op.eq]: req.body.search.season
                }

              },
              {
                crop_type: {
                  [Op.eq]: req.body.search.crop_type
                }

              },


            ]
          },
          // where: {
          //   year:req.body.search.year,
          //   season:req.body.search.season,
          //   crop_type:req.body.search.crop_type
          // },
          include: [
            {
              model: cropDataModel,
              attributes: []
              // attributes:['id','crop_name','crop_code'],        
            },
            {
              model: varietyModel,
              attributes: []
            },
            {
              model: agencyDetailModel,
              attributes: []
            }
          ],
          attributes: [
            // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
            //  [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
            // [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            //  [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          ],
          group: [
            //  [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            //  [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          ],
          //   attributes:[
          //   [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.')), 'season'],
          // ],


        };
      }

      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllocatedSpanNameforSpawiseReport = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },


          ]
        },
        // where: {
        //   year:req.body.search.year,
        //   season:req.body.search.season,
        //   crop_type:req.body.search.crop_type
        // },
        include: [
          {
            model: cropDataModel,
            attributes: []
            // attributes:['id','crop_name','crop_code'],        
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: []
          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
          //  [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
          [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          // [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          //  [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
        ],
        group: [
          //  [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
          // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          //  [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
        ],
        //   attributes:[
        //   [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.')), 'season'],
        // ],


      };

      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getSPAsAllData = async (req, res) => {
    try {
      let agencyDetail;
      let stateId;
      if (req.body.search.type == "indenter") {
        agencyDetail = await agencyDetailModel.findOne({
          attributes: ['id', 'state_id'],
          where: {
            id: req.body.loginedUserid.agency_id
          },
          raw: true,
        });

        stateId = { state_id: (agencyDetail && agencyDetail.state_id) }
        console.log('stateId=======', stateId);
      }


      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            require: true,
            left: false,
            include: [
              {
                model: agencyDetailModel,
                require: true,
                left: false,
                attributes: ['state_id'],
                where: {
                  ...stateId
                }
              }
            ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('user.spa_code')), 'spa_code'],
          [sequelize.col('user.name'), 'short_name'],
          // [sequelize.col('user.spa_code'),'spa_code']
          // [sequelize.col('user->agency_detail.name'),'name']
        ],
        raw: true,
        require: true,
        // left:false,
        where: {}
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year)
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season)
        }
        if (req.body.search.crop_type) {
          condition.where.crop_type = (req.body.search.crop_type)
        }
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            // condition.where.state_code = parseInt(req.body.loginedUserid.state_id);
            console.log(req.body.search.type);
          }
        }
      }
      let data = await indentOfSpaModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 409, {});
      }
    } catch (error) {
      console.log(error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getindentorCroplist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }

            },


          ]
        },
        include: [
          {
            model: cropModel,
          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name']
          // [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]

      };
      if (req.body && req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }
      }
      condition.order = [[(sequelize.col('m_crop.crop_name', 'ASC'))]];
      data = await indentOfSpaModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static checkIsonboardStatewise = async (req, res) => {
    try {
      console.log('hiii');
      /* let condition = {
         include: [
           {
             model: agencyDetailModel,
             attributes: ['id'],
             include: [{
               model: userModel,
               attributes: ['id'],
               where:{
                 user_type:"IN"
               }
             }]
           }
         ],
         attributes: [
           [sequelize.fn('DISTINCT',sequelize.col('m_states.state_code')), 'state_code'],
           [sequelize.col('agency_details->user.id'), 'user_id'],
           [sequelize.col('agency_details->user.user_type'), 'user_type'],
           [sequelize.col('agency_details.id'), 'agency_id'],
           [sequelize.col('agency_details->user.is_onboar'), 'onboard'],
         ],
         group:[
           [sequelize.col('m_states.state_code'), 'state_code'],
           [sequelize.col('agency_details->user.id'), 'user_id'],
           [sequelize.col('agency_details->user.user_type'), 'user_type'],
           [sequelize.col('agency_details.id'), 'agency_id'],
           [sequelize.col('agency_details->user.is_onboar'), 'onboard'],
         ],
         where: {
 
         },
         raw: true
       };
 
       if (req.body.search) {
         if (req.body.search.state_code) {
           condition.where.state_code = req.body.search.state_code;
         }
       }
 
       let data = await stateModel.findAll(condition);
       */

      let data = await userModel.findAll({
        include: [{
          model: agencyDetailModel,
          attributes: [
            [sequelize.col('state_code'), 'state_code'],
            //	[sequelize.col('user_id'), 'user_id'],
            //	[sequelize.col('users.user_type'), 'user_type'],
            [sequelize.col('id'), 'agency_id'],
            //	[sequelize.col('users.is_onboar'), 'onboard'],
          ],
          where: {
            state_id: req.body.search.state_code
          }
        }],
        where: {
          user_type: "IN"
        },
        attributes: [
          //    [sequelize.col('agency_detail.state_code'), 'state_code'],
          [sequelize.col('user_id'), 'user_id'],
          [sequelize.col('users.user_type'), 'user_type'],
          //      [sequelize.col('agency_detail.id'), 'agency_id'],
          [sequelize.col('users.is_onboar'), 'onboard'],
        ],
      });
      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, error);
    }
  }

  static getAllocatedDistrict = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              user_id: {
                [Op.in]: req.body.search.name_id
              }

            },



          ]
        },

        include: [{
          model: districtModel,
          attributes: []

        }],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          'id'
        ],
        raw: true


      };


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await agencyDetailModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCropList = async (req, res) => {
    try {
      let season;
      let seasonBoth;
      if (req.query) {
        if (req.query.season) {
          season = {
            season: req.query.season.slice(0, 1)
          },
            seasonBoth = {
              season: 'B'
            }
        }
      }
      let condition = {
        attributes: [
          [sequelize.col('m_crops.crop_code'), 'cropCode'],
          [sequelize.col('m_crops.crop_name'), 'cropName'],
        ],
        where: {
          [Op.or]: [
            {
              ...season
            }, {
              ...seasonBoth
            },
            {
              season: {
                [Op.not]: 'No'
              }
            }
          ]

        },
        raw: true
      }
      condition.order = [['crop_name', 'ASC']];
      let { page, pageSize, search } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined)  // set pageSize to -1 to prevent sizing
      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      let data = await cropModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }
  static getVarietyList = async (req, res) => {
    try {
      const { cropCode } = req.query;
      let cropCodeValue;
      if (cropCode) {
        cropCodeValue = {
          crop_code: cropCode
        }
      }
      let condition = {
        attributes: [
          [sequelize.col('m_crop_varieties.variety_code'), 'varietyCode'],
          [sequelize.col('m_crop_varieties.variety_name'), 'varietyName'],
          [sequelize.col('m_crop_varieties.not_date'), 'notificationDate'],
          [sequelize.col('m_crop_varieties.status'), 'varietyType']

        ],
        where: {
          [Op.or]: [
            {
              ...cropCodeValue
            },
            {
              status: {
                [Op.not]: 'other'
              }
            }
          ]
        },
        raw: true
      }

      condition.order = [['variety_name', 'ASC']];
      // let { page, pageSize, search } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined)  // set pageSize to -1 to prevent sizing
      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      let data = await varietyModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }

}
module.exports = IndenterController


