require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
let Validator = require('validatorjs');
const ConditionCreator = require('../_helpers/condition-creator')

const userModel = db.userModel;
const seasonModel = db.seasonModel;
const designationModel = db.designationModel;
const indenterSPAModel = db.indenterSPAModel;
const cropModel = db.cropModel;
const indentorBreederSeedModel = db.indentorBreederSeedModel;
const agencyDetailModel = db.agencyDetailModel;
const stateModel = db.stateModel;
const breederCropModel = db.breederCropModel;
const varietyModel = db.varietyModel;
const indenterModel = db.indenterModel;
const breederCropsVerietiesModel = db.breederCropsVerietiesModel;
const cropGroupDataModel = db.cropGroupModel;
const bsp5bModel = db.bsp5bModel;
const bsp1Model = db.bsp1Model;
const allocationToIndentor = db.allocationToIndentor;
const bsp1ProductionCenterModel = db.bsp1ProductionCenterModel;
const lotNumberModel = db.lotNumberModel;
const allocationToIndentorSeed = db.allocationToIndentorSeed;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed;
const generateBills = db.generateBills;
const labelNumberForBreederseed = db.labelNumberForBreederseed;
const assignCropNewFlow = db.assignCropNewFlow;
const assignBspcCropNewFlow = db.assignBspcCropNewFlow;
const VarietyLines = db.VarietyLines
// const paginateResponse = require('../_utility/utility');
const Op = require('sequelize').Op;
const paginateResponse = require('../_utility/generate-otp');
const { districtModel, cropGroupModel, cropVerietyModel, bspcToPlants, plantDetails } = require('../models');
const districtModel2 = db.districtModel;
const sequelize = require('sequelize');
const { where } = require('sequelize');
// const { cropVerietyModel } = require('../../../ms-nb-005-seed-division-center/app/models');
const SeedUserManagement = require('../_helpers/create-user');
const e = require('express');
const bsp3Helper = require('../_helpers/bsp3');
const sendSms = require('../_helpers/sms');
// const { indentOfSpa } = require('../../../ms-nb-004-indenter/app/models');
const seedTestingReportsModel = db.seedTestingReportsModel;
const maxLotSizeModel = db.maxLotSizeModel;
const seedForProductionModel = db.seedForProductionModel;

class breederController {

  static breederSeedssubmision = async (req, res) => {
    try {

      // let cropNameexisitingData;

      // if(!req.params['id']){
      //   cropNameexisitingData = await breederCropModel.findAll({
      //     where: {
      //       [Op.or]: [{ crop_code: req.body.crop_code }],
      //       // is_active: 1
      //     }
      //   });




      //   if ((cropNameexisitingData && cropNameexisitingData.length)) {
      //     const errorResponse = {
      //       subscriber_id: 'Crop Name no is already exits.'
      //     }
      //     return response(res, status.USER_EXISTS, 409, errorResponse)
      //   }
      //   const breedingProductionNameData = await breederCropModel.findAll({
      //     where: {
      //       [Op.or]: [{ production_center_id: req.body.production_center_id }],
      //       // is_active: 1
      //     }
      //   });




      //   if ((breedingProductionNameData && breedingProductionNameData.length)) {
      //     const errorResponse = {
      //       subscriber_id: 'Breeder Production Centre is already exits.'
      //     }
      //     return response(res, status.USER_EXISTS, 409, errorResponse)
      //   }
      // }

      // if(req.params['id']){
      //   cropNameexisitingData = await breederCropModel.findAll({
      //     where: {
      //       [Op.and]: [
      //         {
      //           crop_code:{ [Op.eq]: req.body.crop_code },

      //         } ,

      //         {
      //           id: { [Op.ne]: req.params['id'] }
      //         }

      //       ],
      //       // is_active: 1
      //     }
      //   });




      //   if ((cropNameexisitingData && cropNameexisitingData.length)) {
      //     const errorResponse = {
      //       subscriber_id: 'Crop Name no is already exits.'
      //     }
      //     return response(res, status.USER_EXISTS, 409, errorResponse)
      //   }
      //   const breedingProductionNameData = await breederCropModel.findAll({
      //     where: {
      //       [Op.and]: [
      //         {

      //           production_center_id:  { [Op.eq]: req.body.production_center_id },
      //         },
      //         {
      //           id: { [Op.ne]: req.params['id'] }
      //         }

      //       ],
      //       // is_active: 1
      //     }
      //   });

      //   if ((breedingProductionNameData && breedingProductionNameData.length)) {
      //     const errorResponse = {
      //       subscriber_id: 'Breeder Production Centre is already exits.'
      //     }
      //     return response(res, status.USER_EXISTS, 409, errorResponse)
      //   }

      //   // where: {
      //   //   [Op.and]: [
      //   //     {
      //   //       aadhaar_no: {
      //   //         [Op.ne]: null
      //   //       }

      //   //     },
      //   //     {
      //   //       aadhaar_no: {
      //   //         [Op.ne]: ""
      //   //       }

      //   //     }

      //   //   ]
      //   // },
      // }

      const dataRow = {
        production_center_id: req.body.production_center_id,
        crop_code: req.body.crop_code,
        crop_group_code: req.body.crop_group_code,
        user_id: req.body.user_id,
        crop_name_id: req.body.crop_name_id,
        crop_group: req.body.crop_group,
        production_center_name: req.body.production_center_name,
        is_active: req.body.active,
        season: req.body.season,
        year: req.body.yearOfIndent,
        veriety_data: req.body.variety_data
        // srr: req.body.srr,
      };

      let tabledAlteredSuccessfully = false;
      if (req.params && req.params["id"]) {
        const existingData = await breederCropModel.findAll(
          {
            attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data'],
            where: {
              id: req.params["id"]
            }
          }
        );
        if (existingData) {
          if ((req.body.production_center_id == existingData[0].dataValues.production_center_id) && (req.body.crop_code == existingData[0].dataValues.crop_code)) {
            // if (existingData) {
            breederCropsVerietiesModel.destroy({
              where: {
                breeder_crop_id: req.params["id"]
              }
            });

            let tabledExtracted = false;
            if (req.body !== undefined
              && req.body.variety_data !== undefined
              && req.body.variety_data.length > 0) {
              tabledExtracted = true;
              for (let index = 0; index < req.body.variety_data.length; index++) {
                const element = req.body.variety_data[index];
                console.log('element', element);
                const dataRow1 = {
                  breeder_crop_id: req.params["id"],
                  variety_id: element.variety_id,
                }
                const dataa = breederCropsVerietiesModel.build(dataRow1)
                await dataa.save();
                console.log('dataaa====', dataa);
              }
            }
            await breederCropModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {
              console.log("error", err)
            });
          }
          else {
            for (let index = 0; index < req.body.variety_data.length; index++) {
              const existingData = await breederCropModel.findAll(

                {
                  attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data'],
                  where: {
                    production_center_id: req.body.production_center_id,
                    crop_code: req.body.crop_code,
                    user_id: req.body.loginedUserid.id,
                    year: req.body.yearOfIndent,
                    season: req.body.season,
                  }
                }
              );

              if (existingData === undefined || existingData.length < 1) {
                breederCropsVerietiesModel.destroy({
                  where: {
                    breeder_crop_id: req.params["id"]
                  }
                });
                breederCropModel.destroy({
                  where: {
                    id: req.params["id"]
                  }
                });
                dataRow.user_id = req.body.loginedUserid.id;
                const data = breederCropModel.build(dataRow);
                await data.save();
                if (data) {
                  let tabledExtracted = false;
                  if (req.body !== undefined
                    && req.body.variety_data !== undefined
                    && req.body.variety_data.length > 0) {
                    tabledExtracted = true;
                    for (let index = 0; index < req.body.variety_data.length; index++) {
                      const element = req.body.variety_data[index];
                      const dataRow1 = {
                        breeder_crop_id: data.dataValues.id,
                        variety_id: element.variety_id,
                      }
                      const dataa = breederCropsVerietiesModel.build(dataRow1)
                      await dataa.save();
                    }
                  }
                }

                tabledAlteredSuccessfully = true;
                return response(res, status.DATA_SAVE, 200, {})

              } else {
                return response(res, status.DATA_ALREADY_EXIST, 401);
              }
            }
          }
        } else {

        }
      }
      else {
        for (let index = 0; index < req.body.variety_data.length; index++) {
          const existingData = await breederCropModel.findAll(
            {
              attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data'],
              where: {
                production_center_id: req.body.production_center_id,
                crop_code: req.body.crop_code,
                user_id: req.body.user_id,
                year: req.body.yearOfIndent,
                season: req.body.season,
              }
            }
          );
          if (existingData === undefined || existingData.length < 1) {

            const data = breederCropModel.build(dataRow);
            await data.save();
            if (data) {
              let tabledExtracted = false;
              if (req.body !== undefined
                && req.body.variety_data !== undefined
                && req.body.variety_data.length > 0) {
                tabledExtracted = true;
                for (let index = 0; index < req.body.variety_data.length; index++) {
                  const element = req.body.variety_data[index];
                  const dataRow1 = {
                    breeder_crop_id: data.dataValues.id,
                    variety_id: element.variety_id,
                  }
                  const dataa = breederCropsVerietiesModel.build(dataRow1)
                  await dataa.save();
                }
              }
            }

            tabledAlteredSuccessfully = true;
          }
        }

      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401)
      }
    }
    catch (error) {
      console.log('console.log===============', error);
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static checkbreederSeedssubmisionData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      let rules = {
        'search.crop_code': 'string',
      };
      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let checkdata;
      let tabledExtracted = false;
      // console.log('body =========== data',req.body.veriety_data);
      if (req.body !== undefined
        && req.body.search.variety_data !== undefined
        && req.body.search.variety_data.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.search.variety_data.length; index++) {
          // console.log('req.body.search.variety_data.length', req.body.search.variety_data.length);
          const element = req.body.search.variety_data[index];
          // verietyId = (element.id);
          // console.log('verity data============', element);
          let condition = {
            include: [
              {
                model: breederCropsVerietiesModel,
                required: false,
                where: {
                  variety_id: element.id,
                  // breeder_crop_id: req.body.search.production_center_id
                }
              }
            ],
            attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'crop_group', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data', 'variety', 'is_active'],
            where: {}

          }
          if (req.body.search) {

            if (req.body.search.id) {
              if ((req.body.search.year) && (req.body.search.crop_code) && (req.body.search.production_center_id)) {
                if (req.body.search.year) {
                  condition.where.year = (req.body.search.year);
                }
                if (req.body.search.id) {
                  condition.where.id = (req.body.search.id);
                }
                if (req.body.search.crop_code) {
                  condition.where.crop_code = (req.body.search.crop_code);
                }
                if (req.body.search.production_center_id) {
                  condition.where.production_center_id = (req.body.search.production_center_id);
                }
              }
            }
            else {
              console.log('hiii=====================', req.body);
              if ((req.body.search.yearOfIndent) && (req.body.search.crop_code) && (req.body.search.production_center_id)) {
                console.log('byee=====================');
                if (req.body.search.yearOfIndent) {
                  condition.where.year = (req.body.search.yearOfIndent);
                }
                if (req.body.search.crop_code) {
                  condition.where.crop_code = (req.body.search.crop_code);
                }
                if (req.body.search.production_center_id) {
                  condition.where.production_center_id = (req.body.search.production_center_id);
                }
                // if (req.body.search.veriety_data) {
                //   condition.where.veriety_data = (req.body.search.veriety_data);
                // }
                console.log('condition.where============', condition.where);
              }

            }
          }

          console.log('condition', condition)
          checkdata = await breederCropModel.findAll(condition);
          // console.log('qweryio', checkdata);
        }
        // console.log('qweryio', checkdata);

        if (req.body.search.id) {
          if ((checkdata && checkdata.length)) {
            const errorResponse = {
              inValid: false
            }

            return response(res, status.OK, 200, errorResponse, internalCall);
          }
          else {
            const errorResponse = {
              inValid: true
            }
            return response(res, status.USER_EXISTS, 409, errorResponse)
            // return response(res, status.OK, 200, errorResponse, internalCall);
          }
        } else {
          if ((checkdata && checkdata.length)) {
            const errorResponse = {
              inValid: true
            }
            return response(res, status.USER_EXISTS, 409, errorResponse)

          }
          else {
            const errorResponse = {
              inValid: false
            }
            return response(res, status.OK, 200, errorResponse, internalCall);
          }
        }
      }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static addbreederProduction = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    let internalCall = {};
    let tabledAlteredSuccessfully = false;
    let insertDataId;
    try {
      let existingData = undefined;
      let existingAgencyData = undefined;


      let userDatas = {

        agency_name: req.body.agency_name,
        created_by: req.body.createdby,//req.body.created_by,
        category: req.body.category,
        state_id: req.body.state_code,
        district_id: req.body.district_code,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation_id: req.body.contact_person_designation,
        contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        is_active: req.body.active,
        name_of_insitution: req.body.name_of_institute
      };


      // const existingData = await agencyDetailModel.findAll({
      //   where: sequelize.where(
      //     sequelize.fn('lower', sequelize.col('short_name')),
      //     sequelize.fn('lower', req.body.display_name),
      //   )
      // });c
      existingAgencyData = await agencyDetailModel.findAll({
        include: [{ model: userModel, where: { user_type: 'BPC' } }],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.createdby }

            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Production Centre Name is Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }


      existingData = await agencyDetailModel.findAll({
        include: [{ model: userModel, where: { user_type: 'BPC' } }],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              created_by: { [Op.eq]: req.body.createdby }
            },


          ]
        },
      });

      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
      // let existingEmaiData = await agencyDetailModel.findAll({
      //   // where: sequelize.where(
      //   //   sequelize.fn('lower', sequelize.col('short_name')),
      //   //   sequelize.fn('lower', req.body.display_name),
      //   // )
      //   where: {
      //     [Op.and]: [
      //       {
      //         where: sequelize.where(
      //           sequelize.fn('lower', sequelize.col('email')),
      //           sequelize.fn('lower', req.body.email),
      //         ),

      //       },


      //     ]
      //   },
      // });
      // if (existingEmaiData.length != 0) {
      //   returnResponse = {
      //     error: 'Email is Already registered'
      //   }

      //   return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      // }
      if (existingData === undefined || existingData.length < 1) {
        const data = agencyDetailModel.build(userDatas);
        const insertData = await data.save();
        insertDataId = insertData.id;
        const user_dataCount = await userModel.max('code', { where: { user_type: 'BPC' } });

        console.log('user_dataCount', user_dataCount)
        let count = user_dataCount == null || user_dataCount == undefined || user_dataCount == '' ? '0001' : parseInt(user_dataCount) + 1
        let bspcCode = count <= 9 ? '000' + (count).toString() : parseInt(count) <= 99 ? '00' + (count).toString() : parseInt(count) > 99 && parseInt(count) < 999
          ? '0' + (count).toString() : count;

        let bspcData = await userModel.findAll({
          where: {
            code: bspcCode ? bspcCode.toString():''
          }
        });

        if (bspcData && bspcData.length != 0) {
          returnResponse = {
            error: 'Data is Already Exist'
          }
          return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
        }

        const userData = userModel.build({

          agency_id: insertData.id,
          username: 'bspc' + '-'  +(req.body.display_name.trim()).toLowerCase(),
          name: req.body.display_name,
          email_id: req.body.email,
          password: '123456',
          unm: 'bspc' + '-'  +(req.body.display_name.trim()).toLowerCase(),
          mobile_number: req.body.mobile_number,
          designation_id: req.body.contact_person_designation,
          user_type: 'BPC',
          created_by: req.body.createdby,
          code: bspcCode
        });
        const insertUser = await userData.save();
        const datas = agencyDetailModel.update({
          user_id: insertUser.id
        }, {
          where: {
            id: data.id
          }
        })
        tabledAlteredSuccessfully = true;
        returnResponse['user'] = insertUser;

        const USER_API_KEY = process.env.USER_API_KEY
        let seedUserData = {
          "appKey": USER_API_KEY,
          "stateCode": "CENTRAL",
          "userid": 'bspc' + '-'  +(req.body.display_name.trim()).toLowerCase(),
          "password": "seeds#234",
          "name": req.body.display_name,
          "role": "BPC"
        }
        await SeedUserManagement.createUser(seedUserData);

      }

      if (req.body.search) {
        condition.where = {};
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        let data = await agencyDetailModel.findAndCountAll(condition);
      
        console.log(data,'data')
        if (data) {
          return response(res, status.DATA_AVAILABLE, 200, data)
        }
        else {

          return response(res, status.DATA_NOT_AVAILABLE, 400)
        }
      }
      if (tabledAlteredSuccessfully) {
        // condition.where.id = insertDataId;
        // let data = await agencyDetailModel.findOne(condition);
        // if (data) {

        //   return response(res, status.DATA_AVAILABLE, 200, data)
        // }
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static updateIndentor1 = async (req, res) => {
    let tabledAlteredSuccessfully = false;
    try {
      const id = req.body.id;
      const usersData = {
        agency_name: req.body.agency_name,
        created_by: 4,//req.body.created_by,
        // category: req.body.category,
        state_id: req.body.state,
        district_id: req.body.district,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation_id: req.body.contact_person_designation_id,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        contact_person_mobile: req.body.mobile_number,
        order: [['id', 'Desc']]
      };

      const existingData = await agencyDetailModel.findAll({
        where: {
          [Op.ne]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('short_name')),
              sequelize.fn('lower', req.body.display_name),
            ),
            // sequelize.where(sequelize.col('id'), id),
          ]
        }
      });

      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update({ usersData }, {
          where: {
            id: id,
          }
        })
        tabledAlteredSuccessfully = true;
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
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
      }
      else {
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


  static updateIndentor = async (req, res) => {
    try {
      const id = req.body.id;
      const { internalCall } = req.body

      const existingAgencyData = await agencyDetailModel.findAll({
        include: [{ model: userModel, where: { user_type: 'BPC' } }],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              // created_by: { [Op.eq]: req.body.created_by },

              id: { [Op.ne]: req.body.id }
            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        const returnResponse = {
          error: 'Production Centre Name is Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }


      const existingData = await agencyDetailModel.findAll({
        include: [{ model: userModel, where: { user_type: 'BPC' } }],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              // created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: req.body.id }

            },


          ]
        },
      });

      if (existingData.length != 0) {

        const returnResponse = {
          error: 'Short Name is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
      // let existingEmaiData = await agencyDetailModel.findAll({
      //   // where: sequelize.where(
      //   //   sequelize.fn('lower', sequelize.col('short_name')),
      //   //   sequelize.fn('lower', req.body.display_name),
      //   // )
      //   where: {
      //     [Op.and]: [
      //       {
      //         where: sequelize.where(
      //           sequelize.fn('lower', sequelize.col('email')),
      //           sequelize.fn('lower', req.body.email),
      //         ),

      //         id: { [Op.ne]: req.body.id }
      //       },

      //     ]
      //   },
      // });
      // if (existingEmaiData.length != 0) {
      //   let returnResponse = {
      //     error: 'Email is Already registered'
      //   }

      //   return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      // }


      const data = await agencyDetailModel.update({
        agency_name: req.body.agency_name,
        created_by: req.body.created_by,
        // category: req.body.category,
        state_id: req.body.state_code,
        district_id: req.body.district_code,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation_id: req.body.contact_person_designation_id,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        // email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        contact_person_mobile: req.body.mobile_number,
        is_active: req.body.active,
        name_of_insitution: req.body.name_of_institute,

        order: [['id', 'Desc']]
      }, {
        where: {
          id: id,
        }
      })

      const userData = await userModel.update({
        is_active: req.body.active,
        // username: req.body.email
      }, {
        where: {
          agency_id: req.body.id
        }
      }
      )

      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }


    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static breederList = async (req, res) => {
    let data = {};
    try {
      let rules = {
        'search.state_id': 'integer',
        'search.district_id': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      let { page, pageSize } = req.body;
      let condition = {

      };
      if (req.body.id) {
        const result = await bspcToPlants.findAll({
          where: {
            agency_id: req.body.id
          }
        })
        if (result && result.length > 0) {
          console.log(result.length, 'req.body.id')

          condition = {
            include: [
              {
                model: designationModel,
                left: true,
                attributes: ['name']
              },
              {
                model: stateModel,
                left: true,
                attributes: ['state_name'],
              },
              {
                model: districtModel2,
                left: true,
                attributes: ['district_name'],
              },

              {
                model: userModel,
                left: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                }
              },
              {
                model: bspcToPlants,
                required: false,
                include: [{
                  model: userModel,
                  required: false,
                  where: {
                    // is_active: 1
                    id: [sequelize.col('bspc_to_plants.plant_id')]
                  },
                  // required: true,
                  attributes: ['id', [sequelize.col('name'), 'plant_name']]
                }]
              }
            ],
            // left: true,
            where: {
              id: req.body.id,
              // created_by: req.bod.user_id


            }
          };
        } else {
          condition = {
            include: [
              {
                model: designationModel,
                left: true,
                attributes: ['name']
              },
              {
                model: stateModel,
                left: true,
                attributes: ['state_name'],
              },
              {
                model: districtModel2,
                left: true,
                attributes: ['district_name'],
              },

              {
                model: userModel,
                left: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                }
              },
              // {
              //   model: bspcToPlants,
              //   // required: true,
              //   include: [{
              //     model: plantDetails,
              //     where: {
              //       is_active: 1
              //     },
              //     // required: true,
              //     attributes: ['id', 'plant_name']
              //   }]
              // }
            ],
            where: {
              id: req.body.id,
              // created_by: req.bod.user_id


            }
          };
        }
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel2,
              left: true,
              attributes: ['district_name'],
            },
            {
              model: userModel,
              left: true,
              attributes: [],
              where: {
                user_type: 'BPC'
              }
            },
            {
              model: bspcToPlants,
              required: false,
              include: [{
                // model: plantDetails,
                // left: true,
                // attributes: ['id', 'plant_name']
                model: userModel,
                required: false,
                where: {
                  // is_active: 1
                  id: [sequelize.col('bspc_to_plants.plant_id')]
                },
                // required: true,
                attributes: ['id', [sequelize.col('name'), 'plant_name']]
              }]
            }
          ],
          // left: true,
          where: {
            // created_by: 4
            // created_by: req.body.user_id
          }
        };
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];
      //      condition.order = [[sequelize.col('m_state.state_name'),'ASC'],[sequelize.col('m_district.district_name'),'ASC'],[sequelize.col('m_crop_variety.variety_name'),'ASC']];
      // condition.order = [[sequelize.col('m_state.state_name'), 'ASC'], [sequelize.col('m_district.district_name'), 'ASC']];

      // condition.order = [['id','Desc']];
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
      }

      data = await agencyDetailModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getbreederList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.state_id': 'integer',
        'search.district_id': 'integer',
        'search.agencyName': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        where: {
          is_active: 1
        },
        raw: false,

      };


      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }

        if (req.body.search.district_id) {

          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agencyName) {

          condition.where.agency_name = (req.body.search.agencyName);
        }

      }


      const queryData = await agencyDetailModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, returnResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getAgencyDetails = async (req, res) => {
    let data = {};


    try {
      data = await agencyDetailModel.findAll({
        order: [['agency_name', 'ASC']]
      });

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static viewCrop = async (req, res) => {

    try {
      let condition = {}
      condition.order = [['crop_name', 'Desc']];
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)  // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }

      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          // if (element.columnNameInItemList.toLowerCase() == "croupGroup.value") {
          //   condition.where["croupGroup"] = element.value;
          // }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["cropName"] = element.value;
          }
        }
      }
      // data = await cropModel.findAll({
      //   order: [['id', 'ASC']]
      // });
      let data = await cropModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }

  }
  static deleteCropDetails = async (req, res) => {
    try {
      cropModel.destroy({
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
  static deleteBreederCropDetails = async (req, res) => {
    try {
      breederCropModel.destroy({
        where: {
          id: req.params.id
        }
      });
      breederCropsVerietiesModel.destroy({
        where: {
          breeder_crop_id: req.params.id
        }
      })
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static getBreederSeedssubmisionWithId = async (req, res) => {
    try {
      const data = await cropModel.findAll({
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
  static getBreedersSeedssubmisionWithId = async (req, res) => {
    try {
      // , "created_at", "updated_at", "created_at" AS "createdAt", "updated_at" AS "updatedAt"
      const data = await breederCropModel.findAll(

        {
          include: [
            {
              model: cropModel,
              include: [
                {
                  model: cropGroupModel
                }
              ],

            },
            {
              model: userModel,
              include: [
                {
                  model: agencyDetailModel,
                  attributes: ['id', 'agency_name']
                }
              ]
            }
          ],
          attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'crop_group', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data', 'variety', 'is_active'],
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

  static getTransactionsDetails = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        'search.crop_group': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        where: {
          is_active: 1
        },
        raw: false,

      };

      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.crop_name) {
          condition.where.crop_name = (req.body.search.crop_name);
        }

        if (req.body.search.crop_group) {

          condition.where.crop_group = (req.body.search.crop_group);
        }

      }


      const queryData = await cropModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, returnResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBreederCropDetails = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'integer',
        'search.crop_group': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      if (!page) page = 1;
      let season = "";
      if (req.body.search.season) {
        season = req.body.search.season;
      }

      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              season: season ? season : ''
            }
          },
          {
            model: userModel
          }
        ],
        where: {
          is_active: 1
        },
        raw: false,

      };

      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.crop_name) {
          condition.where.crop_name_id = (req.body.search.crop_name);
        }

        if (req.body.search.crop_group) {

          condition.where.crop_group_code = (req.body.search.crop_group);
        }


      }


      const queryData = await breederCropModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, returnResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static cropName = async (req, res) => {
    let returnResponse = {};
    try {
      // console.log('req.body.loginedUserid', req.body.loginedUserid);
      let condition = {
        where: {
          breeder_id: req.body.loginedUserid.id
        }
      };

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
      }

      condition.order = [['crop_name', 'ASC']];
      returnResponse = await cropModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static assignIndentingData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [{
            required: true,
            model: cropModel,
            raw: true,
            required: true,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
            }
          },
          {
            required: true,
            model: varietyModel,

            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
          ],
          where: {}
        };
      }
      else {
        condition = {
          include: [{
            required: true,
            model: cropModel,
            raw: true,
            required: true,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
            }
          },
          {
            required: true,
            model: varietyModel,
            where: {
              is_active: 1

            },
            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
          ],
          where: {}
        };
      }

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
          condition.distinct = true;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
      }

      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static assignIndentingVarietyData = async (req, res) => {
    let returnResponse = {};
    try {
      let breederId;
      if (req.body && req.body.search && req.body.search.user_type == "bspc") {

      } else {
        breederId = {
          breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
        }
      }
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [{
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
            required: true,
            model: varietyModel,

            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
          ],
          where: {}
        };
      }
      else {
        condition = {
          include: [{
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
            required: true,
            model: varietyModel,
            where: {
              is_active: 1

            },
            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.id')), 'variety_id'],
            // [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
          ],
          where: {
            icar_freeze: 1
          }
        };
      }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
          condition.distinct = true;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
      }

      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static cropAssignIndentingData = async (req, res) => {
    let returnResponse = {};
    try {
      let breederId;
      if (req.body && req.body.search && req.body.search.user_type == "bspc") {

      } else {
        breederId = {
          breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
        }
      }
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [{
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
            required: true,
            model: varietyModel,
            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.group_code'), 'group_code'],
            [sequelize.col('m_crop.is_active'), 'is_active'],
          ],
          where: {}
        };
      }
      else {
        condition = {
          include: [{
            required: true,
            model: cropModel,

            raw: true,
            required: true,
            attributes: [],
            where: {
              ...breederId,
              is_active: 1
            }
          },
          {
            required: true,
            model: varietyModel,
            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.group_code'), 'group_code'],
            [sequelize.col('m_crop.is_active'), 'is_active'],
          ],
          where: {
            icar_freeze: 1
          }
        };
      }

      condition.group = [
        [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.id'), 'm_crop_id'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('m_crop.group_code'), 'group_code'],


      ];
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
      }

      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }



  static sessionAssignIndentingData = async (req, res) => {
    let returnResponse = {};
    try {
      let breederId;
      if (req.body && req.body.search && req.body.search.user_type == "bspc") {

      } else {
        breederId = {
          breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
        }
      }
      let condition = {
        include: [{
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
          required: true,
          model: varietyModel,
          attributes: [],
          raw: true,
        },
        {
          required: true,
          model: seasonModel,
          attributes: [],
          raw: true,
        }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.season')), 'season_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code'],
        ],
        where: {
          icar_freeze: 1
        }
      };
      condition.group = [
        [sequelize.col('indent_of_breederseeds.season'), 'season_code'],
        [sequelize.col('m_season.season'), 'season'],
        [sequelize.col('m_season.season_code'), 'season_code'],


      ];
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
      }

      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static yearAssignIndentingData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.year')), 'year'],
        ],
        include: [
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442
            }
          }
        ],
        where: {
          icar_freeze: 1
        }
      };
      condition.order = [['year', 'DESC']]
      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static deleteUser = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await userModel.destroy({
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
  static viewCrop = async (req, res) => {
    let data = {};
    console.log('data1111111', data)

    try {
      data = await cropModel.findAll({
        order: [['id', 'Desc']]
      });

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static deleteBreederSeedssubmisionWithId = async (req, res) => {
    try {

      const condition = {
        where: {
          agency_id: Number(req.params.id)
        },
        attributes: ['id', 'code', 'username', 'user_type']
      };
      let data = await userModel.findOne(condition);

      console.log("dtaaa", data)
      const USER_API_KEY = process.env.USER_API_KEY
      let seedUserData = { "appKey": USER_API_KEY, "stateCode": "CENTRAL", "role": data.user_type, "userid": data.username }
      console.log("seedUserData", seedUserData)
      await SeedUserManagement.inactiveUser(seedUserData);


      let usermodel = await userModel.findOne({
        where: {
          agency_id: parseInt(req.params.id)
        },
        attributes: ['id'],
        raw: true
      });

      if (usermodel && usermodel.id) {
        const param={
          is_active:0
        }

        agencyDetailModel.update(param,{
          where: {
            id: req.params.id
          }
        });

        userModel.update(param,{

          where: {
            id: usermodel.id
          }
        })
      }
      /*
            agencyDetailModel.destroy({
              where: {
                id: req.params.id
              }
            });
      */
      let cropdata = await cropModel.findAll({
        where: {
          breeder_id: req.params.id
        }
      });

      if (cropdata && cropdata != undefined && cropdata.length > 0) {

        let updatecrop = await cropModel.update({
          breeder_id: null
        }, {
          where: {
            breeder_id: req.params.id
          }
        });
      }

      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static submitIndentsbreederseedslist = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {
        include: [
          {
            model: userModel,
            attributes: ['id'],
            left: true,
            include: [
              {
                model: agencyDetailModel,
                left: true,
                attributes: ['id', 'short_name'],
                /*      include: [{
                        model: indenterSPAModel,
                        left: true,
                        attributes: ['id', 'state_code','is_freeze'],
                      }]*/
              },
            ],
            where: {
              // id: {
              //   [Op.ne]: null,
              // },
              user_type: 'IN'
            }
          },
          {
            model: varietyModel,
            left: true,
            attributes: ['variety_name', 'variety_code'],
          },
          {
            model: cropModel,
            include: [
              {
                model: cropGroupModel
              }
            ]
          }
        ],
        attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'is_freeze'],
        where: {
          user_id: {
            [Op.ne]: null,
            // distinct: true
          },
          // state_short_name:{
          //   [Op.ne]: null,
          // }
          // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          // raw: false,
        },
        // group:['indent_of_breederseeds.variety_id']
      };
      if (req.body.type) {
        if (req.body.type == "seed") {
          if (req.body.is_freeze || req.body.is_freeze == 0) {
            // condition.where.is_freeze = req.body.is_freeze
          }
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        // if (req.body.search.group_code) {
        //   condition.where.group_code = req.body.search.group_code;
        // }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.is_freeze !== undefined) {
          // condition.where.is_freeze = req.body.is_freeze;
        }
      }
      data = await indentorBreederSeedModel.findAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      // let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getUniqueIndentorOfBreederSeeds = async (req, res) => {
    try {
      const filters = req.body.filters;
      const user = req.body.loginedUserid;

      let condition = {
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.user_id')), 'user_id']],
        include: [
          {
            model: userModel,
            left: true,
            include: [
              {
                model: agencyDetailModel,
                left: true,
                attributes: ['id', 'short_name'],
              },
            ],
            where: {
              user_type: 'IN'
            }
          }
        ],
        raw: true,
        where: {
          // year: filters.year,
          // season: filters.season,
          // crop_code: filters.crop_code,
        },
      };
      if(filters){
        if(filters.crop_code){
          condition.where.crop_code = filters.crop_code
        }
        if(filters.year){
          condition.where.year = parseInt(filters.year)
        }
        if(filters.season){
          condition.where.season = filters.season
        }
        if(filters.crop_code_array && filters.crop_code_array.length ){
          condition.where = {
            crop_code:{
              [Op.in]:filters.crop_code_array
            }
          }
        }
      }
     
      if (user.user_type == "ICAR") {
        // condition.where.is_freeze = 1
        condition.where.crop_code = {
          [Op.like]: "A%",
        }
      } else if (user.user_type == "HICAR") {
        // condition.where.is_freeze = 1
        condition.where.crop_code = {
          [Op.like]: "H%",
        }
      } else if (filters.user_type == "nodal") {
        condition.where.is_forward = 1
      }
      else if (filters.user_type == "seed-division") {
        // condition.where.is_indenter_freeze = 1
      } else {
        condition.where.icar_freeze = 1

      }
      if (filters && filters.crop_code) {
        condition.where.crop_code = filters.crop_code
      }
      const data = await indentorBreederSeedModel.findAll(condition);

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getDataForReceivedIndentsOfBreederSeeds = async (req, res) => {
    try {
      const filters = req.body.filters;
      const user = req.body.loginedUserid;

      const condition = {
        include: [
          {
            model: userModel,
            attributes: ['id'],
            left: true,
            include: [
              {
                model: agencyDetailModel,
                left: true,
                attributes: ['id', 'short_name'],
              },
            ],
            where: {
              user_type: 'IN'
            }
          },
          {
            model: varietyModel,
            include: [
              {
                model: db.lineVariety

              }
            ],
            left: true,
            attributes: ['variety_name', 'variety_code', 'not_date'],
            where: {}
          },
        ],
        attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'is_freeze', 'icar_freeze'],
        where: {
          user_id: {
            [Op.ne]: null,
          },
          year: filters.year,
          season: filters.season,
          crop_code: filters.crop_code,
        },
      };

      if (user.user_type == "ICAR") {
        condition.where.is_forward = 1
        condition['include'][1].where["crop_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        condition.where.is_forward = 1
        condition['include'][1].where["crop_code"] = {
          [Op.like]: "H%",
        }
      }
      else if (filters.user_type == "seed-division") {
        //condition.where.is_indenter_freeze = 1
      } else {
        condition.where.icar_freeze = 1
      }

      const data = await indentorBreederSeedModel.findAll(condition);

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(returnResponse)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getShortIndenterName = async (req, res) => {
    try {
      var data = {};
      let condition = {};


      console.log(req.body.icar, 'ica')
      if (req.body.search.year && req.body.icar) {
        condition = {
          include: [
            {
              model: agencyDetailModel,
              attributes: ['id', 'short_name', 'agency_name'],
              // order:[['short_name', 'ASC']],
              left: true,
              where: {
                id: {
                  [Op.ne]: null
                },
                is_active: 1
              },
            },
            {
              model: indentorBreederSeedModel,
              attributes: [],
              required: true,
              raw: true,
              where: {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_freeze: req.body.is_freeze,

              }
            }
          ],
          attributes: [],
          where: {
            user_type: 'IN'
          },
          raw: true,
        }
      }

      else if (req.body.search.year) {
        condition = {
          include: [
            {
              model: agencyDetailModel,
              attributes: ['id', 'short_name', 'agency_name'],
              // order:[['short_name', 'ASC']],
              left: true,
              where: {
                id: {
                  [Op.ne]: null
                },
                is_active: 1
              },
            },
            {
              model: indentorBreederSeedModel,
              attributes: [],
              required: true,
              raw: true,
              where: {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_freeze: req.body.is_freeze,
                icar_freeze: req.body.icar_freeze,
              }
            }
          ],
          attributes: [],
          where: {
            user_type: 'IN'
          },
          raw: true,
        }
      }
      else {
        condition = {
          include: [
            {
              model: agencyDetailModel,
              attributes: ['id', 'short_name', 'agency_name'],
              // order:[['short_name', 'ASC']],
              left: true,
              where: {
                id: {
                  [Op.ne]: null
                },
                is_active: 1
              },
            },
            {
              model: indentorBreederSeedModel,
              attributes: [],
              required: true,
              raw: true,
              where: {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_freeze: req.body.is_freeze
              }
            }
          ],
          attributes: [],
          where: {
            user_type: 'IN'
          },
          raw: true,
        }
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'agency_detail.short_name';
      // const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.group = [['agency_detail.id']]
      condition.order = [[sequelize.col('agency_detail.short_name'), 'ASC']];
      data = await userModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static indentslist = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];


      data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)

      let returnResponse = await paginateResponse(data);
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static viewIndentor = async (req, res) => {
    let data = {};
    try {

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        raw: false,
        attributes: [
          'id', 'agency_name'


          // [sequelize.fn('DISTINCT', sequelize.col(agency_name)), 'agency_name']
          // [sequelize.literal('DISTINCT(agency_name)'), 'crop_name']
          // [sequelize.literal('DISTINCT(agency_name)'), 'agency_name'],
        ],
        distinct: true,
        where: {
          // created_by: 4
          // category:5

        }

      };

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [['agency_name', 'ASC']];

      data = await agencyDetailModel.findAll(condition, {
        distinct: 'agency_name'
      });
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  // static viewIndentorBreeder = async (req, res) => {
  //   let data = {};
  //   try {
  //     // let { page, pageSize } = req.body;
  //     // if (!page) page = 1;
  //     let condition = {
  //       // raw: true,
  //       // attributes: [
  //       // 'id', 'name'
  //       // [sequelize.fn('DISTINCT', sequelize.col(agency_name)), 'agency_name']
  //       // [sequelize.literal('DISTINCT(agency_name)'), 'crop_name']
  //       // [sequelize.literal('DISTINCT(agency_name)'), 'agency_name'],
  //       // ],

  //       // distinct: true,
  //       where: {
  //         is_active: 1,
  //         user_type: "BPC"
  //       }
  //     };
  //     // const sortOrder = req.body.sort ? req.body.sort : 'id';
  //     // const sortDirection = req.body.order ? req.body.order : 'DESC';
  //     // if (page && pageSize) {
  //     //   condition.limit = pageSize;
  //     //   condition.offset = (page * pageSize) - pageSize;
  //     // }
  //     // condition.order = [[sortOrder, sortDirection]];
  //     condition.order = [['name', 'ASC']];
  //     if (req.body.search) {
  //       if (req.body.search.id) {
  //         condition.where.created_by = req.body.search.id
  //       }
  //     }
  //     data = await userModel.findAll(condition);
  //     //    {
  //     //   // distinct: 'agency_name'
  //     // });
  //     // res.send(data)
  //     console.log('data', data);
  //     response(res, status.DATA_AVAILABLE, 200, data)
  //   } catch (error) {
  //     console.log('through error',error)
  //     response(res, status.DATA_NOT_AVAILABLE, 500)
  //   }
  // }

  static viewIndentorBreeder = async (req, res) => {
    try {

      let yaerValue;
      let seasonValue;
      let cropCodeValue;
      if (req.body.search) {
        if (req.body.search.year) {
          yaerValue = { year: req.body.search.year }
        }
        if (req.body.search.season) {
          seasonValue = { season: req.body.search.season }
        }
        if (req.body.search.crop_code) {
          cropCodeValue = { crop_code: req.body.search.crop_code }
        }
      }
      const breederassignData = await breederCropModel.findAll({
        where: {
          ...yaerValue,
          ...seasonValue,
          ...cropCodeValue,
        },
        attributes: ['production_center_id'],
        raw: true,
      });
      let breederCrop = []
      breederassignData.forEach(el => {
        breederCrop.push(el && el.production_center_id ? el.production_center_id : '');
      })
      breederCrop = [...new Set(breederCrop)]
      let condition = {}
      if (breederCrop && breederCrop.length > 0) {

        condition = {
          include: [
            {
              model: agencyDetailModel,
              where: {
                [Op.and]: [
                  {
                    id: {
                      [Op.ne]: null
                    },
                  },
                ]
              },
              attributes: []
            }
          ],
          where: {
            is_active: 1,
            user_type: "BPC",
            id: {
              [Op.notIn]: breederCrop
            }
            // created_by: req.body.loginedUserid.id
          },
          attributes: [
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('agency_detail.id'), 'agencyid'],
            'id'
          ]
        }
      } else {
        condition = {
          include: [
            {
              model: agencyDetailModel,
              where: {
                [Op.and]: [
                  {
                    id: {
                      [Op.ne]: null
                    },
                  },
                ]
              },
              attributes: []
            }
          ],
          where: {
            is_active: 1,
            user_type: "BPC",
            // created_by: req.body.loginedUserid.id
          },
          attributes: [
            [sequelize.col('agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('agency_detail.id'), 'agencyid'],
            'id'
          ]
        }
      }
      condition.order = [[sequelize.fn('lower', sequelize.col('agency_detail.agency_name')), 'ASC']]
      const data = await userModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static breedercropList = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [{
          model: cropModel
        },
        {
          model: userModel
        },
          // {
          //   model: breederCropsVerietiesModel,
          //   include: {
          //     model: varietyModel,
          //     attributes: ['id', 'variety_code', 'variety_name']
          //   }
          // }
        ],
        // group: [sequelize.col('breeder_crops_veriety.m_crop_variety.id'), 'id']

      };
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [[sequelize.col('name'), 'ASC']]

      data = await breederCropModel.findAndCountAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static breedercropNewList = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition1 = {}
      let condition = {
        include: [{
          model: cropModel,
          required: true,
          attributes: [],
          include: [
            {
              model: seasonModel,
              attributes: [],
              required: false,
            }
          ]
        },
        {
          model: userModel,
          required: true,
          attributes: [],
          include: [
            {
              model: agencyDetailModel,
              required: true,
              attributes: [],
            }
          ]
        },
        {
          model: cropGroupDataModel,
          required: true,
          attributes: []
        },
        {
          model: breederCropsVerietiesModel,
          required: true,
          attributes: [],
          include: {
            model: varietyModel,
            required: true,
            attributes: []
            // /: ['id', 'variety_code', 'variety_name']
          },

        }
        ],
        raw: true,
        attributes: ['veriety_data', 'production_center_id',
          [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
          [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
          [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
          [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
          [sequelize.col('user.name'), 'user_name'],
          [sequelize.col('m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop->m_season.season'), 'season'],
          [sequelize.col('m_crop.is_active'), 'is_active'],
          [sequelize.col('user->agency_detail.agency_name'), 'full_name'],
          [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
          [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
          [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".id::varchar,',')`), 'variety_id']
        ],
        group: [
          [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
          [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
          [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
          [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
          [sequelize.col('user.name'), 'user_name'],
          [sequelize.col('m_crop_group.group_name'), 'group_name'],
          [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
          [sequelize.col('m_crop->m_season.season'), 'season'],
          [sequelize.col('m_crop.is_active'), 'is_active'],
          [sequelize.col('user->agency_detail.agency_name'), 'full_name']
        ],
        left: false,
        raw: true,
        where: {
        }
      };


      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      // set pageSize to -1 to prevent sizing pageSize = 10;
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sortOrder, sortDirection]];
      if (req.body && req.body.id) {
        condition.where.user_id = (req.body.id);
      }
      if (req.body.search) {
        if (req.body.search.crop_name) {
          condition.where.crop_name_id = (req.body.search.crop_name);
        }
        if (req.body.search.crop_group) {
          condition.where.crop_group_code = (req.body.search.crop_group);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.year_of_indent) {
          condition.where.year = (req.body.search.year_of_indent);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
      }
      const coiuntwithoutCondition = await breederCropModel.count({ where: { user_id: req.body.id } });

      data = await breederCropModel.findAll(condition);
      // console.log('data===========', data);
      const countwithCondition = await breederCropModel.count(condition);
      // console.log(coiuntwithoutCondition, 'coiuntwithoutCondition')

      let count;
      // console.log('req.body.search', req.body.search)
      // year_of_indent: '', season: '', crop_code: ''
      if (req.body.search && req.body.search.year_of_indent == '' && req.body.search.season == '' && req.body.search.crop_code == '') {
        count = coiuntwithoutCondition;
      }
      if (req.body.search && req.body.search.year_of_indent != '' || req.body.search.season != '' || req.body.search.crop_code != '') {
        count = countwithCondition.length
      }
      let resData = { count, data };
      response(res, status.DATA_AVAILABLE, 200, resData);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }


  static addBreeder = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      let existingData = undefined;
      let existingAgencyData = undefined;
      const { internalCall } = req.body
      const data = agencyDetailModel.build({
        agency_name: req.body.agency_name,
        category: req.body.category,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation_id: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        // bank_name: req.body.bank_name,
        // bank_branch_name: req.body.bank_branch_name,
        // bank_ifsc_code: req.body.bank_ifsc_code,
        // bank_account_number: req.body.bank_account_number,
        mobile_number: req.body.mobile_number,
        created_by: req.body.createdby,
        image_url: req.body.image_url,
        crop_data: req.body.crop_data
      });
      existingAgencyData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "BR"
            }
          }
        ],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              // created_by: { [Op.eq]: req.body.createdby }

            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Co-ordinator Name is Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }


      existingData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "BR"
            }
          }
        ],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              // created_by: { [Op.eq]: req.body.createdby }
            },


          ]
        },
      });

      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      let existingEmaiData = await agencyDetailModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }
      const insertData = await data.save();
      const user_dataCount = await userModel.max('code', { where: { user_type: 'BR' } });
      const code = user_dataCount == null || user_dataCount == undefined || user_dataCount == '' ? 1 : parseInt(user_dataCount) + 1;
      let userFinalCode = code <= 9 ? '00' + (code).toString() : parseInt(code) <= 99 ? '0' + (code).toString() : code.toString();
      // let count = user_dataCount == null || user_dataCount == undefined || user_dataCount == '' ? '001' : parseInt(user_dataCount) + 1
      //   let bspcCode = count <= 9 ? '00' + (count).toString() : parseInt(count) <= 99 ? '0' + (count).toString() : parseInt(count) > 99 && parseInt(count) < 999
      //     ? '0' + (count).toString() : count;

      const userData = userModel.build({



        agency_id: insertData.id,
        username: 'pdpc' + '-' +(req.body.display_name.trim().toLowerCase()),
        name: req.body.display_name,
        email_id: req.body.email,
        unm: 'pdpc' + '-' +(req.body.display_name.trim().toLowerCase()),
        password: '123456',
        mobile_number: req.body.mobile_number,
        // designation_id: req.body.contact_person_designation,
        user_type: 'BR',
        code: userFinalCode,
        created_by: req.body.createdby,
        updated_by: req.body.updatedBy
        // id:id
      });



      await userData.save();
      const datas = agencyDetailModel.update({
        user_id: userData.id
      }, {
        where: {
          id: insertData.id
        }
      })



      //implement update crop functionality 
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.crop_data !== undefined
        && req.body.crop_data.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.crop_data.length; index++) {
          const element = req.body.crop_data[index];
          const datas = cropModel.update({
            breeder_id: userData.id
          }, {
            where: {
              crop_code: element.crop_code
            }
          })
        }
      }


      const USER_API_KEY = process.env.USER_API_KEY
      let seedUserData = {
        "appKey": USER_API_KEY,
        "stateCode": "CENTRAL",
        "userid": 'pdpc' + '-' +(req.body.display_name.trim().toLowerCase()),
        "password": "seeds#234",
        "name": req.body.display_name,
        "role": "BR"
      }
      await SeedUserManagement.createUser(seedUserData);
      if (req.body.search) {
        condition.where = {};
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        let data = await agencyDetailModel.findAndCountAll(condition);
       
        
        if (data) {

          return response(res, status.DATA_AVAILABLE, 200, data)
        }
        else {
          return response(res, status.DATA_NOT_AVAILABLE, 400)
        }
      }

      return response(res, status.DATA_SAVE, 200, userData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static addBreederSeedList = async (req, res) => {
    let data = {};
    try {
      let rules = {
        'search.state_code': 'integer',
        'search.district_id': 'integer',
        'search.agencyName': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      // if (!page) page = 1;

      let condition = {
      };
      if (req.body.id) {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: userModel,
              left: true,
              attributes: [],
              where: {
                user_type: 'BR'
              }
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            // {
            //   model:db.categoryModel,
            //   // on: sequelize.literal('CAST("agency_detail"."category" AS INTEGER) = "m_category_of_oragnizations"."category_code"'),
            //   where:{
            //     // type:'BR'
            //   }

            // }
          ],
          where: {
            id: req.body.id,
            // created_by: req.body.user_id

          }
        };
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              duplicating: false,
              attributes: ['name']
            },
            {
              model: userModel,
              left: true,
              duplicating: false,
              attributes: [],
              where: {
                user_type: 'BR'
              }
            },
            {
              model: stateModel,
              left: true,
              duplicating: false,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              duplicating: false,
              attributes: ['district_name'],
            },
            //   {
            //   model: db.categoryModel,
            //   left: true,
            //   duplicating: false,
            //   // attributes: ['district_name'],
            // },
          ],
          where: {
            // created_by: 2
            // created_by: req.body.user_id
          }
        };
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      // set pageSize to -1 to prevent sizing pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [['agency_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC'],];
      // condition.order = [['id', 'DESC']];

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // console.log('req.body.searchreq.body.search', req.body.search);
      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.state_id = (req.body.search.state_code);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agencyName) {
          condition.where.agency_name = (req.body.search.agencyName);
        }
      }
      // condition.order = [[sequelize.col('id'), 'DESC'], [sequelize.col('m_state.state_name'), 'ASC'], [sequelize.col('m_district.district_name'), 'ASC']];

      data = await agencyDetailModel.findAndCountAll(condition);


      console.log('data', data);
      // res.send(data)
      // let result = data && data.rows ? data.rows : '';
      // let sorArr = result;
      // let sorArr = result.sort((a, b) => {
      //   // data.m_crop_variety.variety_name
      //   return a.m_state.state_name.localeCompare(b.m_state.state_name) || a.m_district.district_name.localeCompare(b.m_district.district_name)
      //     || a.agency_name.localeCompare(b.agency_name)
      //   // || a.m_crop_variety.variety_name.localeCompare(b.m_crop.crop_name);
      // }
      // );
      // console.log('sorArr==>',sorArr);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static updateBreederSeedList = async (req, res) => {
    try {
      const id = req.body.id;
      let existingAgencyData = undefined;
      let existingData = undefined;
      let userId;
      //implement update crop functionality 
      if (req.body.id) {
        let userData = await userModel.findOne({
          where: {
            agency_id: req.body.id
          },
          raw: true
        })
        console.log('user ===== data', userData.id);
        // return;
        userId = userData.id;
        if (userData && userData.id) {
          const datas = cropModel.update({
            breeder_id: null
          }, {
            where: {
              breeder_id: userData.id
            }
          })
        }
      }

      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.crop_data !== undefined
        && req.body.crop_data.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.crop_data.length; index++) {
          const element = req.body.crop_data[index];
          const datas = cropModel.update({
            breeder_id: req.body.user_id
          }, {
            where: {
              crop_code: element.crop_code
            }
          })
        }
      }

      existingAgencyData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "BR"
            }

          }
        ],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),
                // created_by:{[Op.and]:req.body.createdby}
              ),
              // created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: req.body.id }
            },
          ]
        },
      });

      if (existingAgencyData && existingAgencyData.length) {
        const returnResponse = {
          error: 'Co-ordinator Name is Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      existingData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "BR"
            }

          }
        ],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),

              id: { [Op.ne]: req.body.id }
            },
          ]
        },
      });

      if (existingData.length != 0) {
        const returnResponse = {
          error: 'Short Name is Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }

      let existingEmaiData = await agencyDetailModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),

              ),
              id: { [Op.ne]: req.body.id }

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        const returnResponse = {
          error: 'Email is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }
      const data = await agencyDetailModel.update({
        agency_name: req.body.agency_name,
        category: req.body.category,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation_id: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        // email: req.body.email,
        // bank_name: req.body.bank_name,
        // bank_branch_name: req.body.bank_branch_name,
        // bank_ifsc_code: req.body.bank_ifsc_code,
        // bank_account_number: req.body.bank_account_number,
        mobile_number: req.body.mobile_number,
        created_by: req.body.created_by,
        image_url: req.body.image_url,
        crop_data: req.body.crop_data,
        is_active: req.body.is_active
      }, {
        where: {
          id: id
        }
      })
      const userData = await userModel.update({ is_active: req.body.is_active }, {
        where: {
          agency_id: id
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

  static checkAlreadyExistsShortName = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.short_name': 'string',
      };

      // let validation = new Validator(req.body, rules);

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

      let condition = {
        where: {
          short_name: req.body.search.short_name,
          created_by: 2,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await agencyDetailModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getDynamicCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.group_code': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }



      let condition = {

        where: {
          crop_code: {
            [Op.like]: "%" + req.body.search.group_code + "%",
          },
          is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [['crop_code', 'Desc']];

      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getCropVerietyDataList = async (req, res) => {
    try {
      let condition = {
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      let data = await cropVerietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static editUserData = async (req, res) => {
    try {
      // console.log('updates');
      const id = req.body.id;
      const data = await userModel.update({
        agency_id: id,
        username: req.body.email,
        name: req.body.display_name,
        email_id: req.body.email,
        unm: req.body.email,
        password: '123456',
        mobile_number: req.body.mobile_number,
        // designation_id: req.body.contact_person_designation,
        user_type: 'BR',
      },
        {
          where: {
            agency_id: id
          }
        }
      )
      const userId = await agencyDetailModel.update({
        user_id: parseInt(req.body.agency_id)
      }, {
        where: {
          // user_id:
          id: id
        }
      }
      )
      if (data) {
        console.log(data, 'hii');
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static editUserDataProduction = async (req, res) => {
    try {
      // console.log('updates');
      const id = req.body.id;
      const data = await userModel.update({
        agency_id: id,
        username: req.body.email,
        name: req.body.display_name,
        email_id: req.body.email,
        unm: req.body.email,
        password: '123456',
        mobile_number: req.body.mobile_number,
        // designation_id: req.body.contact_person_designation,
        user_type: 'BPC',
      },
        {
          where: {
            agency_id: id
          }
        }
      )

      const userId = await agencyDetailModel.update({
        user_id: parseInt(req.body.agency_id)
      }, {
        where: {
          // user_id:
          id: id
        }
      }
      )
      console.log('dta', data);
      if (data) {
        console.log(data, 'hii');
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static breedercropData = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [{
          model: cropModel,

          // group:[sequelize.col('m_crop.crop_group')]
        },
        {
          model: userModel
        },
        {
          model: cropGroupDataModel,
          required: true,
          attributes: []
        },
        {
          model: breederCropsVerietiesModel,
          required: true,
          attributes: [],
          include: {
            model: varietyModel,
            required: true,
            attributes: []
            // /: ['id', 'variety_code', 'variety_name']
          },

        }
        ],
        attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'crop_group', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data', 'variety', 'is_active'],


        // attributes: [
        //   [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
        //   [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
        //   [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
        //   [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
        //   [sequelize.col('user.name'), 'user_name'],
        //   [sequelize.col('m_crop_group.group_name'), 'group_name'],
        //   // 'breeder_crops.id','breeder_crops_veriety.breeder_crop_id',
        //   [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
        //   // [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
        //   [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
        //   [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".id::varchar,',')`), 'variety_id']
        //   // [sequelize.literal("string_agg(m_crop_varieties.variety_name::varchar,',')"), 'variety_name']
        // ],
        // // breeder_crops.year, breeder_crops_verieties.breeder_crop_id,breeder_crops.season,
        // // m_crop.crop_name,"user"."name","user"."username",m_crop_groups.group_code,
        // // m_crop_groups.group_name,
        // group: [
        //   // [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
        //   // [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
        //   [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
        //   [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
        //   [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
        //   [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
        //   [sequelize.col('user.name'), 'user_name'],
        //   [sequelize.col('m_crop_group.group_name'), 'group_name'],
        //   [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id']
        // ],
      };
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety','ASC']]

      data = await breederCropModel.findAndCountAll(condition);
      let result = data && data.rows ? data.rows : '';

      let abc = result.filter(x => x.m_crop != null);
      const resultData = abc.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.m_crop.crop_group === thing.m_crop.crop_group
        ))
      )
      response(res, status.DATA_AVAILABLE, 200, resultData)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static breedercropDataFilter = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [{
          model: cropModel,

          // group:[sequelize.col('m_crop.crop_group')]
        },
        {
          model: userModel
        },
        // {
        //   model: seasonModel
        // },
        {
          model: cropGroupDataModel,
          required: true,
          attributes: []
        },
        {
          model: breederCropsVerietiesModel,
          required: true,
          attributes: [],
          include: {
            model: varietyModel,
            required: true,
            attributes: []
            // /: ['id', 'variety_code', 'variety_name']
          },

        }
        ],
        attributes: ['id', 'crop_code', 'crop_group_code', 'season', 'year', 'production_center_name', 'crop_group', 'production_center_id', 'user_id', 'crop_name_id', 'variety_id', 'veriety_data', 'variety', 'is_active'],


        // attributes: [
        //   [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
        //   [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
        //   [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
        //   [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
        //   [sequelize.col('user.name'), 'user_name'],
        //   [sequelize.col('m_crop_group.group_name'), 'group_name'],
        //   // 'breeder_crops.id','breeder_crops_veriety.breeder_crop_id',
        //   [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
        //   // [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
        //   [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
        //   [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".id::varchar,',')`), 'variety_id']
        //   // [sequelize.literal("string_agg(m_crop_varieties.variety_name::varchar,',')"), 'variety_name']
        // ],
        // // breeder_crops.year, breeder_crops_verieties.breeder_crop_id,breeder_crops.season,
        // // m_crop.crop_name,"user"."name","user"."username",m_crop_groups.group_code,
        // // m_crop_groups.group_name,
        // group: [
        //   // [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
        //   // [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
        //   [sequelize.col('breeder_crops.id'), 'breeder_crops_id'],
        //   [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
        //   [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
        //   [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
        //   [sequelize.col('user.name'), 'user_name'],
        //   [sequelize.col('m_crop_group.group_name'), 'group_name'],
        //   [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id']
        // ],
      };
      // if (page === undefined) page = 1;
      // if (pageSize === undefined)
      //   pageSize = 10; // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety','ASC']]

      data = await breederCropModel.findAndCountAll(condition);
      let result = data && data.rows ? data.rows : '';

      let abc = result.filter(x => x.m_crop != null);
      const resultData = abc.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.m_crop.crop_group === thing.m_crop.crop_group
        ))
      )
      response(res, status.DATA_AVAILABLE, 200, resultData)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getbreederCropNameList = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [{
          model: cropModel,

          // group:[sequelize.col('m_crop.crop_group')]
        },
        {
          model: userModel
        }

        ],
        // group: [sequelize.col('m_crop.crop_group'),'id']
      };
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      if (req.body.search) {
        console.log(req.body.search);
        if (req.body.search.crop_group_code) {
          condition.where.crop_group_code = req.body.search.crop_group_code;
        }

      }
      data = await breederCropModel.findAndCountAll(condition);
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety','ASC']]


      response(res, status.DATA_AVAILABLE, 200, resultData)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDataofBreeder = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: stateModel
          },
          {
            model: districtModel
          }
        ],
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
      }

      let data = await agencyDetailModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBreederProductionCenterDistrict = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {

        'state_id': 'string',


      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              'user_type': 'BPC'
              // user_type: 'breeder'
              // created_by:2
            }
          },
          {
            model: stateModel,
            left: false,
            raw: false

          },
          {
            model: districtModel,
            left: false,
            raw: false


          },

          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')) ,'district_code'],
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          sequelize.col('m_district.district_name')
        ],
        raw: true,
        where: {
          // user_type: 'breeder'
          // created_by: req.body.search.created_by
        }
      };
      if (req.body.search) {

        if (req.body.search.state_code) {

          condition.where.state_id = (req.body.search.state_code);
        }


      }
      // let { page, pageSize } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   // pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      const data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static breedercropName = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [
          {
            model: cropModel
          }

        ],
        attributes: [
          // sequelize.col('m_district.district_code'),

          // sequelize.col('m_district.district_name'),

          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          sequelize.col('m_crop.crop_name'),
          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')) ,'district_name'],
          // 'district_code','district_name'
          // [sequelize.literal("COUNT(DISTINCT(m_district.district_code))"), "m_district.district_code"],
        ],
        // attributes:[
        //   // [sequelize.literal('DISTINCT(season)'), 'season']
        //   // [sequelize.fn('DISTINCT', sequelize.col('year')) ,'year']
        // ],
        raw: true,
        left: false,
        where: {

        }

      };



      if (req.body && req.body.id) {
        condition.where.user_id = (req.body.id);
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]

      data = await breederCropModel.findAll(condition);
      // let dataCount = await breederCropModel.findAll(condition1);

      let count;
      // if (req.body.search) {
      //   count = data.length;
      // } else {
      //   count = dataCount.length;
      // }

      let resData = { count, data };
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static breedercropSeason = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {
        include: [

        ],

        attributes: [
          [sequelize.literal('DISTINCT(season)'), 'season']
          // [sequelize.fn('DISTINCT', sequelize.col('year')) ,'year']
        ],
        // raw: true,
        left: false,
        where: {

        }

      };



      if (req.body && req.body.id) {
        condition.where.user_id = (req.body.id);
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety','ASC']]

      data = await breederCropModel.findAll(condition);
      // let dataCount = await breederCropModel.findAll(condition1);

      let count;
      // if (req.body.search) {
      //   count = data.length;
      // } else {
      //   count = dataCount.length;
      // }

      let resData = { count, data };
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static breedercropYear = async (req, res) => {
    let data = {};
    try {
      let { page, pageSize } = req.body;
      let condition = {

        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
          // [sequelize.fn('DISTINCT', sequelize.col('year')) ,'year']
        ],
        // raw: true,
        left: false,
        where: {

        }

      };



      if (req.body && req.body.id) {
        condition.where.user_id = (req.body.id);
      }
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety','ASC']]

      data = await breederCropModel.findAll(condition);
      // let dataCount = await breederCropModel.findAll(condition1);

      let count;
      // if (req.body.search) {
      //   count = data.length;
      // } else {
      //   count = dataCount.length;
      // }

      let resData = { count, data };
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static getIndenterDetails = async (req, res) => {
    let data = {};
    let condition = {};
    try {
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
      }
      data = await indenterModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
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
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
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

  static getCountBPC = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "total_bpc"],
        ],
        where: {
          user_type: 'BPC',
          is_active: 1,
        }
      };
      data = await userModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBreederCountBPC = async (req, res) => {
    let data = {};
    let returnResponse = [];
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              user_type: 'BPC',
              is_active: 1,
            }
          }
        ],
        attributes: ["id"
        ],
        group: [
        ],
        where: {
        },
        raw: true
      };

      data = await agencyDetailModel.findAll(condition);
      if (data && data !== undefined && data.length > 0) {
        returnResponse = [{ "total_bpc": data.length }]
      }
      return response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBreederCountCrop = async (req, res) => {
    let data = {};
    let returnResponse = [];
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              user_type: 'BPC',
              is_active: 1,
            }
          }
        ],
        attributes: [
          // "breeder_crops"."production_center_id"
          [sequelize.literal("DISTINCT(breeder_crops.production_center_id)"), "total_bpc"],
        ],
        group: [
          [sequelize.literal("((breeder_crops.production_center_id))"), "total_bpc"],

          // [sequelize.col('breeder_crops.production_center_id'), "total_bpc"]
        ],
        where: {
          user_id: req.body.loginedUserid.id
        },
        raw: true
      };

      data = await breederCropModel.findAll(condition);
      console.log("data", data);
      if (data && data !== undefined && data.length > 0) {
        returnResponse = [{ "total_bpc": data.length }]
      }
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getTotalBreederCrop = async (req, res) => {
    let data = {};
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              // breeder_id: req.body.loginedUserid.id
            }
          }
        ],
        attributes: ["*"
        ],
        where: {
          breeder_id: req.body.loginedUserid.id
        },
        raw: true
      };
      data = await cropModel.findAll(condition);
      returnResponse = { 'total_crops': data ? data.length : 0 }
      return response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getChartIndentData = async (req, res) => {
    let data = {};
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
          {
            raw: true,
            model: bsp1Model,
            attributes: [],
            include: [
              {
                raw: true,
                model: bsp1ProductionCenterModel,
                attributes: [
                  [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"]
                ]
              }
            ]
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_name')), 'crop_name'],
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],

        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true,
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
      condition.group = [['crop_name']];
      data = await indenterModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getTotalAllocatedProdBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp1ProductionCenterModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "quantity_of_seed_produced"]
        ],
        where: {
          user_id: req.body.loginedUserid.id,
        },
        raw: true
      };

      if (req.body.search) {
        if (req.body.search) {
          if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
            condition.where.crop_code = {
              [Op.in]: req.body.search.crop_code
            };
          }
          if (req.body.search.season) {
            condition.where.season = {
              [Op.eq]: req.body.search.season
            };
          }
          if (req.body.search.crop_type) {
            condition.where.crop_code = {
              [Op.like]: req.body.search.crop_type + "%"
            };
          }
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);
          }
        }
      }

      data = await bsp1Model.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getTotalPendingAllocatedProdBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            raw: true,
            model: indenterModel,
            attributes: [],
            include: [
              {
                raw: true,
                model: bsp1Model,
                attributes: [],
                where: {},
                include: [
                  {
                    raw: true,
                    model: bsp1ProductionCenterModel,
                    attributes: [
                      [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"]
                    ]
                  }
                ]
              },
            ]
          },
        ],
        attributes: [
        ],
        where: {
          breeder_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      if (req.body.search) {
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code
          };
        }

        if (req.body.search.year) {
          condition.include[0].include[0].where.year = req.body.search.year
        }

        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }

        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body.search.crop_type + "%"
          };
        }

      }
      // condition.group = [['indent_of_breederseed.crop_code']];
      data = await cropModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartPendingBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            raw: true,
            model: indenterModel,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed.crop_name')), 'crop_name'],
            ],
            include: [
              {
                raw: true,
                model: bsp1Model,
                attributes: [],
                include: [
                  {
                    raw: true,
                    model: bsp1ProductionCenterModel,
                    attributes: [
                      [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"]
                    ]
                  }
                ]
              },
            ]
          },
        ],
        attributes: [],
        where: {
          // breeder_id:req.body.search.user_id,
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
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [['indent_of_breederseed.crop_name']];
      data = await cropModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static submitIndentsbreederseedsYear = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      const user = req.body.loginedUserid;
      condition = {
        include: [

        ],
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        where: {
          user_id: {
            [Op.ne]: null,
            // distinct: true
          },
          // state_short_name:{
          //   [Op.ne]: null,
          // }
          // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          // raw: false,
        },
        // group:['indent_of_breederseeds.variety_id']
      };
      // condition.order= ['year','DESC']
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.search.year;
      //   }
      //   // if (req.body.search.group_code) {
      //   //   condition.where.group_code = req.body.search.group_code;
      //   // }
      //   if (req.body.search.crop_code) {
      //     condition.where.crop_code = req.body.search.crop_code;
      //   }
      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season;
      //   }
      // }
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "seed") {
            // condition.where.is_indenter_freeze = 1
          }
          if (req.body.search.type == "nodal") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 1) {
            //   
            //   // condition.where.icar_freeze = 0
            // }
            condition.where.is_forward = 1
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }
        } else {
          condition.where.icar_freeze = 1
        }
      }
      if (user.user_type == "ICAR") {
        condition.where["crop_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        condition.where["crop_code"] = {
          [Op.like]: "H%",
        }
      }
      data = await indentorBreederSeedModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static submitIndentsbreederseedsSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      const user = req.body.loginedUserid;
      condition = {
        include: [

        ],
        attributes: [
          [sequelize.literal('DISTINCT(season)'), 'season']
        ],
        where: {
          user_id: {
            [Op.ne]: null,
            // distinct: true
          },
          // state_short_name:{
          //   [Op.ne]: null,
          // }
          // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          // raw: false,
        },
        // group:['indent_of_breederseeds.variety_id']
      };
      condition.order = [['season', 'ASC']]
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        // if (req.body.search.group_code) {
        //   condition.where.group_code = req.body.search.group_code;
        // }
        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = req.body.search.crop_code;
        // }
        // if (req.body.search.season) {
        //   condition.where.season = req.body.search.season;
        // }
      }

      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "seed") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 0) {
            // condition.where.is_freeze = req.body.search.is_freeze
            // }
            // condition.where.is_indenter_freeze = 1
          }
          if (req.body.search.type == "nodal") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 1) {
            condition.where.is_forward = 1;
            //   // condition.where.icar_freeze = 0;
            // }

            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }
        } else {
          condition.where.icar_freeze = 1
        }
      }
      if (user.user_type == "ICAR") {
        condition.where["crop_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        condition.where["crop_code"] = {
          [Op.like]: "H%",
        }
      }
      data = await indentorBreederSeedModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static submitIndentsbreederseedsCropGroup = async (req, res) => {
    let data = {};
    try {
      let condition = {};

      const user = req.body.loginedUserid;

      condition = {
        include: [
          {
            model: cropModel,
            left: true,
            raw: true,

            model: cropGroupModel,
            where: {},
            left: true,
            raw: true,
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_group.group_name')), 'group_name'],
        ],
        raw: true,
        where: {
          user_id: {
            [Op.ne]: null,
          },
        },
        raw: true,
      };

      condition.order = [[
        sequelize.col('m_crop_group.group_name'), 'ASC'
      ],]
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }

        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }

        if (req.body.search.type) {
          if (req.body.search.type == "seed") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 0) {
            //   // condition.where.is_freeze = req.body.search.is_freeze
            // }
            // condition.where.is_indenter_freeze = 1
          }
          if (req.body.search.type == "nodal") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 1) {
            condition.where.is_forward = 1;
            //   // condition.where.icar_freeze = 0;
            // }
            // condition.where.is_freeze = 1
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }
        } else {
          condition.where.icar_freeze = 1
        }
      }

      if (user.user_type == "ICAR") {
        condition['include'][0].where["group_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        condition['include'][0].where["group_code"] = {
          [Op.like]: "H%",
        }
      }


      data = await indentorBreederSeedModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static submitIndentsbreederseedsCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {};

      condition = {
        include: [
          {
            model: cropModel,
            left: true,
            raw: true,
            where: {
              crop_code: {
                [Op.not]: null
              }
            }
          }
        ],
        attributes: [
          // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          // sequelize.col('m_crop_group.group_code')
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop_group.group_code')) ,'group_code'],
          // [ sequelize.col('m_crop->m_crop_group.group_name') ],

        ],
        raw: true,
        where: {
          user_id: {
            [Op.ne]: null,
            // distinct: true
          },
          // is_indenter_freeze:1
          // state_short_name:{
          //   [Op.ne]: null,
          // }
          // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          // raw: false,
        },
        raw: true,
        // group:['indent_of_breederseeds.variety_id']
      };
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];

      // condition.order= ['year','DESC']
      if (req.body.search) {
        // if (req.body.search.year) {
        //   condition.where.year = req.body.search.year;
        // }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }

        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
        if (req.body.search.type) {
          if (req.body.search.type == "seed") {
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
            // condition.where.crop_code = {
            //   [Op.like]: req.body.search.crop_type + "%"
            // }
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 0) {
            //   // condition.where.is_freeze = req.body.search.is_freeze
            // }
            // condition.where.is_indenter_freeze = 1
          }
          if (req.body.search.type == "nodal") {
            // if (req.body.search.is_freeze || req.body.search.is_freeze == 1) {
            // condition.where.is_freeze = req.body.search.is_freeze;
            //   // condition.where.icar_freeze = 0;
            // }
            condition.where.is_forward = 1
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }
        } else {
          condition.where.icar_freeze = 1
        }

      }

      const user = req.body.loginedUserid;

      if (user.user_type == "ICAR") {
        condition['include'][0].where["crop_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        condition['include'][0].where["crop_code"] = {
          [Op.like]: "H%",
        }
      }

      console.log(condition.include[0])


      data = await indentorBreederSeedModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAddresssOfCertificate = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      let datas;
      const {id,user_id,created_by}=req.body.search;
      if(id){

        datas = await db.liftingSeedDetailsModel.findAll({
         where:{
           id:id
         },
         include:[
          // {
          //   model:agencyDetailModel,
          //   attributes:[],
          //   as:'agencyDetailModel'
          // },
          {
            model:userModel,
            attributes:[],
            as:'userData'
          }
         ],
         attributes:[
          [sequelize.col('lifting_seed_details.user_id'),'user_id'],
          [sequelize.col('userData.created_by'),'created_by'],
          

         ],
         raw:true,
         
       })
      }
      console.log(datas)
      condition = {


        where: {
          created_by: created_by ? created_by:datas && datas[0] && datas[0].created_by ? datas[0].created_by:'',
          id: user_id ? user_id: datas && datas[0] && datas[0].user_id ? datas[0].user_id:''
          // user_id: {
          //   [Op.ne]: null,
          //   // distinct: true
          // },
          // state_short_name:{
          //   [Op.ne]: null,
          // }
          // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          // raw: false,
        },
        // raw:true,
        // group:['indent_of_breederseeds.variety_id']
      };
      // condition.order= ['year','DESC']

      data = await userModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAddresssOfCertificateByCreatedy = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {



        where: {
          // created_by : req.body.search.created_by,
          id: req.body.search.user_id

        },
        // raw:true,
        // group:['indent_of_breederseeds.variety_id']
      };
      // condition.order= ['year','DESC']

      data = await userModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAddresssOfCertificateByAgencyTable = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {


        where: {
          // created_by : req.body.search.created_by,
          id: req.body.search.agency_id

        },
        // raw:true,
        // group:['indent_of_breederseeds.variety_id']
      };
      // condition.order= ['year','DESC']

      data = await agencyDetailModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignCropSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {
        include: [
          {
            model: seasonModel,
            attributes: ['season']
          }
        ],


        where: {
          year: req.body.search.year,
          icar_freeze: 1

        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.season')), 'season'],
        ],
        raw: true,
      };

      data = await indentorBreederSeedModel.findAll(condition);

      let returnResponse = data
      return response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static productionCenter = async (req, res) => {
    let data = {};
    try {
      let rules = {
        'search.state_id': 'integer',
        'search.district_id': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      let { page, pageSize } = req.body;
      let condition = {

      };
      if (req.body.id) {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel2,
              left: true,
              attributes: ['district_name'],
            },

            {
              model: userModel,
              left: true,
              attributes: ['code'],
              where: {
                user_type: 'BPC'
              }
            }
            // ,
            // {
            //   model: bspcToPlants,
            //   left: true,
            //   include: {
            //     model: plantDetails,
            //     left: true,
            //     attributes:['id', 'plant_name']
            //   }
            // }
          ],
          where: {
            id: req.body.id,
            // created_by: req.bod.user_id


          }
        };
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              required: true,
              duplicating: false,
              attributes: []
            },
            {
              model: stateModel,
              required: true,
              duplicating: false,
              attributes: [],
            },
            {
              model: districtModel2,
              required: true,
              duplicating: false,
              attributes: [],
            },
            {
              model: userModel,
              required: true,
              duplicating: false,
              attributes: [],
              where: {
                user_type: 'BPC'
              }
            },
            // {
            //   model: bspcToPlants,
            //   required: true,
            //   duplicating: false,
            //   include: {
            //     model: plantDetails,
            //     required: true,
            //     duplicating: false,
            //     attributes: ['id', 'plant_name']
            //   }
            // }
          ],
          attributes: ['id','user_id','agency_name', 'contact_person_mobile', 'is_active',
            [sequelize.col('m_district.district_name'), 'district_name'],
            [sequelize.col('m_state.state_name'), 'state_name'],
            [sequelize.col('users.code'), 'code'],

          ],
          where: {
            // created_by: 4
            // created_by: req.body.user_id
          }
        };

      }
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 50; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];
      //      condition.order = [[sequelize.col('m_state.state_name'),'ASC'],[sequelize.col('m_district.district_name'),'ASC'],[sequelize.col('m_crop_variety.variety_name'),'ASC']];
      condition.order = [['agency_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];

      // condition.order = [['id','Desc']];
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.production_id) {
          condition.where.id = (req.body.search.production_id);
        }
      }

      data = await agencyDetailModel.findAndCountAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getLotnumber = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {


        where: {
          // created_by : req.body.search.created_by,
          id: req.body.search.lot_number_id

        },
        attributes: ['id', 'lot_number', 'lot_number_size'],
        // raw:true,
        // group:['indent_of_breederseeds.variety_id']
      };

      // condition.order= ['year','DESC']

      data = await lotNumberModel.findAndCountAll(condition);

      let returnResponse = await paginateResponse(data);

      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCeritificateName = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition = {
        include: [{
          model: cropModel,
          where: {
            crop_code: req.body.search.crop_code

          },
          include: [{
            model: agencyDetailModel,
            attributes: ['address', 'agency_name']
          }],
          attributes: ['id']
        }],
        attributes: ['id']
      };
      // condition.order= ['year','DESC']

      data = await userModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getSPAsAllData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            // include:[
            //   {
            //     model:agencyDetailModel,
            //     attributes:[]
            //   }
            // ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('user.spa_code')), 'spa_code'],
          [sequelize.col('user.name'), 'short_name'],
          // [sequelize.col('user.spa_code'),'spa_code']
          // [sequelize.col('user->agency_detail.name'),'name']
        ],
        raw: true,
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
            condition.where.state_code = req.body.loginedUserid.state_id;
            console.log(req.body.search.type);
          }
        }
      }
      let data = await indenterSPAModel.findAll(condition)
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


  static getBreederProductrionList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        // 'search.state_id': 'integer',
        // 'search.district_id': 'integer',
        // 'search.agencyName': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      if (!page) page = 1;

      let condition = {
        include: [
          {
            model: designationModel,
            required: true,
            duplicating: false,
            attributes: []
          },
          {
            model: stateModel,
            required: true,
            duplicating: false,
            attributes: [],
          },
          {
            model: districtModel2,
            required: true,
            duplicating: false,
            attributes: [],
          },
          {
            model: userModel,
            required: true,
            duplicating: false,
            attributes: [],
            where: {
              user_type: 'BPC'
            }
          },
          {
            model: bspcToPlants,
            attributes: [],
            required: true,
            duplicating: false,
            include: {
              model: plantDetails,
              required: true,
              duplicating: false,
              attributes: []
            }
          }
        ],
        raw: true,
        attributes: [
          [sequelize.col('agency_details.id'), 'id'],
          [sequelize.col('agency_details.agency_name'), 'agency_name'],
          // [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
          // [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
          // [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
          // [sequelize.col('user.name'), 'user_name'],
          // [sequelize.col('m_crop_group.group_name'), 'group_name'],
          // [sequelize.col('m_crop->m_season.season'), 'season'],
          // [sequelize.col('m_crop.is_active'), 'is_active'],
          // [sequelize.col('user->agency_detail.agency_name'), 'full_name'],
          // [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
          // [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
          // [sequelize.literal(`string_agg("breeder_crops_veriety->m_crop_variety".id::varchar,',')`), 'variety_id']
        ],
        group: [
          [sequelize.col('agency_details.id'), 'id'],
          [sequelize.col('agency_details.agency_name'), 'agency_name'],
          // [sequelize.col('breeder_crops.year'), 'breeder_crops_year'],
          // [sequelize.col('breeder_crops.season'), 'breeder_crops_season'],
          // [sequelize.col('m_crop.crop_name'), 'm_crop_crop_name'],
          // [sequelize.col('user.name'), 'user_name'],
          // [sequelize.col('m_crop_group.group_name'), 'group_name'],
          // [sequelize.col('breeder_crops_veriety.breeder_crop_id'), 'breeder_crop_id'],
          // [sequelize.col('m_crop->m_season.season'), 'season'],
          // [sequelize.col('m_crop.is_active'), 'is_active'],
          // [sequelize.col('user->agency_detail.agency_name'), 'full_name']
        ],
        // left: false,
        raw: true,
      };





      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // condition.order = [[sortOrder, sortDirection]];

      // if (req.body.search) {

      //   if (req.body.search.state_id) {
      //     condition.where.state_id = (req.body.search.state_id);
      //   }

      //   if (req.body.search.district_id) {

      //     condition.where.district_id = (req.body.search.district_id);
      //   }
      //   if (req.body.search.agencyName) {

      //     condition.where.agency_name = (req.body.search.agencyName);
      //   }

      // }
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
      }

      let data = await agencyDetailModel.findAndCountAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getNodalCardQntDetails = async (req, res) => {
    let internalCall = {};
    let returnResponse = {};
    try {
      let filterData = [];
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
          filterData1.push({
            year_of_indent: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season ? req.body.search.season : ""
            },
          })
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
        }
      }
      let data = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'total_allocation'],

        ],
        group: [
          // [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'id'],
          // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id'), 'pdpc_id']
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      let data3 = await allocationToIndentorSeed.sum('quantity', {

        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );

      let data1 = await generateBills.findAll({
        // include: [
        //   {
        //     model: allocationToIndentorProductionCenterSeed
        //   }
        // ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total_quantity')), 'total_lifting']
        ],
        // group: ['id'
        //   // [sequelize.col('id'), 'id'],
        // ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );

      let totalLiftingData = await bsp5bModel.findAll({
        // include: [
        //   {
        //     model: allocationToIndentorProductionCenterSeed
        //   }
        // ],
        attributes: [
          [sequelize.col('lifting_quantity'), 'lifting_quantity']
          // [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'lifting_quantity']
        ],
        // group: ['id'
        //   // [sequelize.col('id'), 'id'],
        // ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      let data2 = await labelNumberForBreederseed.findAll(
        {

          attributes: [
            [sequelize.fn('SUM', sequelize.literal("weight::integer")), 'total_production'],
            // [sequelize.fn('SUM', sequelize.col(weight::INTEGER)), 'total_production']
          ],
          // group: ['id'
          //   // [sequelize.col('id'), 'id'],
          // ],
          where: { [Op.and]: filterData1 ? filterData1 : [] },
          raw: true
        }
      );
      let sum = bsp3Helper.sumOfAllElements(totalLiftingData, 'lifting_quantity');

      let cropCodeArray = [];
      // data3.forEach(ele => {
      //   if (ele && ele.crop_code) {
      //     cropCodeArray.push(ele.crop_code);
      //   }
      // });
      let productionData;
      let cropCodeValue;
      if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
        cropCodeValue = {
          crop_code: {
            [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
          }
        }
      }

      if (req.body.search && req.body.search) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              ...cropCodeValue,
              year: {
                [Op.eq]: req.body.search.year
              },
              season: {
                [Op.eq]: req.body.search.season
              },

            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              ...cropCodeValue,
              year: {
                [Op.eq]: req.body.search.year
              },
              season: {
                [Op.eq]: req.body.search.season
              },

            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }

      let productionsum = 0
      if (productionData && productionData.length > 0) {

        productionData.forEach(item => {

          item.production = parseInt(item.production)
          productionsum += item.production
        })
      }

      let cardArray = []
      console.log(data, data1, data2);
      cardArray.push((data && data[0] ? data[0] : { 'total_allocation': 0 }),
        (data1 && data1[0] ? data1[0] : { 'total_lifting': 0 }),
        data2[0], {
        'total_unlifting': (data && data[0] && data[0]['total_allocation'] ? data[0]['total_allocation'] : 0) - (data1 && data1[0] && data1[0]['total_lifting'] ? data1[0]['total_lifting'] : 0),
      })
      cardArray.push({ productionsum: productionsum ? productionsum : 0, }, { 'totalLifting': data3 ? data3 : 0 }, { 'totalLiftingData': sum })
      return response(res, status.DATA_AVAILABLE, 200, cardArray);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getNodalFilterCropData = async (req, res) => {
    let internalCall = {};
    let returnResponse = {};
    try {
      let isFlagFilter;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        isFlagFilter = { is_indenter_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
        ],
        where: {
          [Op.and]: [
            // {
            //   crop_code: {
            //     [Op.like]: req.body && req.body.search && req.body.search.crop_type ? req.body.search.crop_type + "%" : ''
            //   }
            // },
            {
              // is_freeze: {
              //   [Op.eq]: 1
              // }
              ...isFlagFilter
            }
          ]
        },
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],
        raw: true,

      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'DESC']];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body && req.body.search && req.body.search.crop_type ? req.body.search.crop_type + "%" : '',
          }

        }

      }
      let data = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getChartIndentDataCrop = async (req, res) => {
    let data = {};
    try {
      let filterData = [];
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
          filterData1.push({
            year_of_indent: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season ? req.body.search.season : ""
            },
          })
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
        }
      }

      let data3 = await indentorBreederSeedModel.findAll(
        {
          include: [
            {
              model: cropModel,
              attributes: []
            }
          ],

          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            // [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity']
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity']

            // [sequelize.fn('SUM', sequelize.col(weight::INTEGER)), 'total_production']
            // [sequelize.col('id'), 'id'],
          ],
          where: { [Op.and]: filterData ? filterData : [] },
          raw: true
        }
      );

      let data = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'total_allocation']
        ],
        group: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'total_allocation']
        ],
        where: { [Op.or]: filterData ? filterData : [] },
        raw: true
      }
      );

      let data1 = await generateBills.findAll({
        attributes: ["crop_code",
          [sequelize.fn('SUM', sequelize.col('total_quantity')), 'total_lifting']
        ],
        group: ["crop_code",
          [sequelize.col('total_quantity'), 'total_lifting']
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );

      let data2 = await labelNumberForBreederseed.findAll(
        {
          attributes: ["crop_code",
            [sequelize.fn('SUM', sequelize.literal("weight::integer")), 'total_production'],
          ],
          group: ["crop_code",
            [sequelize.literal("weight::integer"), 'total_production'],
            // [sequelize.col('id'), 'id'],
          ],
          where: { [Op.and]: filterData1 ? filterData1 : [] },
          raw: true
        }
      );

      let totalAllocationData = [];
      let totalProductionData = [];
      let totalLiftingData = [];
      let totalCropData = [];
      let indtentCropData = [];

      data.forEach(element => {
        totalAllocationData.push(element.total_allocation);
      });
      data1.forEach(element => {
        totalLiftingData.push(parseInt(element.total_lifting));
      });
      data2.forEach(element => {
        totalProductionData.push(element.total_production);
      });
      data3.forEach(element => {
        totalCropData.push(element.crop_name);
        indtentCropData.push(element.indent_quantity);
      });

      let cropGraphData = [{ 'crop': totalCropData }, { 'indent': indtentCropData }, { 'allocation': totalAllocationData }, { 'production': totalProductionData }, { 'lifting': (totalLiftingData) }]
      // 
      response(res, status.DATA_AVAILABLE, 200, cropGraphData)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartIndentDataVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: allocationToIndentorSeed,
            attributes: [],
            include: [
              {
                model: allocationToIndentorProductionCenterSeed,
                attributes: []
              }
            ]
          },
          {
            model: generateBills,
            attributes: []
          },
          {
            model: labelNumberForBreederseed,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.fn('SUM',sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          // [sequelize.fn('SUM',sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM',sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity' ],
        ],
        where: {
          [Op.and]: [{
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
          ]

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
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [[sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
      [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
      [sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity'), 'quantity'],
      [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
      ];

      data = await indentorBreederSeedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentDataVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: allocationToIndentorSeed,
            attributes: [],
            include: [
              {
                model: allocationToIndentorProductionCenterSeed,
                attributes: []
              }
            ]
          },
          {
            model: generateBills,
            attributes: []
          },
          {
            model: labelNumberForBreederseed,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.fn('SUM',sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          // [sequelize.fn('SUM',sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM',sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity' ],
        ],
        where: {
          [Op.and]: [{
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
          ]

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
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [[sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
      [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
      [sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity'), 'quantity'],
      [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
      ];

      data = await indentorBreederSeedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getNodalVarietyCount = async (req, res) => {
    let data = {};
    try {
      let filterData = [];
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
          filterData1.push({
            year_of_indent: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })
        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season ? req.body.search.season : ""
            },
          })
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + "%"
            },
          })
        }
      }

      let data3 = await indentorBreederSeedModel.findAll(
        {
          include: [
            {
              model: cropModel,
              attributes: []
            },
            {
              model: varietyModel,
              attributes: []
            }
          ],

          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            // [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity']
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity']

            // [sequelize.fn('SUM', sequelize.col(weight::INTEGER)), 'total_production']
            // [sequelize.col('id'), 'id'],
          ],
          where: { [Op.and]: filterData ? filterData : [] },
          raw: true
        }
      );

      let data = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'total_allocation']
        ],
        group: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'total_allocation']
        ],
        where: { [Op.or]: filterData ? filterData : [] },
        raw: true
      }
      );

      let data1 = await generateBills.findAll({
        attributes: ["crop_code",
          [sequelize.fn('SUM', sequelize.col('total_quantity')), 'total_lifting']
        ],
        group: ["crop_code",
          [sequelize.col('total_quantity'), 'total_lifting']
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );



      let totalAllocationData = [];
      let totalLiftingData = [];
      let totalCropData = [];
      let indtentCropData = [];

      data.forEach(element => {
        totalAllocationData.push(element.total_allocation);
      });
      data1.forEach(element => {
        totalLiftingData.push(parseInt(element.total_lifting));
      });

      data3.forEach(element => {
        totalCropData.push(element.crop_name);
        indtentCropData.push(element.indent_quantity);
      });

      // let cropGraphData = [{ 'crop': totalCropData },{'variety':}, { 'allocation': totalAllocationData }, { 'lifting': (totalLiftingData) }]
      // 
      response(res, status.DATA_AVAILABLE, 200, cropGraphData)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getFreezIndentQauntity = async (req, res) => {
    let returnResponse = {}
    try {
      let condition = {
      }
      let filter = [];
      if (req.body.loginedUserid && req.body.loginedUserid.user_type && req.body.loginedUserid.user_type == 'SD') {
        condition = { is_freeze: 1 }
        filter.push(condition)
      }
      if (req.body && req.body.search) {
        if (req.body.loginedUserid && req.body.loginedUserid.user_type && req.body.loginedUserid.user_type != 'SD') {

          if (req.body.search.crop_type) {
            condition = { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
            filter.push(condition)
          }
        }
        if (req.body.search.crop_type) {
          condition = { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
          filter.push(condition)
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code.length != undefined) {
          condition = { crop_code: { [Op.in]: req.body.search.crop_code } }
          filter.push(condition)
        }
        if (req.body.search.season) {
          condition = { season: req.body.search.season }
          filter.push(condition)
        }
        if (req.body.search.year) {
          condition = { year: req.body.search.year }
          filter.push(condition)
        }
        if (req.body.search && req.body.search.graphType == "seed-division") {
          condition = { is_freeze: 1 }
          filter.push(condition)
        }
        else {
          condition = { icar_freeze: 1 }
          filter.push(condition)
        }

      }

      let data = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'recieved_indenter'],
        ],
        group: [
        ],
        where: {
          [Op.and]: filter
        }
      });
      let cropCount = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        ],
        distinct: true,
        where: {
          [Op.and]: filter
        },
        raw: true
      });

      let varietyCount = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
        ],
        group: [
          [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        ],
        distinct: true,
        where: {
          [Op.and]: filter
        },
        raw: true
      });

      const finalData = {
        total_recieved: data[0].dataValues.recieved_indenter,
        total_crop: cropCount.length,
        total_variety: varietyCount.length
      }

      return response(res, status.DATA_AVAILABLE, 200, finalData);


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getFreezRecievedIndentQauntity = async (req, res) => {
    let returnResponse = {}
    try {

      let condition = {
      }

      let filter = [];

      if (req.body.loginedUserid && req.body.loginedUserid.user_type == 'SD') {
        condition = { is_indenter_freeze: 1 }
        filter.push(condition)
      } else {
        condition = { is_freeze: 1 }
        filter.push(condition)
      }
      if (req.body && req.body.search) {
        if (req.body.loginedUserid && req.body.loginedUserid.user_type != 'SD') {

          if (req.body.search.crop_type) {
            condition = { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
            filter.push(condition)
          }
        }
        if (req.body.search.crop_type) {
          condition = { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
          filter.push(condition)
        }

        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code.length != undefined) {
          condition = { crop_code: { [Op.in]: req.body.search.crop_code } }
          filter.push(condition)
        }
        if (req.body.search.season) {
          condition = { season: req.body.search.season }
          filter.push(condition)
        }
        if (req.body.search.year) {
          condition = { year: req.body.search.year }
          filter.push(condition)
        }

      }

      let data = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'recieved_indenter'],
        ],
        group: [
          // [sequelize.col('indent_of_breederseeds.crop_code'),'crop'],
          // [sequelize.col('indent_of_breederseeds.variety_id'),'variety']
          // [sequelize.col('indent_of_breederseeds.indent_quantity'),'total_freez']
        ],
        where: {
          [Op.and]: filter
        }
      });
      let cropCount = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        ],
        distinct: true,
        where: {
          [Op.and]: filter
        },
        raw: true
      });

      let varietyCount = await indentorBreederSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
        ],
        group: [
          [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        ],
        distinct: true,
        where: {
          [Op.and]: filter
        },
        raw: true
      });

      const finalData = {
        total_recieved: data[0].dataValues.recieved_indenter,
        total_crop: cropCount.length,
        total_variety: varietyCount.length
      }

      return response(res, status.DATA_AVAILABLE, 200, finalData);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getAssignCropReports = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {}
      //      console.log("state_idstate_id9999999999999",req.body.loginedUserid.state_id, req.body.loginedUserid, req.body )
      // if (req.body.loginedUserid && req.body.loginedUserid.state_id && req.body.search)
      //   req.body.search.state_code = req.body.loginedUserid.state_id

      let filters = await ConditionCreator.filters(req.body.search);
      let user_id;
      if (req.body && req.body.search) {
        if (req.body.search.reportType && req.body.search.reportType == "bspc") {
          // user_id = {
          //   production_center_id:};
          filters.production_center_id = req.body.loginedUserid.id
        }
      }

      console.log("filtersfilters", filters)
      if (1) {
        // console.log('crop_code',req.body.search.crop_code.length)

        condition = {
          where: filters,
          include: [
            {
              model: breederCropsVerietiesModel,
              include: {
                model: varietyModel,
                attributes: [],
                // attributes: ['variety_name', 'not_date']
              },
              where: {

              }
            },
            {
              model: cropModel,
              attributes: [],
              // attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: seasonModel,
              attributes: [],
              // attributes: ['id', 'season', 'season_code'],
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
                user_type: "BPC",

                // id: 675
                // {

                // [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
                // }
              },
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],

            // [sequelize.col('breeder_crops.crop_code'), 'crop_code'],
            [sequelize.col('breeder_crops.year'), 'year_of_indent'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_season.season'), 'season'],
            [sequelize.col('m_season.season_code'), 'season_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.id'), 'variety_id'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.id'), "user_id"],
            [sequelize.col('user->agency_detail.id'), "user_id"],
          ],
          group: [
            [sequelize.col('breeder_crops.crop_code'), 'crop_code'],
            [sequelize.col('breeder_crops.year'), 'year_of_indent'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_season.season'), 'season'],
            [sequelize.col('breeder_crops_veriety.id'), 'breeder_crop_id'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_season.id'), 'm_season_id'],
            [sequelize.col('m_season.season_code'), 'season_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.id'), 'variety_id'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.id'), "user_id"],
            [sequelize.col('user->agency_detail.id'), "user_id"],
          ],
          raw: true,
          where: filters,
        }
      }
      condition.order = [[sequelize.col('breeder_crops.year'), 'ASC']]
      let getAssignCropReportData = await breederCropModel.findAll(condition);

      let data = [] = getAssignCropReportData;
      const uniqueYear = [];
      const uniqueSeason = [];
      const uniqueCrop = [];
      const filteredData = [

      ];
      const uniqueVariety = [];
      const uniqueSPA = [];

      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.year_of_indent === el.year_of_indent);

        if (spaIndex === -1) {
          filteredData.push({
            "year_of_indent": el.year_of_indent,
            "season": el.season,
            "crop_type": el && el.crop_code && (el.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',
            "total_count": 0,
            "crops": [
              {
                "crop_name": el.crop_name,
                "crop_code": el.crop_code,
                "crop_count": 0,
                "varieties": [
                  {
                    "variety_name": el.variety_name,
                    "variety_code": el.variety_code,
                    "crop_code": el.crop_code,
                    "variery_count": 0,
                  }

                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].crops.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex != -1) {

            filteredData[spaIndex].crops[cropIndex].varieties.push({
              "variety_name": el.variety_name,
              "variety_code": el.variety_code,
              "variery_count": 0,
              "crop_code": el.crop_code,
            })
          } else {
            filteredData[spaIndex].crops.push(
              {
                "crop_name": el.crop_name,
                "crop_code": el.crop_code,
                "crop_count": 0,
                "varieties": [
                  {
                    "variety_name": el.variety_name,
                    "variety_code": el.variety_code,
                    "crop_code": el.crop_code,
                    "variery_count": 0,
                  }

                ]
              }
            );
          }

        }

      });

      filteredData.forEach(ele => {
        ele.total_count = ele.crops.length
        ele.crops.forEach(elem => {
          elem.crop_count = elem.varieties.length
          elem.varieties.forEach(item => {
            item.variery_count = 1
          })
        })
      });



      return response(res, status.DATA_AVAILABLE, 200, filteredData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCreatedLotNumbersReports = async (req, res) => {
    let returnResponse = {};
    try {
      // [Op.and]: {
      //   crop_code: {
      //     [Op.like]: req.body.search.crop_type + '%'
      //   },
      //   crop_code: {
      //     [Op.in]: cropCodeArray
      //   },
      //   year: {
      //     [Op.eq]: req.body.search.year
      //   },
      //   ...seasonData
      // }
      //      console.log("state_idstate_id9999999999999",req.body.loginedUserid.state_id, req.body.loginedUserid, req.body )
      // if (req.body.loginedUserid && req.body.loginedUserid.state_id && req.body.search)
      //   req.body.search.state_code = req.body.loginedUserid.state_id

      let filters = await ConditionCreator.filters(req.body.search);
      let user_id = req.body.loginedUserid.id;
      let condition = {
        // where:filters,
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
          {
            model: cropModel,
            attributes: [],
          },
          {
            model: varietyModel,
            attributes: [],
          },
          {
            model: maxLotSizeModel,
            attributes: []
          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
          [sequelize.col('lot_number_creations.crop_code'), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "total_production"],
          [sequelize.literal("(lot_number_creations.lot_number_size)"), "lot_size"],
          [sequelize.literal("(m_crop.crop_name)"), "crop_name"],
          [sequelize.literal("(lot_number_creations.variety_id)"), "variety_id"],
          [sequelize.literal("(m_crop_variety.variety_name)"), "variety_name"],
          [sequelize.literal("(lot_number_creations.lot_number)"), "lot_number"],
          [sequelize.literal("(m_max_lot_size.max_lot_size)"), "maximum_lot_size"],

        ],
        group: [
          [sequelize.col('lot_number_creations.crop_code')],
          [sequelize.literal("(m_crop.crop_name)"), "crop_name"],
          [sequelize.literal("(lot_number_creations.variety_id)"), "variety_id"],
          [sequelize.literal("(m_crop_variety.variety_name)"), "variety_name"],
          [sequelize.literal("(lot_number_creations.lot_number)"), "lot_number"],
          [sequelize.literal("(m_max_lot_size.max_lot_size)"), "maximum_lot_size"],
          [sequelize.literal("(lot_number_creations.lot_number_size)"), "lot_size"],
        ],
        where: {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',

        },
        raw: true,
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code
          }
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = {
            [Op.in]: req.body.search.variety_id
          }
        }
      }
      let productionData = await lotNumberModel.findAll(condition);
      let data = [] = productionData;
      const uniqueYear = [];
      const uniqueSeason = [];
      const uniqueCrop = [];
      const filterData = [
      ];
      const uniqueVariety = [];
      const uniqueSPA = [];
      productionData.forEach((el, index) => {

        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "maximum_lot_size": el && el.maximum_lot_size ? el.maximum_lot_size : '',
              "total_count": 0,
              // "variety_count": 1,
              "variety":
                [

                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "total_production": el.total_production,
                    "varity_totalPro_count": 0,
                    "lot_numbers": [
                      {
                        "lot_num": el.lot_number,
                        "lot_size": el.lot_size,
                        "lot_count": 0,
                      }
                    ]
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].lot_numbers.push(
              {
                "lot_num": el.lot_number,
                "lot_size": el.lot_size,
                "lot_count": 0,

              }
            )
          }
          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "total_production": el.total_production,
                "varity_totalPro_count": 0,
                "lot_numbers": [
                  {
                    "lot_num": el.lot_number,
                    "lot_size": el.lot_size,
                    "lot_count": 0,
                  }
                ]
              }
            )
          }
        }

      });

      // const uniqueIndentorDataMap = []
      // for (const item of filteredData) {
      //   let keys = ['crop_code']
      //   const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

      //   if (!uniqueIndentorDataMap[key]) {
      //     uniqueIndentorDataMap[key] = { ...item }; // Copy the object
      //   } else {
      //     uniqueIndentorDataMap[key].crop_code += item.crop_code; // Calculate the sum based on the "value" property
      //   }
      // }
      // const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
      // console.log(uniqueJsonArrays,'uniqueJsonArrays')
      // console.log(data,'uniqueJsonArrays')
      //count logic implement 
      filterData.forEach(ele => {
        ele.total_count = ele.variety.length
        ele.variety.forEach(elem => {
          elem.varity_totalPro_count = elem.lot_numbers.length
          elem.lot_numbers.forEach(item => {
            item.lot_count = 1
          })
        })
      });
      return response(res, status.DATA_AVAILABLE, 200, filterData);
      // return response(res, status.DATA_AVAILABLE, 200, productionData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static seedtestingreportingapi = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      let filters = await ConditionCreator.filters(req.body.search);
      let filterDataa = [];

      if (req.body.search && req.body.search.report_status) {
        let status = req.body.search.report_status && (req.body.search.report_status == 'true') ? true : false
        condition = {
          where: filters,
          include: [
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            {
              model: seedTestingReportsModel,
              where: {
                is_report_pass: status
              },
              attributes: []
            }
          ],

          attributes: [
            [sequelize.col('lot_number_creations.lot_number'), 'lot_number'],
            [sequelize.col('lot_number_creations.id'), 'lot_id'],
            [sequelize.col('lot_number_creations.variety_id'), 'variety_id'],
            [sequelize.col('lot_number_creations.lot_number_size'), 'lot_size'],
            [sequelize.col('seed_testing_report.reference_number'), 'reference_number'],
            [sequelize.col('seed_testing_report.report_recieving_date'), 'report_recieving_date'],
            [sequelize.col('seed_testing_report.date'), 'date'],
            [sequelize.col('seed_testing_report.sample_number'), 'sample_number'],
            [sequelize.col('seed_testing_report.seed_class_normal'), 'seed_class_normal'],
            [sequelize.col('seed_testing_report.seed_class_abnormal'), 'seed_class_abnormal'],
            [sequelize.col('seed_testing_report.seed_class_hard'), 'seed_class_hard'],
            [sequelize.col('seed_testing_report.dead'), 'dead'],
            [sequelize.col('seed_testing_report.fresh_ungerminated'), 'fresh_ungerminated'],
            [sequelize.col('seed_testing_report.pure_seed'), 'pure_seed'],
            [sequelize.col('seed_testing_report.pure_seed'), 'other_crop_seed'],
            [sequelize.col('seed_testing_report.weed_seed'), 'weed_seed'],
            [sequelize.col('seed_testing_report.inert_matter'), 'inert_matter'],
            [sequelize.col('seed_testing_report.is_report_pass'), 'is_report_pass'],
            [sequelize.col('seed_testing_report.moisture'), 'moisture'],

          ],
        };
      } else {
        condition = {
          where: filters,
          include: [
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            {
              model: seedTestingReportsModel,
              attributes: []
            }
          ],

          attributes: [
            [sequelize.col('lot_number_creations.lot_number'), 'lot_number'],
            [sequelize.col('lot_number_creations.id'), 'lot_id'],
            [sequelize.col('lot_number_creations.variety_id'), 'variety_id'],
            [sequelize.col('lot_number_creations.lot_number_size'), 'lot_size'],
            [sequelize.col('seed_testing_report.reference_number'), 'reference_number'],
            [sequelize.col('seed_testing_report.report_recieving_date'), 'report_recieving_date'],
            [sequelize.col('seed_testing_report.date'), 'date'],
            [sequelize.col('seed_testing_report.sample_number'), 'sample_number'],
            [sequelize.col('seed_testing_report.seed_class_normal'), 'seed_class_normal'],
            [sequelize.col('seed_testing_report.seed_class_abnormal'), 'seed_class_abnormal'],
            [sequelize.col('seed_testing_report.seed_class_hard'), 'seed_class_hard'],
            [sequelize.col('seed_testing_report.dead'), 'dead'],
            [sequelize.col('seed_testing_report.fresh_ungerminated'), 'fresh_ungerminated'],
            [sequelize.col('seed_testing_report.pure_seed'), 'pure_seed'],
            [sequelize.col('seed_testing_report.pure_seed'), 'other_crop_seed'],
            [sequelize.col('seed_testing_report.weed_seed'), 'weed_seed'],
            [sequelize.col('seed_testing_report.inert_matter'), 'inert_matter'],
            [sequelize.col('seed_testing_report.is_report_pass'), 'is_report_pass'],
            [sequelize.col('seed_testing_report.moisture'), 'moisture'],

          ],
        };
      }


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      data = await lotNumberModel.findAll(condition);
      // console.log("datadatadata -------", data)
      let filteredData = []
      data.forEach(el => {

        const spaIndex = filteredData.findIndex(item => item.variety_id === el.variety_id);
        if (spaIndex === -1) {
          filteredData.push({
            "variety_name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
            // "crop_total_indent": el.indent_quantity,
            "variety_id": el && el.variety_id ? el.variety_id : '',

            "variety_count": 1,
            "total_spa_count": 1,
            "variety": [
              {
                "lot_number": el && el.lot_number ? el.lot_number : '',
                "lot_id": el && el.dataValues && el.dataValues.lot_id ? el.dataValues.lot_id : '',
                "lot_size": el && el.dataValues && el.dataValues.lot_size ? el.dataValues.lot_size : '',
                "reference_number": el && el.dataValues && el.dataValues.reference_number ? el.dataValues.reference_number : '',
                "report_recieving_date": el && el.dataValues && el.dataValues.report_recieving_date ? this.convertDate(el.dataValues.report_recieving_date) : '',
                "sample_number": el && el.dataValues && el.dataValues.sample_number ? el.dataValues.sample_number : '',
                "date_of_test": el && el.dataValues && el.dataValues.date ? this.convertDate(el.dataValues.date) : '',
                "normal": el && el.dataValues && el.dataValues.seed_class_normal ? el.dataValues.seed_class_normal : '',
                "abnormal": el && el.dataValues && el.dataValues.seed_class_abnormal ? el.dataValues.seed_class_abnormal : '',
                "hard": el && el.dataValues && el.dataValues.seed_class_hard ? el.dataValues.seed_class_hard : '',
                "dead": el && el.dataValues && el.dataValues.dead ? el.dataValues.dead : '',
                "inert_matter": el && el.dataValues && el.dataValues.inert_matter ? el.dataValues.inert_matter : '',
                "pure_seed": el && el.dataValues && el.dataValues.pure_seed ? el.dataValues.pure_seed : '',
                "moisture": el && el.dataValues && el.dataValues.moisture ? el.dataValues.moisture : '',
                "other_crop_seed": el && el.dataValues && el.dataValues.other_crop_seed ? el.dataValues.other_crop_seed : '',
                "fresh_ungerminated": el && el.dataValues && el.dataValues.fresh_ungerminated ? el.dataValues.fresh_ungerminated : '',
                "weed_seed": el && el.dataValues && el.dataValues.weed_seed ? el.dataValues.weed_seed : '',
                "is_report_pass": el && el.dataValues && el.dataValues.is_report_pass && (el.dataValues.is_report_pass == true) ? 'Pass' : 'Fail',

                "spa_count": 1,
                // "spas": [
                //   // {
                //   //   // "name": el.user.agency_detail.agency_name,
                //   //   // "spa_code": el.spa_code,
                //   //   // "state_code": el.state_code,
                //   //   // // "sector": "ABC",
                //   //   // "indent_qunatity": el.indent_quantity
                //   // }
                // ]
              }
            ]
          });
        } else {
          filteredData[spaIndex].variety.push({
            "lot_number": el && el.lot_number ? el.lot_number : '',
            "lot_id": el && el.dataValues && el.dataValues.lot_id ? el.dataValues.lot_id : '',
            "inert_matter": el && el.dataValues && el.dataValues.inert_matter ? el.dataValues.inert_matter : '',
            "lot_size": el && el.dataValues && el.dataValues.lot_size ? el.dataValues.lot_size : '',
            "reference_number": el && el.dataValues && el.dataValues.reference_number ? el.dataValues.reference_number : '',
            "report_recieving_date": el && el.dataValues && el.dataValues.report_recieving_date ? this.convertDate(el.dataValues.report_recieving_date) : '',
            "sample_number": el && el.dataValues && el.dataValues.sample_number ? el.dataValues.sample_number : '',
            "date_of_test": el && el.dataValues && el.dataValues.date ? this.convertDate(el.dataValues.date) : '',
            "normal": el && el.dataValues && el.dataValues.seed_class_normal ? el.dataValues.seed_class_normal : '',
            "abnormal": el && el.dataValues && el.dataValues.seed_class_abnormal ? el.dataValues.seed_class_abnormal : '',
            "hard": el && el.dataValues && el.dataValues.seed_class_hard ? el.dataValues.seed_class_hard : '',
            "dead": el && el.dataValues && el.dataValues.dead ? el.dataValues.dead : '',
            "pure_seed": el && el.dataValues && el.dataValues.pure_seed ? el.dataValues.pure_seed : '',
            "moisture": el && el.dataValues && el.dataValues.moisture ? el.dataValues.moisture : '',
            "other_crop_seed": el && el.dataValues && el.dataValues.other_crop_seed ? el.dataValues.other_crop_seed : '',
            "fresh_ungerminated": el && el.dataValues && el.dataValues.fresh_ungerminated ? el.dataValues.fresh_ungerminated : '',
            "weed_seed": el && el.dataValues && el.dataValues.weed_seed ? el.dataValues.weed_seed : '',
            "is_report_pass": el && el.dataValues && el.dataValues.is_report_pass && (el.dataValues.is_report_pass == true) ? 'Pass' : 'Fail',
            "spa_count": 1,
          });

        }
      });
      filteredData.forEach((elem, index) => {
        elem.variety_count = elem.variety.length;
      })
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
  static convertDate(date) {
    const datetimeValue = new Date(date); // For example, "2023-08-17T10:30:00"

    // Extract year, month, and day components
    const year = datetimeValue.getFullYear();
    const month = (datetimeValue.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = datetimeValue.getDate().toString().padStart(2, '0');

    // Create the formatted date string (YYYY-MM-DD)
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  static getBillGenerateCertificateapi = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      let filters = await ConditionCreator.filters(req.body.search);


      condition = {
        where: filters,
        include: [

          {
            model: varietyModel,
            attributes: ['variety_name', 'not_date']

          },
          {
            model: cropModel,
            attributes: ['crop_name', 'crop_code']
          },
          {
            model: db.allocationToSPAProductionCenterSeed,
            attributes: [],
            // [sequelize.Op.and]: [
            //   { '$allocation_to_spa_for_lifting_seed_production_cnter.spa_code$': sequelize.col('generate_bills.spa_code') },
            //   { '$allocation_to_spa_for_lifting_seed_production_cnter.state_code$': sequelize.col('generate_bills.state_code') }
            // ]
            where: {
              state_code: {
                [Op.eq]: sequelize.col('generate_bills.state_code')
              },
            }
          },

          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: ['agency_name']
            },
            ],

            attributes: ['name', 'id'],
            where: {
              id: {
                [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = '3' AND user_type = 'SPA')`)
              }
            },
          }
        ],
        attributes: [
          [sequelize.col('generate_bills.crop_code'), 'crop_code'],
          [sequelize.col('generate_bills.variety_id'), 'variety_id'],
          [sequelize.col('generate_bills.amount'), 'amount'],
          [sequelize.col('generate_bills.bill_date'), 'bill_date'],
          [sequelize.col('generate_bills.bill_number'), 'bill_number'],
          [sequelize.col('generate_bills.total_quantity'), 'total_quantity'],
          [sequelize.col('generate_bills.is_payment_completed'), 'is_payment_completed'],
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnter.qty'), 'qty'],

        ],
      };


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      data = await generateBills.findAll(condition);
      // console.log("datadatadata -------", data)
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        console.log(el.dataValues.crop_code, 'Eell', spaIndex)
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el && el.m_crop && el.m_crop.crop_name ? el.m_crop.crop_name : '',
            "crop_code": el && el.crop_code ? el.crop_code : '',
            // "crop_total_indent": el.indent_quantity,
            "variety_count": 1,
            "total_spa_count": 1,
            "variety": [
              {
                "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',

                "variety_name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',

                "spa_count": 1,
                "spas": [
                  {
                    "spa_name": el && el.user && el.user.name ? el.user.name : '',
                    "spa_id": el && el.user && el.user.id ? el.user.id : '',
                    "amount": [
                      {
                        "amount": el && el.amount ? el.amount : '',
                        "spa_id": el && el.user && el.user.id ? el.user.id : '',
                        "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                        "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                        "allocated_qty": el && el.dataValues && el.dataValues.qty ? el.dataValues.qty : '',
                        "lifted_qty": el && el.dataValues && el.dataValues.total_quantity ? el.dataValues.total_quantity : '',
                        "is_payment_completed": el && el.dataValues && el.dataValues.is_payment_completed ? el.dataValues.is_payment_completed : '',
                      }
                    ]
                  }
                  // {
                  //   "name": el.user.agency_detail.agency_name,
                  //   "spa_code": el.spa_code,
                  //   "state_code": el.state_code,
                  //   // "sector": "ABC",
                  //   "indent_qunatity": el.indent_quantity
                  // }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (cropIndex != -1) {
            const spadataIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.spa_id === el.user.id);
            if (spadataIndex != -1) {
              filteredData[spaIndex].variety[cropIndex].spas[spadataIndex].amount.push({
                "amount": el && el.amount ? el.amount : '',
                "spa_id": el && el.user && el.user.id ? el.user.id : '',
                "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                "allocated_qty": el && el.dataValues && el.dataValues.qty ? el.dataValues.qty : '',
                "lifted_qty": el && el.dataValues && el.dataValues.total_quantity ? el.dataValues.total_quantity : '',
                "is_payment_completed": el && el.dataValues && el.dataValues.is_payment_completed ? el.dataValues.is_payment_completed : '',
              })
            } else {
              filteredData[spaIndex].variety[cropIndex].spas.push(

                {
                  "spa_name": el && el.user && el.user.name ? el.user.name : '',
                  "spa_id": el && el.user && el.user.id ? el.user.id : '',
                  "amount": [
                    {
                      "amount": el && el.amount ? el.amount : '',
                      "spa_id": el && el.user && el.user.id ? el.user.id : '',
                      "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                      "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                      "allocated_qty": el && el.dataValues && el.dataValues.qty ? el.dataValues.qty : '',
                      "lifted_qty": el && el.dataValues && el.dataValues.total_quantity ? el.dataValues.total_quantity : '',
                      "is_payment_completed": el && el.dataValues && el.dataValues.is_payment_completed ? el.dataValues.is_payment_completed : '',
                    }

                  ]
                }
              )
            }
          } else {
            filteredData[spaIndex].variety.push(
              {
                "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',

                "variety_name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',

                "spa_count": 1,
                "spas": [
                  {
                    "spa_name": el && el.user && el.user.name ? el.user.name : '',
                    "spa_id": el && el.user && el.user.id ? el.user.id : '',
                    "amount": [
                      {
                        "amount": el && el.amount ? el.amount : '',
                        "spa_id": el && el.user && el.user.id ? el.user.id : '',
                        "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                        "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                        "allocated_qty": el && el.dataValues && el.dataValues.qty ? el.dataValues.qty : '',
                        "lifted_qty": el && el.dataValues && el.dataValues.total_quantity ? el.dataValues.total_quantity : '',
                        "is_payment_completed": el && el.dataValues && el.dataValues.is_payment_completed ? el.dataValues.is_payment_completed : '',
                      }
                    ]
                  }

                ]
              }
            );
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
  static getBillGenerateCertificateapiSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      let filters = await ConditionCreator.filters(req.body.search);

      let condition2 = {
        where: {
          ...filters,
          user_id: req.body.loginedUserid.id
        },
        include: [

          {
            model: varietyModel,
            attributes: ['variety_name', 'not_date']
          },
          {
            model: cropModel,
            attributes: ['crop_name', 'crop_code']
          },

        ],
        attributes: [
          [sequelize.col('generate_bills.crop_code'), 'crop_code'],
          [sequelize.col('generate_bills.variety_id'), 'variety_id'],
          [sequelize.col('generate_bills.amount'), 'amount'],
          [sequelize.col('generate_bills.bill_date'), 'bill_date'],
          [sequelize.col('generate_bills.bill_number'), 'bill_number'],
          [sequelize.col('generate_bills.total_quantity'), 'total_quantity'],
          [sequelize.col('generate_bills.state_code'), 'state_code'],
          [sequelize.col('generate_bills.is_payment_completed'), 'is_payment_completed'],

        ],
      };
      let generatBillsModelData = await generateBills.findAll(condition2,

      );

      let stateCode = []
      if (generatBillsModelData) {

        generatBillsModelData.forEach(el => {

          stateCode.push(el && el.dataValues && el.dataValues.state_code ? el.dataValues.state_code : '');
        })
      }
      let uniqueArray;
      if (stateCode && stateCode.length > 0) {
        uniqueArray = Array.from(new Set(stateCode));
      }

      // console.log(uniqueArray,'uniqueArray')
      if (uniqueArray && uniqueArray.length > 0) {
        uniqueArray = uniqueArray.map(String)
        condition = {
          where: {
            ...filters,
            user_id: req.body.loginedUserid.id
          },
          // user_id:req.body.loginedUserid.id,

          include: [

            {
              model: varietyModel,
              attributes: []
            },
            {
              model: cropModel,
              attributes: []
            },
            // {
            //   model: db.allocationToSPAProductionCenterSeed,
            //   attributes: ['qty'],
            //   // [sequelize.Op.and]: [
            //   //   { '$allocation_to_spa_for_lifting_seed_production_cnter.spa_code$': sequelize.col('generate_bills.spa_code') },
            //   //   { '$allocation_to_spa_for_lifting_seed_production_cnter.state_code$': sequelize.col('generate_bills.state_code') }
            //   // ]
            //   where:{
            //     state_code: {
            //       [Op.eq]:sequelize.col('generate_bills.state_code')
            //     },
            //   }
            // },

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                attributes: ['agency_name']
              },
              ],

              attributes: [],
              where: {
                id: {
                  // state_id = ${req.body.loginedUserid.state_id}
                  [Op.in]: sequelize.literal(`(SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id"
                  WHERE state_id IN (${uniqueArray}) AND  
                  user_type = 'SPA')`)
                }
              },

            }
          ],
          attributes: [
            [sequelize.col('generate_bills.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('generate_bills.variety_id'), 'variety_id'],
            [sequelize.col('generate_bills.amount'), 'amount'],
            [sequelize.col('generate_bills.bill_date'), 'bill_date'],
            [sequelize.col('generate_bills.bill_number'), 'bill_number'],
            [sequelize.col('generate_bills.total_quantity'), 'total_quantity'],
            [sequelize.col('generate_bills.spa_code'), 'spa_code'],
            [sequelize.col('generate_bills.state_code'), 'state_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user.name'), 'name'],
            [sequelize.col('user.id'), 'spa_id'],
            [sequelize.col('generate_bills.is_payment_completed'), 'is_payment_completed'],
            [sequelize.col('generate_bills.is_certificate_generated'), 'is_certificate_generated'],
            // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnter.qty'), 'qty'],

          ],
          raw: true,
        };
      }
      data = await generateBills.findAll(condition);
      let filteredData = []
      data.forEach(el => {

        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el && el.crop_name ? el.crop_name : '',
            "crop_code": el && el.crop_code ? el.crop_code : '',
            "variety_count": 1,
            "variety": [
              {
                "name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "spa_count": 1,
                "spas": [
                  {
                    "spa_name": el && el.name ? el.name : '',
                    "spa_id": el && el.spa_id ? el.spa_id : '',
                    "spa_code": el && el.spa_code ? el.spa_code : '',

                    "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                    "amount_count": 1,
                    "amount": [
                      {
                        "amount": el && el.amount ? el.amount : '',
                        "spa_id": el && el.spa_id ? el.spa_id : '',
                        "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                        "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                        "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                        "lifted_qty": el && el.total_quantity ? el.total_quantity : '',
                        "is_payment_completed": el && el.is_payment_completed && (el.is_payment_completed == true) ? 'Done' : 'Not Done',
                        "is_certificate_generated": el && el && el.is_certificate_generated && (el.is_certificate_generated == true) ? 'Done' : 'Not Done',
                      }
                    ]
                  }
                ]
              }
            ]
          });
        }
        else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (cropIndex != -1) {


            const spadataIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.spa_id === el.spa_id);

            if (spadataIndex != -1) {
              filteredData[spaIndex].variety[cropIndex].spas[spadataIndex].amount.push({
                "amount": el && el.amount ? el.amount : '',
                "spa_id": el && el.spa_id ? el.spa_id : '',
                "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                "lifted_qty": el && el.total_quantity ? el.total_quantity : '',
                "is_payment_completed": el && el.is_payment_completed && (el.is_payment_completed == true) ? 'Done' : 'Not Done',
                "is_certificate_generated": el && el.is_certificate_generated && (el.is_certificate_generated == true) ? 'Done' : 'Not Done',
                "amount_count": 1,
              })
            } else {
              filteredData[spaIndex].variety[cropIndex].spas.push(

                {
                  "spa_name": el && el.name ? el.name : '',
                  "spa_id": el && el.spa_id ? el.spa_id : '',
                  "spa_code": el && el.spa_code ? el.spa_code : '',
                  "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                  "amount_count": 1,
                  "amount": [
                    {
                      "amount": el && el.amount ? el.amount : '',
                      "spa_id": el && el.spa_id ? el.spa_id : '',
                      "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                      "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                      "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                      "lifted_qty": el && el.total_quantity ? el.total_quantity : '',
                      "is_payment_completed": el && el.is_payment_completed && (el.is_payment_completed == true) ? 'Done' : 'Not Done',
                      "is_certificate_generated": el && el.is_certificate_generated && (el.is_certificate_generated == true) ? 'Done' : 'Not Done',

                    }
                  ]
                }
              )
            }


          } else {

            filteredData[spaIndex].variety.push({
              "name": el && el.variety_name ? el.variety_name : '',
              "variety_id": el && el.variety_id ? el.variety_id : '',
              "variety_name": el && el.variety_name ? el.variety_name : '',
              "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
              "spa_count": 1,
              "spas": [
                {
                  "spa_name": el && el.name ? el.name : '',
                  "spa_id": el && el.spa_id ? el.spa_id : '',
                  "spa_code": el && el.spa_code ? el.spa_code : '',
                  "amount_count": 1,
                  "amount": [
                    {
                      "amount": el && el.amount ? el.amount : '',
                      "spa_id": el && el.spa_id ? el.spa_id : '',
                      "bill_date": el && el.bill_date && el.bill_date ? el.bill_date : '',
                      "bill_number": el && el.bill_number && el.bill_number ? el.bill_number : '',
                      "allocated_qty": el && el.allocation_to_spa_for_lifting_seed_production_cnter && el.allocation_to_spa_for_lifting_seed_production_cnter.qty ? el.allocation_to_spa_for_lifting_seed_production_cnter.qty : '',
                      "lifted_qty": el && el.total_quantity ? el.total_quantity : '',
                      "is_payment_completed": el && el.is_payment_completed && (el.is_payment_completed == true) ? 'Done' : 'Not Done',
                      "is_certificate_generated": el && el.is_certificate_generated && (el.is_certificate_generated == true) ? 'Done' : 'Not Done',

                    }
                  ]
                }
              ]
            });
          }

        }
      });
      if (filteredData && filteredData.length > 0) {

        filteredData.forEach((item, index) => {
          item.variety_count = item.variety.length ? item.variety.length : 0;
          item.variety.forEach(elem => {
            elem.spa_count = elem.spas.length;

            elem.spas.forEach(val => {
              val.amount_count = val.amount.length

            })
          })
          // item.variety[index].spa_count=item.variety.spas.length;
        })
      }
      const allocationdData = await generateBills.findAll({
        include: [
          {
            model: db.allocationToSPAProductionCenterSeed,

            where: {
              state_code: {
                [Op.eq]: sequelize.col('generate_bills.state_code')
              },
            }
          },
          {
            model: varietyModel,
            attributes: ['variety_name', 'not_date']
          },
          {
            model: cropModel,
            attributes: ['crop_name', 'crop_code']
          },
          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: ['agency_name']
            },
            ],

            attributes: ['name', 'id'],
            where: {
              id: {
                // state_id = ${req.body.loginedUserid.state_id}
                [Op.in]: sequelize.literal(`(SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id"
                  WHERE state_id IN (${uniqueArray}) AND  
                  user_type = 'SPA')`)
              }
            },

          }
        ],
        // attributes:['id'],
        where: {
          ...filters,
          user_id: req.body.loginedUserid.id
        },
      })
      let filteredDatas = []


      let filterindata = {
        data: filteredData,
        allocationdData: allocationdData
      }

      if (filteredData && filteredData.length > 0 && allocationdData && allocationdData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, filterindata)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getActualProduction = async (req, res) => {
    try {
      let condition = {

        attributes: [
          [sequelize.fn('SUM', sequelize.literal("weight::integer")), 'total_production'],
          // [sequelize.fn('SUM', sequelize.col(weight::INTEGER)), 'total_production']
        ],
        // group: ['id'
        //   // [sequelize.col('id'), 'id'],
        // ],
        where: {},
        raw: true
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year_of_indent = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = { [Op.like]: req.body.search.crop_type }
        }
      }
      let data2 = await labelNumberForBreederseed.findAll(condition);

      return response(res, status.DATA_AVAILABLE, 200, data2);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500);
    }
  }

  static seedtestingreportingapilotNumber = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: filters,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.lot_number')), 'lot_number'],
        ]
      };
      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      data = await lotNumberModel.findAll(condition);
      // console.log("datadatadata -------", data)

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
  static getTotalPendingAllocatedProdBreederSeedSecond = async (req, res) => {
    let data = {};
    try {
      let breederId;
      let filterData1 = []
      if (req.body.search) {
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });

        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {

          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
          })
        }

      }
      if (req.body && req.body.search) {
        if (req.body.search.graphType && req.body.search.graphType == "pdpc") {
          breederId = {
            breeder_id: req.body.loginedUserid.id
          }
        }
      }
      let condition = {
        include: [

          {
            model: bsp1ProductionCenterModel,
            attributes: ['quantity_of_seed_produced'],
            // attributes: [
            //           [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"]
            //         ],
            where: {},
          },
          {
            model: cropModel,
            attributes: [],
            where: {
              // ...breederId,
              breeder_id: req.body.loginedUserid.id,
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              }
            },


          }
        ],
        attributes: [
          'id'
        ],
        // where:{
        //   year:req.body.search.year,
        //   season : req.body.search.season,
        //   crop_code:{
        //     [Op.like]:req.body.search.crop_type + "%"
        //   },
        //   user_id: req.body.search.user_id,
        // },
        where: { [Op.and]: filterData1 ? filterData1 : [], user_id: req.body.search.user_id },
        raw: true
      };

      data = await bsp1Model.findAll(condition);
      let filterData = []
      if (req.body.search) {
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });

        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
        if (req.body.search.season) {

          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {

          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
          })
        }

      }
      let indentorData = await indenterModel.findAll({
        include: [
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id

            }

          }
        ],
        where: { [Op.and]: filterData ? filterData : [], icar_freeze: 1 },
        raw: true,
      });
      let productionData;
      productionData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }


        ],
        attributes: [
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "total_production"],
        ],
        // group:[
        //   [sequelize.col('lot_number_creations.lot_number_size'),'lot_number_size']
        // ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true,
      })

      let productionDataValue = productionData && productionData[0] && productionData[0].total_production ? productionData[0].total_production : 0
      let sumofAllElemnet = bsp3Helper.sumOfAllElements(data, 'bsp1_production_centers.quantity_of_seed_produced')
      let sumofIndendetorData = bsp3Helper.sumOfAllElements(indentorData, 'indent_quantity')

      let quantity_of_seed_producedArr = []
      quantity_of_seed_producedArr.push({ 'quantity_of_seed_produced': sumofAllElemnet ? sumofAllElemnet : 0, 'sumofIndendetorData': sumofIndendetorData ? sumofIndendetorData : 0, 'productionDataValue': productionDataValue ? parseFloat(productionDataValue) : 0 })
      response(res, status.DATA_AVAILABLE, 200, quantity_of_seed_producedArr)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static assignIndentingVarietyWillingProduceData = async (req, res) => {
    let returnResponse = {};
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
      let userId;
      if (id) {
        userId = {
          bspc_id: id
        }
      };
      console.log("userId========", userId);
      let { search } = req.body;
      let filter = await ConditionCreator.breederBspFormFilter(search);
      let willingProduction = await seedForProductionModel.findAll({
        where: {
          ...filter,
          user_id: id
        },
        attributes: ['variety_code',],
        raw: true
      })
      // console.log('willingProduction==',willingProduction);
      let varietyCode = [];
      willingProduction.forEach(ele => {
        varietyCode.push(ele.variety_code);
      })
      let willingProductions = await seedForProductionModel.findAll({
        where: {
          ...filter,
          user_id: id
        },
        attributes: ['variety_line_code'],
        raw: true
      })
      // console.log('willingProduction==',willingProduction);
      let variety_line_code = [];
      willingProductions.forEach(ele => {
        variety_line_code.push(ele.variety_line_code);
      })
      variety_line_code = variety_line_code.filter(item => item !== null);
      const queryData = await db.VarietyLines.findAll({
        where: {
          // ...filter,
          // [Op.or]:[{
          variety_code: {
            [Op.in]: varietyCode
          },
          line_variety_code: {
            [Op.notIn]: variety_line_code
          },
          // }

          // ]

        },
        raw: true

      });

      let condition;
      console.log(queryData)
      let queryDatavarietyCode = [];

      // return response(res, status.OK, 200, queryData);/
      if (queryData && queryData.length > 0) {
        queryData.forEach((el, i) => {
          queryDatavarietyCode.push(el && el.variety_code ? el.variety_code : '')
        })
        if (varietyCode && varietyCode.length > 0) {
          varietyCode = varietyCode.filter(item => !queryDatavarietyCode.includes(item));
          console.log('varietyCode', varietyCode)
          condition = {
            include: [
              {
                required: true,
                model: varietyModel,
                where: {
                  is_active: 1,
                  [Op.or]: [


                    {
                      status: {
                        [Op.eq]: null
                      }

                    },
                    {
                      status: {
                        [Op.in]: ['hybrid', 'variety']
                      }

                    },
                    // {
                    //   status: {
                    //     [Op.eq]:' '
                    //   }

                    // },
                  ]

                },
                attributes: [],
                raw: true,
              },
              {
                model: assignBspcCropNewFlow,
                attributes: [],
                where: {
                  ...userId
                }
              },
            ],
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('m_crop_variety.status'), 'status'],
              [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            ],
            where: {
              [Op.and]: [
                { ...filter },
                { variety_code: { [Op.notIn]: varietyCode } },

                { is_active: 1 },
                { willing_to_praduced: 1 }
              ]
            }
          }
        } else {
          condition = {
            include: [
              {
                required: true,
                model: varietyModel,
                where: {
                  is_active: 1,
                  [Op.or]: [


                    {
                      status: {
                        [Op.eq]: null
                      }

                    },
                    {
                      status: {
                        [Op.in]: ['hybrid', 'variety']
                      }

                    },
                    // {
                    //   status: {
                    //     [Op.eq]:' '
                    //   }

                    // },
                  ]

                },
                attributes: [],
                raw: true,
              },
              {
                model: assignBspcCropNewFlow,
                attributes: [],
                where: {
                  ...userId
                }
              },
            ],
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('m_crop_variety.status'), 'status'],
              [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            ],
            where: {
              [Op.and]: [
                { ...filter },
                // { variety_code: { [Op.notIn]: varietyCode  }       },                

                { is_active: 1 },
                { willing_to_praduced: 1 }
              ]
            }
          }
        }
      } else {
        if (varietyCode && varietyCode.length > 0) {

          condition = {
            include: [
              {
                required: true,
                model: varietyModel,
                where: {
                  is_active: 1,
                  [Op.or]: [


                    {
                      status: {
                        [Op.eq]: null
                      }

                    },
                    {
                      status: {
                        [Op.in]: ['hybrid', 'variety']
                      }

                    },
                    // {
                    //   status: {
                    //     [Op.eq]:' '
                    //   }

                    // },
                  ]

                },
                attributes: [],
                raw: true,
              },
              {
                model: assignBspcCropNewFlow,
                attributes: [],
                where: {
                  ...userId
                }
              },
            ],
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('m_crop_variety.status'), 'status'],
              [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            ],
            where: {
              [Op.and]: [
                { ...filter },
                { variety_code: { [Op.notIn]: varietyCode } },

                { is_active: 1 },
                { willing_to_praduced: 1 }
              ]
            }
          }
        } else {
          condition = {
            include: [
              {
                required: true,
                model: varietyModel,
                where: {
                  is_active: 1,
                  [Op.or]: [


                    {
                      status: {
                        [Op.eq]: null
                      }

                    },
                    {
                      status: {
                        [Op.in]: ['hybrid', 'variety']
                      }

                    },
                    // {
                    //   status: {
                    //     [Op.eq]:' '
                    //   }

                    // },
                  ]

                },
                attributes: [],
                raw: true,
              },
              {
                model: assignBspcCropNewFlow,
                attributes: [],
                where: {
                  ...userId
                }
              },
            ],
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('m_crop_variety.status'), 'status'],
              [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            ],
            where: {
              [Op.and]: [
                { ...filter },
                // { variety_code: { [Op.notIn]: varietyCode  }       },                

                { is_active: 1 },
                { willing_to_praduced: 1 }
              ]
            }
          }
        }
      }
      // if (varietyCode && varietyCode.length > 0) {
      //   if(queryData && queryData.length>0){

      //     condition = {
      //      include: [
      //        {
      //          required: true,
      //          model: varietyModel,
      //          where: {
      //            is_active: 1,
      //            [Op.or]: [


      //              {
      //                status: {
      //                  [Op.eq]: null
      //                }

      //              },
      //              {
      //                status: {
      //                  [Op.in]: ['hybrid', 'variety']
      //                }

      //              },
      //              // {
      //              //   status: {
      //              //     [Op.eq]:' '
      //              //   }

      //              // },
      //            ]

      //          },
      //          attributes: [],
      //          raw: true,
      //        },
      //        {
      //          model: assignBspcCropNewFlow,
      //          attributes: [],
      //          where: {
      //            ...userId
      //          }
      //        },
      //      ],
      //      raw: true,
      //      attributes: [
      //        [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
      //        [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
      //        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      //        [sequelize.col('m_crop_variety.status'), 'status'],
      //        [sequelize.col('m_crop_variety.is_active'), 'is_active'],
      //      ],
      //      where: {
      //        [Op.and]: [
      //          { ...filter },
      //          // { variety_code: { [Op.notIn]: varietyCode  },                          

      //          { is_active: 1 },
      //          { willing_to_praduced: 1 }
      //        ]
      //      }
      //    }
      //   }
      //   else{
      //     console.log('elksse')
      //     condition = {
      //       include: [
      //         {
      //           required: true,
      //           model: varietyModel,
      //           where: {
      //             is_active: 1,
      //             [Op.or]: [


      //               {
      //                 status: {
      //                   [Op.eq]: null
      //                 }

      //               },
      //               {
      //                 status: {
      //                   [Op.in]: ['hybrid', 'variety']
      //                 }

      //               },
      //               // {
      //               //   status: {
      //               //     [Op.eq]:' '
      //               //   }

      //               // },
      //             ]

      //           },
      //           attributes: [],
      //           raw: true,
      //         },
      //         {
      //           model: assignBspcCropNewFlow,
      //           attributes: [],
      //           where: {
      //             ...userId
      //           }
      //         },
      //       ],
      //       raw: true,
      //       attributes: [
      //         [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
      //         [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
      //         [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      //         [sequelize.col('m_crop_variety.status'), 'status'],
      //         [sequelize.col('m_crop_variety.is_active'), 'is_active'],
      //       ],
      //       where: {
      //         [Op.and]: [
      //           { ...filter },
      //           { variety_code: { [Op.notIn]: varietyCode  }, } ,                      

      //           { is_active: 1 },
      //           { willing_to_praduced: 1 }
      //         ]
      //       }
      //     }
      //   }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
      returnResponse = await assignCropNewFlow.findAll(condition);
      //  if(returnResponse)
      //   // if(returnResponse && returnResponse.length>0){
      //   //   returnResponse.forEach((el,i)=>{
      //   //     if(el && el.status=='hybrid'){

      //   //     }
      //   //   })
      //   // }
      //   console.log(returnResponse,'returnResponse')
      return response(res, status.OK, 200, returnResponse);
      // } else {
      //   console.log('hii')
      //   let condition
      //   // if(queryData && queryData.length>0){

      //   // }
      //    condition = {
      //     include: [
      //       {
      //         required: true,
      //         model: varietyModel,
      //         where: {
      //           is_active: 1,
      //           [Op.or]: [


      //             {
      //               status: {
      //                 [Op.eq]: null
      //               }

      //             },
      //             {
      //               status: {
      //                 [Op.in]: ['hybrid', 'variety']
      //               }

      //             },
      //             // {
      //             //   status: {
      //             //     [Op.eq]:' '
      //             //   }

      //             // },
      //           ]

      //           // status:{
      //           //   [Op.ne]:'other'
      //           // }
      //         },

      //         attributes: [],
      //         raw: true,
      //       },
      //       {
      //         model: assignBspcCropNewFlow,
      //         attributes: [],
      //         where: {
      //           ...userId
      //         }
      //       },
      //     ],
      //     raw: true,
      //     attributes: [
      //       [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
      //       [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
      //       [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      //       [sequelize.col('m_crop_variety.status'), 'status'],
      //       [sequelize.col('m_crop_variety.is_active'), 'is_active'],
      //     ],
      //     where: {
      //       [Op.and]: [
      //         { ...filter },
      //         { is_active: 1 },
      //         { willing_to_praduced: 1 }
      //         // { variety_code: { [Op.notIn]: varietyCode } }
      //       ]
      //     }
      //   }
      //   condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
      //   returnResponse = await assignCropNewFlow.findAll(condition);
      //   console.log(returnResponse,'returnResponse')
      //   return response(res, status.OK, 200, returnResponse);
      // }

    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static assignIndentingVarietyWillingProduceDataSecond = async (req, res) => {
    let returnResponse = {};
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
      let userId;
      if (id) {
        userId = {
          bspc_id: id
        }
      };

      let { search } = req.body;
      let filter = await ConditionCreator.breederBspFormFilter(search);
      let condition = {
        include: [
          {
            required: true,
            model: varietyModel,
            // include:[
            //   {
            //     model:db.VarietyLines

            //   }
            // ],
            where: {
              is_active: 1
            },
            attributes: [],
            raw: true,
          },
          {
            model: assignBspcCropNewFlow,
            attributes: [],
            where: {
              ...userId
            }
          },
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('assign_crops.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.status'), 'status'],
          [sequelize.col('m_crop_variety.is_active'), 'is_active'],
        ],
        where: {
          [Op.and]: [
            { ...filter },
            { willing_to_praduced: 1 },
            { is_active: 1 }
            // { variety_code: { [Op.notIn]: varietyCode } }
          ]
        }
      }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
      returnResponse = await assignCropNewFlow.findAll(condition);
      console.log(returnResponse, 'returnResponse')
      return response(res, status.OK, 200, returnResponse);

    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static cropAssignIndentingDataSecond = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {}

      condition = {
        include: [{
          required: true,
          model: cropModel,

          raw: true,
          required: true,
          attributes: [],
          where: {
            breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : 442,
            is_active: 1
          }
        },
        {
          required: true,
          model: varietyModel,
          attributes: [],
          raw: true,
        }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.id'), 'm_crop_id'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.group_code'), 'group_code'],
          [sequelize.col('m_crop.is_active'), 'is_active'],
        ],
        where: {
          icar_freeze: 1
        }
      };

      condition.group = [
        [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.id'), 'm_crop_id'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('m_crop.group_code'), 'group_code'],


      ];
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
      }

      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static cropAssignIndentingWillingProduceData = async (req, res) => {
    let returnResponse = {};
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
      let userId;
      if (id) {
        userId = {
          bspc_id: id
        }
      }
      let condition = {
        include: [{
          required: true,
          model: cropModel,
          raw: true,
          required: true,
          attributes: [],
        },
        {
          model: assignBspcCropNewFlow,
          attributes: [],
          where: {
            ...userId
          }
        }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('assign_crops.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.id'), 'm_crop_id'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.group_code'), 'group_code'],
        ],
        where: {
        }
      };
      condition.group = [
        [sequelize.col('assign_crops.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.id'), 'm_crop_id'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('m_crop.group_code'), 'group_code'],
      ];
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
        if (1) {
          condition.where.willing_to_praduced = 1;
          condition.where.is_active = 1;

        }
      }

      returnResponse = await assignCropNewFlow.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static sessionAssignIndentingWillingProduceData = async (req, res) => {
    let returnResponse = {};
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
      let userId;
      if (id) {
        userId = {
          bspc_id: id
        }
      }
      let condition = {
        include: [
          {
            required: true,
            model: seasonModel,
            attributes: [],
            raw: true,
          },
          {
            model: assignBspcCropNewFlow,
            attributes: [],
            where: {
              ...userId
            }
          }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('assign_crops.season')), 'season_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code'],
        ],
        where: {}
      };
      condition.group = [
        [sequelize.col('assign_crops.season'), 'season_code'],
        [sequelize.col('m_season.season'), 'season'],
        [sequelize.col('m_season.season_code'), 'season_code'],
      ];
      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.group_code = req.body.search.crop_group;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
        if (1) {
          condition.where.is_active = 1;
        }
      }
      returnResponse = await assignCropNewFlow.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static yearAssignIndentingWillingProduceData = async (req, res) => {
    let returnResponse = {};
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
      let userId;
      if (id) {
        userId = {
          bspc_id: id
        }
      }
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('assign_crops.year')), 'year'],
        ],
        include: [
          {
            model: assignBspcCropNewFlow,
            attributes: [],
            where: {
              ...userId
            }
          }
        ],
        where: {
          // user_id:req.body.loginedUserid.id
          willing_to_praduced: 1,
          is_active: 1
        }
      };
      condition.order = [['year', 'DESC']]
      returnResponse = await assignCropNewFlow.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static assignIndentingBspcWillingProduceData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: agencyDetailModel,
            // include:[
            //   {
            //     model:userModel,
            //     attributes:[]
            //   }
            // ],
            where: {
              [Op.and]: [
                {
                  id: {
                    [Op.ne]: null
                  },
                },
              ]
            },
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          user_type: "BPC",
        },
        attributes: [
          // [sequelize.col('agency_detail.agency_name'), 'agency_name'],          
          [
            sequelize.fn(
              'CONCAT',
              sequelize.col('agency_detail.agency_name'),
              ' (',
              sequelize.col('code'),
              ')'
            ),
            'agency_name'
          ],
          [sequelize.col('agency_detail.id'), 'agencyid'],
          'id'
        ]
      }
      condition.order = [[sequelize.fn('lower', sequelize.col('agency_detail.agency_name')), 'ASC']]

      if (req.body.search) {
        if (req.body.search.year) {
          yaerValue = { year: req.body.search.year }
        }
        if (req.body.search.season) {
          seasonValue = { season: req.body.search.season }
        }
        if (req.body.search.crop_code) {
          cropCodeValue = { crop_code: req.body.search.crop_code }
        }
      }

      const data = await userModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static assignIndentingVarietyAllData = async (req, res) => {
    let returnResponse = {};
    try {
      let breederId;
      if (req.body && req.body.search && req.body.search.user_type == "bspc") {
      } else {
        breederId = {
          breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : ''
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
          variety_code_line: {
            [Op.notIn]: varietyLineCode
          }
        }
      }

      let varietyCodeValueSecond = [];
      let varietyCodeValueSecond1 = [];
      let varietyCodeValueSecond2 = [];
      let varietyCode1;
      let varietyLineCodeArray;
      if (varietyCode && varietyCode.length) {
        varietyCode1 = {
          variety_code: {
            [Op.notIn]: varietyCode
          }
        }
      }

      if (varietyLineCode && varietyLineCode.length > 0) {
        let condition1 = {
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col('indent_of_breederseeds.variety_code')), 'variety_code']
          ],
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
              model: db.indentOfBrseedLines,
              attributes: [],
              required: true,
              where: {
                variety_code_line: {
                  [Op.notIn]: varietyLineCode
                }
              },
            }
          ],
          where: {
            ...filters,
          },
          raw: true
        }
        let varietyLineCodeData = await indentorBreederSeedModel.findAll(condition1);
        if (varietyLineCodeData && varietyLineCodeData.length) {
          varietyLineCodeData.forEach(ele => {
            if (ele.variety_code !== null && ele.variety_code !== undefined) {
              varietyCodeValueSecond.push(ele.variety_code);
            }
            // if (ele.variety_line_code && ele.variety_line_code != null && ele.variety_line_code != undefined) {
            //   varietyLineCode.push(ele.variety_line_code);
            // }
          })
        }

        let condition2 = {
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col('indent_of_breederseeds.variety_code')), 'variety_code']
          ],
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
              required: true,
              model: varietyModel,
              where: {
                is_active: 1,
                [Op.or]: [
                  {
                    status: {
                      [Op.not]: 'hybrid'
                    },
                  },
                  // {
                  //   status: {
                  //     [Op.eq]: null
                  //   },
                  // }
                ]
              },
              attributes: [],
            },
          ],
          where: {
            ...filters,
            ...varietyCode1
          },
          raw: true
        }
        let varietyLineCodeData1 = await indentorBreederSeedModel.findAll(condition2);
        if (varietyLineCodeData1 && varietyLineCodeData1.length) {
          varietyLineCodeData1.forEach(ele => {
            if (ele.variety_code !== null && ele.variety_code !== undefined) {
              varietyCodeValueSecond1.push(ele.variety_code);
            }
          })
        }
      }

      if (varietyCodeValueSecond && varietyCodeValueSecond.length > 0) {
        varietyCodeValueSecond2 = varietyCodeValueSecond1.concat(varietyCodeValueSecond)
      } else {
        varietyCodeValueSecond2 = varietyCodeValueSecond1;
      }
      if (varietyCodeValueSecond2 && varietyCodeValueSecond2.length) {
        varietyLineCodeArray = {
          variety_code: {
            [Op.in]: varietyCodeValueSecond2
          },
        }
      }
      if ((varietyLineCode && varietyLineCode.length > 0)) {
        let condition = {
          include: [{
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
            required: true,
            model: varietyModel,
            where: {
              is_active: 1,
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
            },
            attributes: [],
          },
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            [sequelize.col('m_crop_variety.status'), 'status'],
            // [sequelize.col('m_crop_variety->m_variety_line.line_variety_code'), 'line_variety_code'],

          ],
          where: {
            ...filters,
            icar_freeze: 1,
            [Op.or]: [

              // {
              //   variety_code: {
              //     [Op.notIn]: varietyCode
              //   },
              // },
              { ...varietyLineCodeArray }
            ]
          }
        };
        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
        returnResponse = await indentorBreederSeedModel.findAll(condition);
        return response(res, status.OK, 200, returnResponse);
      }
      else if ((varietyCode && varietyCode.length > 0)) {
        let condition = {
          include: [{
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
            required: true,
            model: varietyModel,
            where: {
              is_active: 1,
              [Op.or]: [
                {
                  status: {
                    [Op.not]: 'other'
                  },
                }, {
                  status: {
                    [Op.eq]: null
                  },
                }
              ]
            },
            attributes: [],
            // include: [
            //   {
            //     model: db.mVarietyLines,
            //     attributes: [],
            //     where: {
            //       ...varietyCodeValue
            //     }
            //   }
            // ],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            [sequelize.col('m_crop_variety.status'), 'status'],
          ],
          where: {
            icar_freeze: 1,
            ...filters,
            variety_code: {
              [Op.notIn]: varietyCode
            },

          }
        };
        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
        returnResponse = await indentorBreederSeedModel.findAll(condition);
        return response(res, status.OK, 200, returnResponse);
      } else {
        let condition = {
          include: [{
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
            required: true,
            model: varietyModel,
            where: {
              is_active: 1,
              [Op.or]: [
                {
                  status: {
                    [Op.not]: 'other'
                  },
                }, {
                  status: {
                    [Op.eq]: null
                  },
                }
              ]
            },
            attributes: [],
            raw: true,
          }
          ],
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop.id'), 'm_crop_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.is_active'), 'is_active'],
            [sequelize.col('m_crop_variety.status'), 'status'],
          ],
          where: {
            icar_freeze: 1,
            ...filters,
            // variety_code: {
            //   [Op.notIn]: varietyCode
            // }
          }
        };
        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
        returnResponse = await indentorBreederSeedModel.findAll(condition);
        return response(res, status.OK, 200, returnResponse);
      }
    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static assignIndentingVarietyAllDataSecond = async (req, res) => {
    let returnResponse = {};
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
      let condition = {
        include: [{
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
          required: true,
          model: varietyModel,
          where: {
            is_active: 1
          },
          attributes: [],
          raw: true,
        }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('m_crop.id'), 'm_crop_id'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          // [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.is_active'), 'is_active'],
          [sequelize.col('m_crop_variety.status'), 'status'],
        ],
        where: {
          icar_freeze: 1,
          ...filters,
          // variety_code: {
          //   [Op.notIn]: varietyCode
          // }
        }
      };
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
      returnResponse = await indentorBreederSeedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);

    } catch (error) {
      console.log("error", error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static assignIndentingVarietyFilterData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let filters = await ConditionCreator.breederBspFormFilter(search);
      let assignCropVarietyData = await assignCropNewFlow.findAll({
        include: [{ model: varietyModel, attributes: [] }], attributes: [[sequelize.fn("DISTINCT", sequelize.col('m_crop_variety.variety_name')), 'variety_name'], [sequelize.col('m_crop_variety.variety_code'), 'variety_code']], where: { ...filters }, raw: true
      });
      let varietyCode = [];
      if (assignCropVarietyData && assignCropVarietyData.length) {
        return response(res, status.DATA_AVAILABLE, 200, assignCropVarietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, returnResponse);
      }
    } catch (error) {
      console.log(error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static checkAssignCropVarietyAvailability = async (req, res) => {
    try {
      let { crop_code, variety_code, year, season, user_id } = req.body;
      let assignVarietyCount = await assignCropNewFlow.findAll({ where: { is_active: 1, crop_code: crop_code, year: year, season: season, user_id: user_id } });
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

  static assignCropFinalSubmit = async (req, res) => {
    try {
      let { crop_code, variety_code, year, season, user_id } = req.body;
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: assignBspcCropNewFlow,
            attributes: [],
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
            ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('assign_crop_bspc_mapping->user->agency_detail.agency_name')), 'agency_name'],
          // [sequelize.col('assign_crop_bspc_mapping->user->agency_detail.id'), "agency_id"],
          [sequelize.col('assign_crop_bspc_mapping->user->agency_detail.address'), 'agency_address'],
          [sequelize.col('assign_crop_bspc_mapping->user->agency_detail.mobile_number'), 'mobile_number'],
          [sequelize.col('assign_crop_bspc_mapping->user->agency_detail.email'), 'email'],
          [sequelize.col('assign_crop_bspc_mapping->user->agency_detail.contact_person_name'), 'contact_person_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        required: true,
        raw: true,
        where: {
          crop_code: crop_code, year: year, season: season, user_id: user_id,
          willing_to_praduced: 1
        }
      }
      let assignCropNewFlowData = await assignCropNewFlow.findAll(condition);

      assignCropNewFlowData.forEach(ele => {
        console.log("agency_name=====", ele.agency_name);
        // let testMsg = "Hi " + (ele && ele.contact_person_name ? ele.contact_person_name : 'NA') + "," + ele.agency_name + " has been assigned to produce " + ele.crop_name + "varieties for indent year" + year + " and season" + season + " Please confirm your willingness by filling the Add Nucleus/Breeder seed quantity willing to use for production form on the SATHI portal within 7 days."
        // let testMsg = "Dear " + (ele && ele.contact_person_name ? ele.contact_person_name : 'NA') + ",You have been allocated breeder seed production for " + ele.agency_name + "financial year for "+ year + " variety  of " + ele.crop_name + " crop on SATHI portal. Please login and check the details."
        let smsSeason = season == 'R' ? 'Rabi' : 'Kharif'
        let smsYear = year ? parseInt(year) - 1999 : ''
        let testMsg = "Hi User, You have been assigned varieties of " + ele.crop_name.substring(0, 9) + " from the " + smsSeason + " " + year + "-" + smsYear + " Breeder Seed Indents. Please fill the willingness form within 7 days. SATHI-Krishi"
        let smsData = {
          "message": testMsg ? testMsg : '',
          "mnumber": ele && ele.mobile_number ? ele.mobile_number : '',
          "dlt_template_id": '1707170774229047597'
        }
        sendSms(smsData);
      })

      let assignCropData = assignCropNewFlow.update({ is_active: 1 }, { where: { crop_code: crop_code, year: year, season: season, user_id: user_id } });
      if (assignCropData) {
        return response(res, status.DATA_SAVE, 200, []);
      } else {
        return response(res, status.DATA_NOT_SAVE, 201, []);
      }
    }
    catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getParentalData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {

        'search.crop_code': 'string',
        // 'search.variety_code': 'string',

      };
      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();
      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {
        let { page, pageSize } = req.body;
        if (!page) page = 1;
        let condition = {


        };
        let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '';
        let userId;
        if (id) {
          userId = {
            bspc_id: id
          }
        };
        let { search } = req.body;
        let filter = await ConditionCreator.breederBspFormFilter(search);
        let willingProduction = await seedForProductionModel.findAll({
          where: {
            ...filter,
            user_id: id
          },
          attributes: ['variety_line_code'],
          raw: true
        })
        // console.log('willingProduction==',willingProduction);
        let variety_line_code = [];
        willingProduction.forEach(ele => {
          variety_line_code.push(ele.variety_line_code);
        })
        const queryData = await db.VarietyLines.findAll({
          where: {
            variety_code: req.body.search.variety_code,
            line_variety_code: {
              [Op.notIn]: variety_line_code
            }
          }
        });
        // console.log(queryData.rows)
        if (queryData) {
          response(res, status.DATA_AVAILABLE, 200, queryData, internalCall);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 200, '', internalCall);
        }

      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getDataForReceivedIndentsOfBreederSeedsSecond = async (req, res) => {
    try {
      const filters = req.body.filters;
      const user = req.body.loginedUserid;

      const condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            // attributes: ['id'],
            left: true,
            include: [
              {
                model: agencyDetailModel,
                left: true,
                attributes: [],
                // attributes: ['id', 'short_name'],
              },
            ],
            where: {
              user_type: 'IN'
            }
          },
          {
            model: varietyModel,
            // include: [
            //   {
            //     model: db.lineVariety,
            //     attributes: [],
            //   }
            // ],
            required: true,
            attributes: [],
            // attributes: ['variety_name', 'variety_code', 'not_date'],
            where: {}
          },
         
          {
            model: db.indentOfBrseedLines,
            include: [
              {
                model: db.lineVariety,
                attributes: [],
              }
            ],
            attributes: [],
          },
          {
            model: cropModel,
            attributes:[]
          }
        ],
        attributes: [],
        // attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'is_freeze', 'icar_freeze'],
        where: {
          user_id: {
            [Op.ne]: null,
          },
          year: filters.year,
          season: filters.season,
          // crop_code: filters.crop_code,
        },
        attributes: [
          [sequelize.col('indent_of_breederseeds.id'), 'id'],
          [sequelize.col('indent_of_breederseeds.user_id'), 'user_id'],         
          [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
          [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
          [sequelize.col('indent_of_breederseeds.is_freeze'), 'is_freeze'],
          [sequelize.col('indent_of_breederseeds.is_forward'), 'is_forward'],
          [sequelize.col('indent_of_breederseeds.icar_freeze'), 'icar_freeze'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.not_date'), 'not_date'],
          [sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_brseed_line->m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('user->agency_detail.short_name'), 'short_name'],
          [sequelize.col('user->agency_detail.id'), 'agency_id'],
          [sequelize.col('indent_of_brseed_line.quantity'), 'qty'],
          [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

        ],
        raw: true
      };

      if(filters){
        if(filters.crop_code){
          condition.where.crop_code = filters.crop_code
        }
        if(filters.year){
          condition.where.year = parseInt(filters.year)
        }
        if(filters.season){
          condition.where.season = filters.season
        }
        if(filters.crop_type){
          condition.where.crop_code = {
            [Op.like]:filters.crop_type + '%'
          }
        }
        if(filters.crop_code_array && filters.crop_code_array.length>0 ){
          condition.where.crop_code = {
            
              [Op.in]:filters.crop_code_array
            
          }
        }
      
      }

      if (user.user_type == "ICAR") {
        // condition.where.is_freeze = 1
        condition.where.is_forward = 1
        condition['include'][1].where["crop_code"] = {
          [Op.like]: "A%",
        }
      }

      else if (user.user_type == "HICAR") {
        // condition.where.is_freeze = 1
        condition.where.is_forward = 1
        condition['include'][1].where["crop_code"] = {
          [Op.like]: "H%",
        }
      }
      else if (filters.user_type == "seed-division") {
        // condition.where.is_indenter_freeze = 1
      } else {
        condition.where.icar_freeze = 1
      }
      condition.order=[['crop_name','ASC']]
      const data = await indentorBreederSeedModel.findAll(condition);
      let filterData = [];
      data.forEach((el, index) => {
        // let cropIndex
        const cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
        if (cropIndex == -1) {
          filterData.push({
            "variety_name": el && el.variety_name ? el.variety_name : '',
            "variety_id": el && el.variety_id ? el.variety_id : '',
            "variety_code": el && el.variety_code ? el.variety_code : '',
            "crop_code":el && el.crop_code ? el.crop_code : '',
            "crop_name":el && el.crop_name ? el.crop_name : '',
            "not_date": el && el.not_date ? el.not_date : '',
            variety: [
              {
                "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
                // "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
                "line_variety_code": el && el.line_variety_code ? el.line_variety_code : '',
                bspc: [
                  {
                    "indent_quantity": el && el.indent_quantity ? el.indent_quantity : '',
                    "short_name": el && el.short_name ? el.short_name : '',
                    "qty": el && el.qty ? el.qty : '',
                    "variety_code_line": el && el.variety_code_line ? el.variety_code_line : '',
                  }
                ]
              },

            ]
          })
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.line_variety_code === el.line_variety_code);
          if (varietyIndex != -1) {
            filterData[cropIndex].variety[varietyIndex].bspc.push({
              "indent_quantity": el && el.indent_quantity ? el.indent_quantity : '',
              "short_name": el && el.short_name ? el.short_name : '',
              "qty": el && el.qty ? el.qty : '',
              "variety_code_line": el && el.variety_code_line ? el.variety_code_line : '',
            })
          } else {
            filterData[cropIndex].variety.push(
              {
                "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
                // "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
                "line_variety_code": el && el.line_variety_code ? el.line_variety_code : '',
                bspc: [
                  {
                    "indent_quantity": el && el.indent_quantity ? el.indent_quantity : '',
                    "short_name": el && el.short_name ? el.short_name : '',
                    "qty": el && el.qty ? el.qty : '',
                    "variety_code_line": el && el.variety_code_line ? el.variety_code_line : '',
                  }
                ]
              },
            )
          }
        }
      })
      let responseData = {
        data: filterData,
        allData: data
      }

      return response(res, status.DATA_AVAILABLE, 200, responseData);
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
module.exports = breederController
