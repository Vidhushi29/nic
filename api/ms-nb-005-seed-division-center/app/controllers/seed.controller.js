require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
let Validator = require('validatorjs');
const { getYear, parseISO } = require('date-fns');

const stateModel = db.stateModel;
const districtModel = db.districtModel;
const seasonModel = db.seasonModel;
const cropModel = db.cropModel;
const cropCharactersticsModel = db.cropCharactersticsModel;
const cropGroupModel = db.cropGroupModel;
const agencyDetailModel = db.agencyDetailModel
const designationModel = db.designationModel;
const userModel = db.userModel
const seedMultiplicationRatioModel = db.seedMultiplicationRatioModel
const cropVerietyModel = db.cropVerietyModel
const maxLotSizeModel = db.maxLotSizeModel
const seedLabTestModel = db.seedLabTestModel;
const bankDetailsModel = db.bankDetailsModel;
const seasonValueModel = db.seasonValueModel;
const districtLatLongModel = db.districtLatLongModel;
const indentOfBreederseedModel = db.indentOfBreederseedModel;
const varietyModel = db.varietyModel;
const paginateResponse = require("../_utility/generate-otp");
const characterStateModel = db.characterStateModel;
const responsibleInsitutionModel = db.responsibleInsitutionModel;
const allocationToIndentor = db.allocationToIndentor;
const bsp1Model = db.bsp1Model;
const bsp5bModel = db.bsp5bModel;
const plantDetail = db.plantDetail;
const mCategoryOrgnization = db.mCategoryOrgnization;
const otherFertilizerModel = db.otherFertilizerModel;
const otherFertilizerMapping = db.otherFertilizerMapping;
const lotNumberModel = db.lotNumberModel;
const seedTestingReportsModel = db.seedTestingReportsModel;
const varietyCategoryModel = db.varietyCategoryModel;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed;
const allocationToIndentorSeed = db.allocationToIndentorSeed

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { crop } = require('imagemagick');
const Op = require('sequelize').Op;
const Minio = require("minio");
const Multer = require("multer");
const path = require('path');
const { condition, where } = require('sequelize');
const SeedUserManagement = require('../_helpers/create-user');
const seedhelper = require('../_helpers/seedhelper');

class SeedController {
  static clientSetUp = async () => {
    return new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
    });
  }

  static breederSeedssubmision = async (req, res) => {
    try {
      const user_id = req.body.loginedUserid.id
      const dataRow = {
        botanic_name: req.body.botanic_name,
        crop_code: req.body.crop_code,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        // group_code: req.body.group_code,
        season: req.body.season,
        srr: req.body.srr,
        group_code: req.body.group_code,
        is_active: req.body.active,
        hindi_name:req.body.crop_name_hindi? req.body.crop_name_hindi :null,
        scientific_name: req.body.botanic_name,
        user_id: user_id,
        
      };

      // console.log('dataRow============'.dataRow);
      // else{
      let tabledAlteredSuccessfully = false;
      if (req.params && req.params["id"]) {
        const existingDataBotanical = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('botanic_name')),
                    sequelize.fn('lower', (req.body.botanic_name))),

                },
                // {
                //   crop_group: {
                //     [Op.eq]:  req.body.crop_group
                //   }

                // },
                // {
                //   group_code: {
                //     [Op.eq]:  req.body.group_code
                //   }

                // },
                {
                  id: {
                    [Op.ne]: req.params["id"]
                  }

                }

              ]
            },


          }



        );

        if (existingDataBotanical && existingDataBotanical.length) {
          const returnresponse = {
            error: 'Botanical name is already registered for this crop'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        await cropModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
          tabledAlteredSuccessfully = true;
        }).catch(function (err) {

        });
      }
      else {
        const existingData = await cropModel.findAll({
          where: sequelize.where(
            sequelize.fn('lower', sequelize.col('crop_name')),
            sequelize.fn('lower', (req.body.crop_name)),
          ),


        },


        );

        const existingDataBotanical = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('botanic_name')),
                    sequelize.fn('lower', (req.body.botanic_name))),

                }
              ]
            },
          }
        );

        const existingDataAll = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.eq]: req.body.crop_code
                  }
                },
                {
                  group_code: {
                    [Op.eq]: req.body.group_code
                  }

                },
                {
                  season: {
                    [Op.eq]: req.body.season
                  }
                },
              ]
            },
          }
        );
        const existingDataCropCode = await cropModel.findAll(
          {
            where: {
              group_code: req.body.group_code,
              crop_code: req.body.crop_code,
            }
          }
        );
        if (existingDataCropCode && existingDataCropCode.length) {
          const returnresponse = {
            error: 'Crop Already Exist'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingDataBotanical && existingDataBotanical.length) {
          const returnresponse = {
            error: 'Botanical name is already registered'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingDataAll && existingDataAll.length) {
          const returnresponse = {
            error: 'Crop Already Exist'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingData === undefined || existingData.length < 1) {
          const data = await cropModel.create(dataRow);
          await data.save();
          tabledAlteredSuccessfully = true;
        }
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
      // }


    }
    catch (error) {
      console.log(error, 'dataRow');
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static getBreederSeedssubmisionWithId = async (req, res) => {
    try {
      const data = await cropModel.findAll({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: cropGroupModel

          }
        ]
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

  static getCroupGroupDeatils = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition.order = [['group_name', 'ASC']]
      data = await cropGroupModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getSeedMultiplicationCroupGroupDeatils = async (req, res) => {
    let data = {};
    try {
      data = await cropGroupModel.findAll();
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCropDataByGroupCode = async (req, res) => {
    try {
      const data = await cropModel.findAll({
        where: {
          group_code: req.body.cropGroupCode
        }
      })

      response(res, status.DATA_AVAILABLE, 200, data)

    } catch (error) {
      console.log(error)
      response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static getSeasonDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition.order = [['id', 'asc']];
      data = await seasonModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBspOneSeasonDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: seasonModel
          },
        ],
        where: {
          icar_freeze: 1
        },
        attribute: []
      };
      condition.order = [['id', 'asc']];
      data = await indentOfBreederseedModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static indentorList = async (req, res) => {
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
          ],
          where: {
            id: req.body.id,

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
          ],
          where: {

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



      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      console.log('req.body.searchreq.body.search', req.body.search);
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
      condition.order = [[sortOrder, sortDirection]];

      data = await agencyDetailModel.findAndCountAll(condition);
      // res.send(data)



      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDesignation = async (req, res) => {
    let data = {};
    try {
      data = await designationModel.findAll();
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static addIndentor = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      let tabledAlteredSuccessfully = false;
      const usersData = {
        agency_name: req.body.agency_name,
        created_by: 1,//req.body.created_by,
        category: req.body.category,
        // state_id: req.body.state,
        // district_id: req.body.district,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        mobile_number: req.body.mobile_number
      }

      const existingData = await agencyDetailModel.findAll({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('short_name')),
          sequelize.fn('lower', req.body.display_name),
        )
      });

      if (existingData === undefined || existingData.length < 1) {
        const data = agencyDetailModel.build(usersData);
        const insertData = await data.save();
        const userData = userModel.build({
          agency_id: insertData.id,
          username: req.body.display_name,
          name: req.body.display_name,
          email_id: req.body.email,
          password: '123456',
          mobile_number: req.body.mobile_number,
          // designation_id: req.body.contact_person_designation,
          user_type: 'BR',
        });
        await userData.save();
        tabledAlteredSuccessfully = true;
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }



      // if (req.body.search) {
      //   condition.where = {};
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   let data = await agencyDetailModel.findAndCountAll(condition);
      //   if (data) {

      //     return response(res, status.DATA_AVAILABLE, 200, data)
      //   }
      //   else {
      //     return response(res, status.DATA_NOT_AVAILABLE, 400)
      //   }
      // }
      // return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
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

      // console.log("dtaaa111111111", data)
      const USER_API_KEY = process.env.APPKEY
      let seedUserData = { "appKey": USER_API_KEY, "stateCode": "CENTRAL", "role": data.user_type, "userid": data.username }
      console.log("seedUserData", seedUserData)
      await SeedUserManagement.inactiveUser(seedUserData);


      if (req.body !== undefined
        && req.body.crop_data !== undefined
        && req.body.crop_data.length > 0) {
        for (let index = 0; index < req.body.crop_data.length; index++) {
          const element = req.body.crop_data[index];
          console.log(element,'element')
          console.log('hiiiii', element.crop_code);
          const datas = cropModel.update({
            breeder_id: null
          }, {
            where: {
              crop_code: element.crop_code
            }
          })
        }
      }
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
          agency_id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500)
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

  static updateIndentor = async (req, res) => {
    let internalCall = {};
    try {
      let tabledAlteredSuccessfully = false;
      const id = req.body.id;
      let usersData = {
        agency_name: req.body.agency_name,
        created_by: 1,//req.body.created_by,
        category: req.body.category,
        // state_id: req.body.state,
        // district_id: req.body.district,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        mobile_number: req.body.mobile_number
      };

      const existingData = await agencyDetailModel.findAll({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('short_name')),
          sequelize.fn('lower', req.body.display_name),
        )
      });

      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update({ usersData }, {
          where: {
            id: id
          }
        });
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

  //   static addIndentor = async (req, res) => {
  //     try {
  //         const dataRow = {
  //           agency_name: req.body.agency_name,
  //           created_by: 1,//req.body.created_by,
  //           category: req.body.category,
  //           state_id: req.body.state,
  //           district_id: req.body.district,
  //           short_name: req.body.display_name,
  //           address: req.body.address,
  //           contact_person_name: req.body.contact_person_name,
  //           contact_person_designation: req.body.contact_person_designation_id,
  //           // contact_person_mobile: req.body.mobile_number,
  //           phone_number: req.body.phone_number,
  //           fax_no: req.body.fax_no,
  //           longitude: req.body.longitude,
  //           latitude: req.body.latitude,
  //           email:req.body.email,
  //           bank_name: req.body.bank_name,
  //           bank_branch_name: req.body.bank_branch_name,
  //           bank_ifsc_code: req.body.bank_ifsc_code,
  //           bank_account_number: req.body.bank_account_number,
  //           state_id: req.body.state_id,
  //           district_id: req.body.district_id,
  //           mobile_number:req.body.mobile_number

  //         };
  //         let tabledAlteredSuccessfully = false;
  //         if (req.params && req.params["id"]) {
  //             await agencyDetailModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
  //                 tabledAlteredSuccessfully = true;
  //             }).catch(function (err) {

  //             });
  //         }
  //         else {
  //             const existingData = await agencyDetailModel.findAll(
  //                 {
  //                     where: {
  //                       agency_name: req.body.agency_name,
  //                       created_by: 1,//req.body.created_by,
  //                       category: req.body.category,
  //                       state_id: req.body.state,
  //                       district_id: req.body.district,
  //                       short_name: req.body.display_name,
  //                       address: req.body.address,
  //                       contact_person_name: req.body.contact_person_name,
  //                       contact_person_designation: req.body.contact_person_designation_id,
  //                       // contact_person_mobile: req.body.mobile_number,
  //                       phone_number: req.body.phone_number,
  //                       fax_no: req.body.fax_no,
  //                       longitude: req.body.longitude,
  //                       latitude: req.body.latitude,
  //                       email:req.body.email,
  //                       bank_name: req.body.bank_name,
  //                       bank_branch_name: req.body.bank_branch_name,
  //                       bank_ifsc_code: req.body.bank_ifsc_code,
  //                       bank_account_number: req.body.bank_account_number,
  //                       state_id: req.body.state_id,
  //                       district_id: req.body.district_id,
  //                       mobile_number:req.body.mobile_number

  //                     }
  //                 }
  //             );
  //             console.log(existingData,'existingData');
  //             if (existingData === undefined || existingData.length < 1) {
  //                 const data = await agencyDetailModel.create(dataRow);
  //                 // await data.save();
  //                 tabledAlteredSuccessfully = true;
  //             }
  //         }

  //         if (tabledAlteredSuccessfully) {
  //             return response(res, status.DATA_SAVE, 200, {})
  //         } else {
  //             return response(res, status.DATA_NOT_AVAILABLE, 404)
  //         }
  //     }
  //     catch (error) {
  //         console.log(error, 'dataRow');
  //         return response(res, status.DATA_NOT_SAVE, 500)
  //     }
  // }
  static viewIndentor = async (req, res) => {
    let data = {};
    try {

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {
        include: [
          {
            model: userModel,
            attributes: ['*']
          },
        ],
        // where: {
        //   is_active: 1
        // },
        // raw: false,
        // attributes: [
        //   '*'
        // ]
        // where: {
        //   id: req.body.id
        // }
      };

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [['crop_name', 'ASC']];

      data = await agencyDetailModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }



  static viewSeedMuliplicationRatio = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.ne]: null
                  }

                },
                {
                  crop_code: {
                    [Op.ne]: ""
                  }

                }

              ]
            },
            include: [
              {
                model: cropGroupModel
              }

            ],
            left: true,
            attributes: ['crop_name']
          },
        ],
        where: {
          [Op.and]: [
            {
              crop_code: {
                [Op.ne]: null
              }

            },
            {
              crop_code: {
                [Op.ne]: ""
              }

            }

          ]
        },


      }
      if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 50;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.fn('lower', sequelize.col('m_crop.crop_name')), 'ASC']];

      if (search) {
        if (search.crop_group_code) {
          condition.where['crop_group_code'] = search.crop_group_code
        }

        if (search.crop_code) {
          condition.where['crop_code'] = search.crop_code
        }
      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
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

  static viewSeedMuliplicationRatioByCropCode = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.ne]: null
                  }

                },
                {
                  crop_code: {
                    [Op.ne]: ""
                  }

                }

              ]
            },
            include: [
              {
                model: cropGroupModel
              }

            ],
            left: true,
            attributes: ['crop_name']
          },
        ],
        where: {}
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 50;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sortOrder, sortDirection]];

      if (search.isSearch) {
        if (search.crop_group_code) {
          condition.where['crop_group_code'] = search.crop_group_code
        }

        if (search.crop_code) {
          condition.where['crop_code'] = search.crop_code
        }
      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
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


  static getTransactionsDetails = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        'search.crop_group_code': 'string',
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

      let { page, pageSize, search } = req.body;


      let condition = {
        include: [{
          model: cropGroupModel
        }],
        where: {
          // is_active: 1
        },
        raw: false,

      };
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';



      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.crop_name_data) {

          condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (req.body.search.crop_group) {

        //   condition.where.crop_group = (req.body.search.crop_group);
        // }

      }


      const queryData = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getbreederList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
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
      console.log('data', data)
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDynamicVarietyCode = async (req, res) => {
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
      console.log("req.body.search.crop_code", req.body.search.crop_code);
      let condition = {

        where: {
          variety_code: {
            [Op.like]: "%" + req.body.search.crop_code + "%",
          },
          // id: req.body.search.variety_id,
          is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [[sequelize.fn('LENGTH', sequelize.col('variety_code')), 'DESC'],
      ['variety_code', 'DESC'],]

      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
      };

      let validation = new Validator(req.body, rules);

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
          crop_name: req.body.search.crop_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [['crop_name', 'Asc']];

      const queryData = await cropModel.findAll(condition);

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
          [Op.and]: [
            {
              group_code: {
                // [Op.like]: "%" + req.body.search.group_code + "%",
                [Op.eq]: req.body.search.group_code,
              },
            },
            {
              crop_code: {
                [Op.not]: null
              }
            },
            {
              crop_code: {
                [Op.not]: ''
              }
            }
          ]
          // is_active: 1
        },
        raw: false,
        // limit: 1
      };

      condition.order = [['id', 'DESC']];

      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
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
          crop_name: req.body.search.crop_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsVarietyName = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_name': 'string',
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
          variety_name: req.body.search.variety_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getCropVarietyCharacteristics = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      if (req.body.id) {
        condition = {
          // include: [
          //   {
          //     model:designationModel,
          //     left: true,
          //     attributes: ['name']
          //   },
          //   {
          //     model:userModel,
          //     left: true,
          //     attributes: [],
          //     where:{
          //       user_type:'agency'
          //     }
          //   },
          // ],
          where: {
            id: req.body.id,
          }
        };
      } else {
        condition = {
          // include: [
          //   {
          //     model:designationModel,
          //     left: true,
          //     attributes: ['name']
          //   },
          //   {
          //     model:userModel,
          //     left: true,
          //     attributes: [],
          //     where:{
          //       user_type:'agency'
          //     }
          //   },
          // ],
          where: {

          }
        };
      }


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
      if (req.body.search) {
        if (req.body.search.crop_group_id) {
          condition.where.crop_group_id = (req.body.search.crop_group_id);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
      }

      data = await cropCharactersticsModel.findAndCountAll(condition);
      let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addCropVarietyCharacteristics = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      let rules = {
        // 'crop_group_id': 'string',
        // 'crop_code': 'string',
        // 'variety_id': 'string',
        // 'iet_number': 'string',
        // 'resemblance_to_variety': 'string',
        // 'parentage': 'string',
        // 'maturity_from': 'string',
        // 'maturity_to': 'string',
        // 'maturity_date': 'string',
        // 'spacing_from': 'string',
        // 'spacing_to': 'string',
        // 'spacing_date': 'string',
        // 'generic_morphological_characteristics': 'string',
        // 'specific_morphological_characteristics': 'string',
        // 'seed_rate': 'string',
        // 'average_from': 'string',
        // 'average_to': 'string',
        // 'average_total': 'string',
        // 'fertilizer_dosage': 'string',
        // 'agronomic_features': 'string',
        // 'recommended_ecology': 'string',
        // 'abiotic_stress': 'string',
        // 'major_diseases': 'string',
        // 'major_pest': 'string',
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
      const data = agencyDetailModel.build({
        crop_group_id: req.body.crop_group_id,
        crop_code: req.body.crop_code,
        variety_id: req.body.variety_id,
        iet_number: req.body.iet_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        parentage: req.body.parentage,
        maturity_from: req.body.maturity_from,
        maturity_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphological_characteristics,
        specific_morphological_characteristics: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_from,
        average_yeild_to: req.body.average_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        abiotic_stress: req.body.abiotic_stress,
        major_diseases: req.body.major_diseases,
        major_pest: req.body.major_pest,
      });


      const insertData = await data.save();


      const userData = userModel.build({
        agency_id: insertData.id,
        username: req.body.display_name,
        name: req.body.display_name,
        email_id: req.body.email,
        password: '123456',
        mobile_number: req.body.mobile_number,
        // designation_id: req.body.contact_person_designation,
        user_type: 'BR',
      });
      await userData.save();

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
      return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getBreederWithId = async (req, res) => {
    try {
      const data = await agencyDetailModel.findAll({
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

  static test = async (req, res) => {
    try {
      response(res, "Api Working fine", 200, "Success")
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static addCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
        'crop_code': 'string'
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

      let data = {
        crop: req.body.crop,
        is_active: 1,
        user_id: req.body.user_id,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
        max_lot_size: req.body.max_lot_size,
        group_code: req.body.group_code,
        group_name: req.body.group_name,
        crop_code: req.body.crop_code
      }
      const maxLotSizeData = maxLotSizeModel.create(data);
      returnResponse = {};
      return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)

    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static updateCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
        'crop_code': 'string',
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

      let data = {
        crop: req.body.crop,
        updated_by: req.body.updated_by,
        max_lot_size: req.body.max_lot_size,
        group_code: req.body.group_code,
        group_name: req.body.group_name,
        crop_code: req.body.crop_code,
        is_active: req.body.active,
      }
      const maxLotSizeData = maxLotSizeModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)

    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'crop': 'string',
        'max_lot_size': 'string',
        'search.crop_name': 'string',
        'search.group_code': 'string'

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
            model: cropModel,
            include: [
              {
                model: cropGroupModel,
                required: true,

              },
            ],
            // where: {
            //   is_active: 1

            // }
          }

        ],
        where: {
          // is_active:1
        }
      };

      // const userId = req.body.loginedUserid.id
      // if (userId) {
      //   condition.where.user_id = userId
      // }

      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = req.body.search.crop_name;
        }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = req.body.search.group_code;
          // condition.include[0].where.is_active = 1;
        }
      }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // condition.order = [['group_name', 'ASC'], ['crop', 'ASC']];
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC']]
      const data = await maxLotSizeModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropMaxLotSizeDataByCropCode = async (req, res) => {
    try {

      const data = await maxLotSizeModel.findAll({
        where: {
          crop_code: req.params.id
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
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static deleteCropMaxLotSizeData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      maxLotSizeModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static updateStatusCropMaxLotSizeData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      maxLotSizeModel.update(data, {
        where: {
          id: req.body.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  //lab TEST api
  static addLabTestData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let tabledAlteredSuccessfully = false;
    try {
      let rules = {
        'lab_name': 'string',
        // 'max_lot_size': 'string'
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

      let data = {
        user_id: req.body.user_id,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
        lab_name: req.body.lab_name,
        address: req.body.address,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.short_name,
        mobile_number: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_number: req.body.fax_number,
        email: req.body.email,
        latitude: req.body.lattiude,
        longitude: req.body.longitude,
        contact_person_name: req.body.contact_person_name,
        designation_id: req.body.contact_person_designation,
        is_active: 1,
      };
      console.log('req.body.contact_person_designation', req.body.contact_person_designation)

      const existingData = await seedLabTestModel.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('short_name')),
              sequelize.fn('lower', req.body.short_name),
            ),

          ]
        }
      });
      const LabData = await seedLabTestModel.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('lab_name')),
              sequelize.fn('lower', req.body.lab_name),
            )
          ]
        }
      })
      if (LabData.length != 0) {
        returnResponse = {
          error: 'Laboratory name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 402, returnResponse)
      }
      let existingEmaiData = await seedLabTestModel.findAll({
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


      if (existingData === undefined || existingData.length < 1) {
        const maxLotSizeData = seedLabTestModel.create(data);
        returnResponse = maxLotSizeData;
        tabledAlteredSuccessfully = true;
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }

    } catch (error) {
      console.log('error =====', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static updateLabTestData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        // 'crop': 'string',
        // 'max_lot_size': 'string'
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

      let data = {
        updated_by: req.body.user_id,
        lab_name: req.body.lab_name,
        address: req.body.address,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.short_name,
        mobile_number: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_number: req.body.fax_number,
        email: req.body.email,
        latitude: req.body.lattiude,
        longitude: req.body.longitude,
        designation_id: req.body.contact_person_designation,
        contact_person_name: req.body.contact_person_name,
        is_active: req.body.active
      };
      console.log('data', data.address)
      let existingEmaiData = await seedLabTestModel.findAll({
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

      const LabData = await seedLabTestModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('lab_name')),
                sequelize.fn('lower', req.body.lab_name),
              ),
              id: { [Op.ne]: req.body.id }
            }
          ]

        }
      })
      if (LabData.length != 0) {
        returnResponse = {
          error: 'Laboratory name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      const existingData = await seedLabTestModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.short_name),
              ),
              id: { [Op.ne]: req.body.id }
            }
          ]
        }

      });
      if (existingData.length != 0) {
        returnResponse = {
          error: 'Short name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 402, returnResponse)
      }

      const maxLotSizeData = seedLabTestModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)

    } catch (error) {
      console.log('er', error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLabTestDataforSeedTesting = async (req, res) => {
    try {
      const condition = {
        attributes: ['lab_name', 'id'],
        raw: true,
        where: {
          state_id: req.body.loginedUserid.state_id
        }
      }
      console.log(req.body.loginedUserid.state_id, 'req.body.loginedUserid')

      condition.order = [['lab_name', 'ASC']];

      const data = await seedLabTestModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error.message)
      return response(res, status.UNEXPECTED_ERROR, 500, error.message);
    }
  }

  static getLabTestData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'state_id': 'string',
        'district_id': 'string',
        'lab_name': 'string'
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

      //check & get state id 
      let userId = req.body.loginedUserid.id;
      const condition1 = {
        attributes: ['state_id'],
        where: {
          user_id: userId
        },
        raw: true
      }
      const stateData = await agencyDetailModel.findAll(condition1);
      let condition = {
        include: [
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
          {
            model: designationModel,
            left: false,
            raw: false

          },

        ],
        where: {
          // is_active:1
        }
      };
      // const userId = req.body.loginedUserid.id
      // console.log('audhdata===========', userId);
      // if (userId) {
      //   condition.where.user_id = userId
      // }

      if (req.body.search) {
        if (req.body.search.type == 'bsp-lab-report') {
          if (stateData && stateData[0]) {
            if (stateData[0].state_id) {
              condition.where.state_id = stateData[0].state_id;
            }
          }
        }
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.lab_name) {
          condition.where.lab_name = req.body.search.lab_name;
        }
        // if (req.body.search.state) {
        //   condition.where.state_id = req.body.search.state_id;
        // }
      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['lab_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      const data = await seedLabTestModel.findAndCountAll(condition);
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

  static getLabTestNameData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {

        'state_id': 'string',
        'district_id': 'string',

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
        attributes: ['lab_name'],
        where: {}
      };
      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['lab_name', 'ASC']];
      const data = await seedLabTestModel.findAndCountAll(condition);
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
  static deleteLabTestData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      seedLabTestModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  //update status on delete data
  static updateStatusLabTestData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      seedLabTestModel.update(data, {
        where: {
          id: req.body.id
        },
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static addCropCharacteristics = async (req, res) => {
    let tabledAlteredSuccessfully = false;
    try {
      let condition = {
        where: {}
      };
      const user_id = req.body.loginedUserid.id
      let fertilizerOtherData;
      req.body.notification_date
      const dataRow = {
        crop_group_id: req.body.crop_group_id,
        // crop_code: req.body.crop_code,
        variety_id: req.body.variety_id,
        image_url: req.body.data,
        variety_code: req.body.variety_code,
        notification_date: req.body.notification_date,
        notification_year:req.body.notification_year,
        meeting_number: req.body.meeting_number,
        variety_name: req.body.variety_name,
        iet_number: req.body.iet_number,
        year_of_introduction_market: req.body.year_of_introduction_market,
        notification_number: req.body.notification_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        percentage: req.body.percentage,
        select_state_release: req.body.select_state_release,
        state_of_release: req.body.recommended_state ? req.body.recommended_state : null,
        matuarity_day_from: req.body.maturity_from,
        matuarity_day_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        climate_resilience_json:req.body.climate_resilience,
        matuarity_type_id: req.body.matuarity_type_id,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphological,
        specific_morphological: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_yeild_from,
        average_yeild_to: req.body.average_yeild_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        responsible_insitution_for_breeder_seed: req.body.responsible_insitution_for_breeder_seed,
        reaction_abiotic_stress: req.body.abiotic_stress,
        // reaction_major_diseases: req.body.major_diseases,
        // reaction_to_pets: req.body.major_pest,
        reaction_to_pets_json:req.body.major_pest,
        reaction_major_diseases_json:req.body.major_diseases,
        crop_code: req.body.crop_code,
        year_of_release: req.body.year_release,
        user_id: user_id,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        nitrogen: req.body.nitrogen,
        phosphorus: req.body.phosphorus,
        potash: req.body.potash,
        other: req.body.other,
        state_data: req.body.state,
        region_data: req.body.region_data,
        // climate_resilience: req.body.climate_resilience,
        product_quality_attributes: req.body.product_quality_attributes,
        gi_tagged_reg_no: req.body.gi_tagged_reg_no,
        ip_protected_reg_no: req.body.ip_protected_reg_no,
      };


      // if (req.body.search) {
      //   // if (req.body.search.crop_group_id) {
      //   //   condition.where.crop_group_id = req.body.search.crop_group_id;
      //   // }
      //   if (req.body.search.variety_id) {
      //     condition.where.variety_id = req.body.search.variety_id;
      //   }
      //   // if (req.body.search.crop_code) {
      //   //   condition.where.crop_code = req.body.search.crop_code;
      //   // }
      // }
      const cropNameexisitingData = await cropCharactersticsModel.findAll({
        where: {
          [Op.or]: [{ variety_id: req.body.variety_id }],
          // is_active: 1
        }
      });




      if ((cropNameexisitingData && cropNameexisitingData.length)) {
        const errorResponse = {
          subscriber_id: 'Variety Name  is already exits.'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }

      // const existingData = await cropCharactersticsModel.findAll(condition);
      // === undefined || existingData.length < 1
      if (cropNameexisitingData && !cropNameexisitingData.length) {
        const data = await cropCharactersticsModel.create(dataRow);
        let diseasesData;
        let pestsData;
        let climateResilence;
        let regionMapping;
        if(data){
          
          if(req.body.climate_resilience && req.body.climate_resilience.length){
            for(let key of req.body.climate_resilience){
              climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                m_variety_characterstic_id:data.dataValues.id,
                climate_resilience_id:key.id
              })
            }
          }
          if(req.body.regions && req.body.regions.length){
            for(let key of req.body.regions){
              if(key.regions_checkbox && key.regions_checkbox==true){
                regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                  variety_code: req.body.variety_code,
                  variety_id: req.body.variety_id,
                  region_id:key.regions_id,
                  is_checked:key.regions_checkbox ? key.regions_checkbox:false
                })
              }
            }
          }
          if(req.body.major_pest && req.body.major_pest.length){
            for(let key of req.body.major_pest){
              pestsData = await db.mMajorInsectPestsMapModel.create({
                m_variety_characterstic_id:data.dataValues.id,
                insect_pests_id:key.id
              })
            }
          }
          if(req.body.major_pest && req.body.major_diseases.length){
            for(let key of req.body.major_diseases){
              diseasesData = await db.mMajorDiseasesMapModel.create({
                m_variety_characterstic_id:data.dataValues.id,
                diseases_id:key.id
              })
            }
          }
        }
        await data.save();
        tabledAlteredSuccessfully = true;
        if (req.body !== undefined
          && req.body.fertilizerother !== undefined
          && req.body.fertilizerother.length > 0) {

          for (let index = 0; index < req.body.fertilizerother.length; index++) {

            const element = req.body.fertilizerother[index];
            let otherFertilizer = {
              other_fertilizer_name: element.fertilizer_other_name,
              other_fertilizer_value: element.fertilizer_other_value,
              characterstics_id: data.id
            }
            fertilizerOtherData = await otherFertilizerModel.create(otherFertilizer)
            await fertilizerOtherData.save()
            let mappingOtherFertilizerData = {
              other_fertilizer_id: fertilizerOtherData.id,
              characterstics_id: data.id
            }
            let otherMappingData = await otherFertilizerMapping.create(mappingOtherFertilizerData)
            await otherMappingData.save()

            tabledAlteredSuccessfully = true;

            // console.log('otherFertilizer',otherFertilizer)
          }
        }
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

      // console.log('data====>', data.state_data);

      // const insertData = await data.save();
      // console.log(data);

      // if (insertData) {
      //   return response(res, status.DATA_SAVE, 200, {})
      // } else {
      //   return response(res, status.DATA_NOT_AVAILABLE, 404)
      // }
    }
    catch (error) {
      console.log(error, 'dataRow');
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static updateAddBreederCharacterstics = async (req, res) => {
    let tabledAlteredSuccessfully = false;
    try {
      const id = req.body.id;
      let condition = {
        where: {
          id: {
            [Op.ne]: id
          }
        }
      };
      let dataRow;
      dataRow = {
        crop_group_id: req.body.crop_group_id,
        variety_code: req.body.variety_code,

        variety_id: req.body.varierty_id,
        image_url: req.body.image_url,
        variety_code: req.body.variety_code,
        // notification_date: req.body.notification_date,
        // notification_year:req.body.notification_year,
        // meeting_number: req.body.meeting_number,
        iet_number: req.body.iet_number,
        year_of_introduction_market: req.body.year_of_introduction_market,
        notification_number: req.body.notification_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        percentage: req.body.percentage,
        select_state_release: req.body.select_state_release,
        // state_of_release: req.body.recommended_state,
        matuarity_day_from: req.body.maturity_from,
        matuarity_day_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        matuarity_type_id: req.body.matuarity_type_id,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphologimajor_pestcal,
        specific_morphological: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_yeild_from,
        average_yeild_to: req.body.average_yeild_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        responsible_insitution_for_breeder_seed: req.body.responsible_insitution_for_breeder_seed,
        reaction_abiotic_stress: req.body.abiotic_stress,
        climate_resilience_json:req.body.climate_resilience,
        // reaction_major_diseases: req.body.major_diseases,
        // reaction_to_pets: req.body.major_pest,
        reaction_to_pets_json:req.body.major_pest,
        reaction_major_diseases_json:req.body.major_diseases,
        crop_code: req.body.crop_code,
        year_of_release: req.body.year_release,
        user_id: 1,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        nitrogen: req.body.nitrogen,
        phosphorus: req.body.phosphorus,
        potash: req.body.potash,
        other: req.body.other,
        // fertilizer_other_name: req.body.fertilizer_other_name,
        // fertilizer_other_value: req.body.fertilizer_other_value,
        state_data: req.body.state,
        variety_name: req.body.variety_name,
        is_active: req.body.active,
        region_data: req.body.region_data,
        // climate_resilience: ,
        climate_resilience_json:req.body.climate_resilience,
        product_quality_attributes: req.body.product_quality_attributes,
        gi_tagged_reg_no: req.body.gi_tagged_reg_no,
        ip_protected_reg_no: req.body.ip_protected_reg_no,
      }
      // db.mMajorInsectPestsMapModel
      // db.mMajorDiseasesMapModel 
      if (req.body !== undefined
        && req.body.fertilizerother !== undefined
        && req.body.fertilizerother.length > 0) {
        otherFertilizerModel.destroy({
          where: {
            characterstics_id: req.body.id
          }
        })
        for (let index = 0; index < req.body.fertilizerother.length; index++) {

          const element = req.body.fertilizerother[index];
          let otherFertilizer = {
            other_fertilizer_name: element.fertilizer_other_name,
            other_fertilizer_value: element.fertilizer_other_value,
            characterstics_id: req.body.id
          }
          let fertilizerOtherData = await otherFertilizerModel.create(otherFertilizer)
          let diseasesData;
          let pestsData;
          if(fertilizerOtherData){
            if(req.body.major_pest && req.body.major_pest.length){
              for(let key of req.body.major_pest){
                pestsData = await db.mMajorInsectPestsMapModel.create({
                  m_variety_characterstic_id:fertilizerOtherData.dataValues.id,
                  insect_pests_id:key.id
                })
              }
            }
            if(req.body.major_pest && req.body.major_diseases.length){
              for(let key of req.body.major_diseases){
                diseasesData = await db.mMajorDiseasesMapModel.create({
                  m_variety_characterstic_id:fertilizerOtherData.dataValues.id,
                  diseases_id:key.id
                })
              }
            }
          }
          await fertilizerOtherData.save()
          // let mappingOtherFertilizerData={
          //   other_fertilizer_id:fertilizerOtherData.id,
          //   characterstics_id:data.id
          // }
          // let otherMappingData = await otherFertilizerMapping.create(mappingOtherFertilizerData)
          // await otherMappingData.save()

          tabledAlteredSuccessfully = true;

          // console.log('otherFertilizer',otherFertilizer)
        }
      }
      // console.log('dataRow', dataRow)

      // const existingData = await cropCharactersticsModel.findAll({
      //   where: {
      //     [Op.and]: [
      //       {
      //         where: sequelize.where(
      //           sequelize.fn('lower', sequelize.col('variety_id')),
      //           sequelize.fn('lower', (req.body.varierty_id)),
      //         ),
      //         id: { [Op.ne]: id }
      //       },


      //     ]
      //   },
      // }

      // );

      // if (existingData.length != 0) {

      //   const returnResponse = {
      //     error: 'Varitey Name is Already exist'
      //   }

      //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      // }



      let isExist = await cropCharactersticsModel.findOne({where:{variety_code:req.body.variety_code}});
      let  data;
      if(isExist){
         data = await cropCharactersticsModel.update(dataRow, {
          where: {
            id: isExist.id
          }
        });
        if(isExist){
          // if(fertilizerOtherData){
            let isExitDelete = await db.mMajorInsectPestsMapModel.destroy({where:{
              m_variety_characterstic_id:isExist.id
            }});
            let isExitDelete1 = await db.mMajorDiseasesMapModel.destroy({where:{
              m_variety_characterstic_id:isExist.id
            }})
            let isExitDelete3 = await db.mMajorClimateResiliencemapsModel.destroy({where:{
              m_variety_characterstic_id:isExist.id
            }})
            let isExitDelete4 = await db.mCharactersticAgroRegionMappingModel.destroy({where:{
              variety_id:req.body.varierty_id,
              variety_code:req.body.variety_code
            }})
            let pestsData;
            let pestsData1;
            let climateResilence;
            let regionMapping;
            if(isExitDelete || isExitDelete1){
              if(req.body.major_pest && req.body.major_pest.length){
                for(let key of req.body.major_pest){
                  pestsData = await db.mMajorInsectPestsMapModel.create({
                    m_variety_characterstic_id:isExist.id,
                    insect_pests_id:key.id
                  })
                }
              }
              if(req.body.major_pest && req.body.major_diseases.length){
                for(let key of req.body.major_diseases){
                  pestsData1 = await db.mMajorDiseasesMapModel.create({
                    m_variety_characterstic_id:isExist.id,
                    diseases_id:key.id
                  })
                }
              }
            }
            if(isExitDelete3){
              if(req.body.climate_resilience && req.body.climate_resilience.length){
                for(let key of req.body.climate_resilience){
                  climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                    m_variety_characterstic_id:isExist.id,
                    climate_resilience_id:key.id
                  })
                }
              }
            }
            // if(isExitDelete4){
              if(req.body.regions && req.body.regions.length){
                for(let key of req.body.regions){
                  if(key.regions_checkbox && key.regions_checkbox==true){
                    regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                      variety_code: req.body.variety_code,
                      variety_id: req.body.varierty_id,
                      region_id:key.regions_id,
                      is_checked:key.regions_checkbox ? key.regions_checkbox:false
                    })
                  }
                }
              }
            // }
          
          // }
        }
      }else{
        data = await cropCharactersticsModel.create(dataRow);
        if(data){
          // if(fertilizerOtherData){
            // let isExitDelete = await db.mMajorInsectPestsMapModel.destroy({where:{
            //   m_variety_characterstic_id:data.dataValues.id
            // }});
            // let isExitDelete1 = await db.mMajorDiseasesMapModel.destroy({where:{
            //   m_variety_characterstic_id:data.dataValues.id
            // }})
            // let isExitDelete3 = await db.mMajorClimateResiliencemapsModel.destroy({where:{
            //   m_variety_characterstic_id:data.dataValues.id
            // }})
            // let isExitDelete4 = await db.mCharactersticAgroRegionMappingModel.destroy({where:{
            //   variety_id:req.body.varierty_id,
            //   variety_code:req.body.variety_code
            // }})
            let pestsData;
            let pestsData1;
            let climateResilence;
            let regionMapping;
            // if(isExitDelete || isExitDelete1){
              if(req.body.major_pest && req.body.major_pest.length){
                for(let key of req.body.major_pest){
                  pestsData = await db.mMajorInsectPestsMapModel.create({
                    m_variety_characterstic_id:data.dataValues.id,
                    insect_pests_id:key.id
                  })
                }
              }
              if(req.body.major_pest && req.body.major_diseases.length){
                for(let key of req.body.major_diseases){
                  pestsData1 = await db.mMajorDiseasesMapModel.create({
                    m_variety_characterstic_id:data.dataValues.id,
                    diseases_id:key.id
                  })
                }
              }
            // }
            // if(isExitDelete3){
              if(req.body.climate_resilience && req.body.climate_resilience.length){
                for(let key of req.body.climate_resilience){
                  climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                    m_variety_characterstic_id:data.dataValues.id,
                    climate_resilience_id:key.id
                  })
                }
              }
            // }
            // if(isExitDelete4){
              if(req.body.regions && req.body.regions.length){
                for(let key of req.body.regions){
                  if(key.regions_checkbox && key.regions_checkbox==true){
                    regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                      variety_code: req.body.variety_code,
                      variety_id: req.body.varierty_id,
                      region_id:key.regions_id,
                      is_checked:key.regions_checkbox ? key.regions_checkbox:false
                    })
                  }
                }
              }
            // }
          
          // }
        }
      }
    
   
      tabledAlteredSuccessfully = true;

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }


      // if (data) {
      //   response(res, status.DATA_UPDATED, 200, data)
      // }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static deleteCropCharactersticsDetails = async (req, res) => {
    try {
      cropCharactersticsModel.destroy({
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

  static addCropCharacteristicsList = async (req, res) => {
    let data = {};
    try {
      // let userId = req.body.loginedUserid.id
      // console.log('userId', userId);
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            include: [{
              model: cropGroupModel
            }],
            left: true,
            // where: { is_active: 1 }
          },

          {
            model: cropCharactersticsModel,
            // where: { is_active: 1 },
            left: true
          },


        ],
        where: {
        }
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10; // set pageSize to -1 to prevent sizing
        }

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];


      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], ['variety_name', 'ASC']];
      // condition.where.user_id = userId;
      if (search) {
        condition.where = {};
        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);
          // condition.include[0].where.is_active = 1;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        // if (req.body.search.user_id) {
        //   condition.where.user_id = req.body.search.user_id;
        // }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };
          }

          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }

        }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
        if (req.body.search.notification_date) {
          condition.where.notification_year = (parseInt(req.body.search.notification_date));
        }
        if (req.body.search.variety_name_filter) {
          condition.where.variety_name = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.variety_name_filter.toLowerCase().trim() + "%" },
              //     { [Op.like]: req.body.search.variety_name_filter.toUpperCase().trim()+"%" },
            ]
          };
        }
        if (req.body.search.notification_no) {
          condition.where.not_number = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.notification_no.toLowerCase().trim() + "%" },
            ]
          };
        }
      }

	condition.where.status = { [Op.notIn]: ['other'] }
      condition.where.status = {
        [Op.or]: [
          {
            [Op.in]: ['hybrid', 'variety']

          },

          {
            [Op.eq]: null

          },

        ]
      };

      // console.log('user_id',req.body.loginedUserid.id);


      // if (req.body.search) {
      //   if (req.body.search.group_code) {

      //     condition.include[0].where.group_code = (req.body.search.group_code);
      //   }
      //   if (req.body.search.crop_name) {
      //     condition.where.crop_code = (req.body.search.crop_name);
      //   }
      //   if (req.body.search.variety_name) {
      //     condition.where.variety_code = (req.body.search.variety_name);
      //   }
      // }
      // condition
      data = await cropVerietyModel.findAndCountAll(condition);
      // console.log(data);



      //  datas = resa.sort((a, b) => {
      //   if (a.m_crop.crop_group < b.m_crop.crop_group ) {
      //     if( a.m_crop.crop_name < b.m_crop.crop_name){

      //       return -1;
      //     }
      //   }
      // });
      // datasValue = datas.sort((a, b) => {
      //   if (e) {
      //     return -1;
      //   }
      // });

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addCropCharacteristicsListWithDynamicField = async (req, res) => {
    let data = {};
    try {
      // let userId = req.body.loginedUserid.id
      // console.log('userId', userId);
      let attributesData = [];
      let temp = [];
      if (req.body.search) {
        if (req.body.search.fieldData !== undefined && req.body.search.fieldData.length >= 1) {
          req.body.search.fieldData.forEach(async (items) => {

            if (items && items.value == "crop_group") {
              temp = [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'];
            }
            else if (items && items.value == "variety_name") {
              temp = [sequelize.col('m_crop_variety.variety_name'), 'variety_name'];
            }
            else if (items && items.value == "crop_name") {
              temp = [sequelize.col('m_crop.crop_name'), 'crop_name'];
            }
            else if (items && items.value == "variety_code") {
              temp = [sequelize.col('m_crop_variety.variety_code'), 'variety_code']
            }
            else if (items && items.value == "developed_by") {
              temp = [sequelize.col('m_variety_characteristics.developed_by'), 'developed_by']
            }
            else if (items && items.value == "matuarity_day_from") {
              temp = [sequelize.col('m_variety_characteristics.matuarity_day_from'), 'matuarity_day_from']
            }
            else if (items && items.value == "matuarity_day_to") {
              temp = [sequelize.col('m_variety_characteristics.matuarity_day_to'), 'matuarity_day_to']
            }
            else if (items && items.value == "spacing_from") {
              temp = [sequelize.col('m_variety_characteristics.spacing_from'), 'spacing_from']
            }
            else if (items && items.value == "spacing_to") {
              temp = [sequelize.col('m_variety_characteristics.spacing_to'), 'spacing_to']
            } else if (items && items.value == "generic_morphological") {
              temp = [sequelize.col('m_variety_characteristics.generic_morphological'), 'generic_morphological']
            } else if (items && items.value == "seed_rate") {
              temp = [sequelize.col('m_variety_characteristics.seed_rate'), 'seed_rate']
            } else if (items && items.value == "average_yeild_from") {
              temp = [sequelize.col('m_variety_characteristics.average_yeild_from'), 'average_yeild_from']
            } else if (items && items.value == "average_yeild_to") {
              temp = [sequelize.col('m_variety_characteristics.average_yeild_to'), 'average_yeild_to']
            } else if (items && items.value == "fertilizer_dosage") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_dosage'), 'fertilizer_dosage']
            } else if (items && items.value == "agronomic_features") {
              temp = [sequelize.col('m_variety_characteristics.agronomic_features'), 'agronomic_features']
            } else if (items && items.value == "adoptation") {
              temp = [sequelize.col('m_variety_characteristics.adoptation'), 'adoptation']
            } else if (items && items.value == "reaction_abiotic_stress") {
              temp = [sequelize.col('m_variety_characteristics.reaction_abiotic_stress'), 'reaction_abiotic_stress']
            } else if (items && items.value == "reaction_major_diseases") {
              temp = [sequelize.col('m_variety_characteristics.reaction_major_diseases'), 'reaction_major_diseases']
            } else if (items && items.value == "reaction_to_pets") {
              temp = [sequelize.col('m_variety_characteristics.reaction_to_pets'), 'reaction_to_pets']
            } else if (items && items.value == "specific_morphological") {
              temp = [sequelize.col('m_variety_characteristics.specific_morphological'), 'specific_morphological']
            } else if (items && items.value == "notification_date") {
              temp = [sequelize.col('m_variety_characteristics.notification_date'), 'notification_date']
            } else if (items && items.value == "year_of_introduction_market") {
              temp = [sequelize.col('m_variety_characteristics.year_of_introduction_market'), 'year_of_introduction_market']
            } else if (items && items.value == "notification_number") {
              temp = [sequelize.col('m_variety_characteristics.notification_number'), 'notification_number']
            } else if (items && items.value == "meeting_number") {
              temp = [sequelize.col('m_variety_characteristics.meeting_number'), 'meeting_number']
            } else if (items && items.value == "year_of_release") {
              temp = [sequelize.col('m_variety_characteristics.year_of_release'), 'year_of_release']
            } else if (items && items.value == "nitrogen") {
              temp = [sequelize.col('m_variety_characteristics.nitrogen'), 'nitrogen']
            } else if (items && items.value == "phosphorus") {
              temp = [sequelize.col('m_variety_characteristics.phosphorus'), 'phosphorus']
            } else if (items && items.value == "potash") {
              temp = [sequelize.col('m_variety_characteristics.potash'), 'potash']
            } else if (items && items.value == "other") {
              temp = [sequelize.col('m_variety_characteristics.other'), 'other']
            } else if (items && items.value == "fertilizer_other_name") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_other_name'), 'fertilizer_other_name']
            } else if (items && items.value == "fertilizer_other_value") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_other_value'), 'fertilizer_other_value']
            } else if (items && items.value == "maturity") {
              temp = [sequelize.col('m_variety_characteristics.maturity'), 'maturity']
            } else if (items && items.value == "type") {
              temp = [sequelize.col('m_variety_characteristics.type'), 'type']
            } else if (items && items.value == "ecology") {
              temp = [sequelize.col('m_variety_characteristics.eology'), 'eology']
            }
            else if (items && items.value == "resemblance_to_variety") {
              temp = [sequelize.col('m_variety_characteristics.resemblance_to_variety'), 'resemblance_to_variety']
            }
            else if (items && items.value == "recommended_state_for_cultivation") {
              temp = [sequelize.col('m_variety_characteristics.state_data'), 'state_data']
            }
            else if (items && items.value == "responsible_insitution_developing_seed") {
              temp = [sequelize.col('m_variety_characteristics.responsible_insitution_for_breeder_seed'), 'responsible_insitution_for_breeder_seed']
            }


            else {
              temp = ['id'];
            }
            attributesData.push(temp);

          });
          attributesData.push([sequelize.col('m_variety_characteristics.is_active'), 'is_active'])
        }
      }
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [{
              model: cropGroupModel,
              attributes: [],
            }],
            left: true,
            // where: { is_active: 1 }
          },
          {
            model: cropVerietyModel,
            // where: { is_active: 1 },
            attributes: [],
            left: true
          }

        ],
        attributes: attributesData,
        raw: true,
        where: {
        }
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10; // set pageSize to -1 to prevent sizing
        }

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];


      condition.order = [[sequelize.col('m_crop.crop_group'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      // condition.where.user_id = userId;
      if (search) {
        condition.where = {};
        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);

          // condition.include[0].where.is_active = 1;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }


        // if (req.body.search.user_id) {
        //   condition.where.user_id = req.body.search.user_id;
        // }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.notification_date = {
              [Op.or]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };
          }

          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.notification_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }

        }
      }

      // console.log('user_id',req.body.loginedUserid.id);


      // if (req.body.search) {
      //   if (req.body.search.group_code) {

      //     condition.include[0].where.group_code = (req.body.search.group_code);
      //   }
      //   if (req.body.search.crop_name) {
      //     condition.where.crop_code = (req.body.search.crop_name);
      //   }
      //   if (req.body.search.variety_name) {
      //     condition.where.variety_code = (req.body.search.variety_name);
      //   }
      // }
      // condition
      data = await cropCharactersticsModel.findAndCountAll(condition);
      // console.log(data);



      //  datas = resa.sort((a, b) => {
      //   if (a.m_crop.crop_group < b.m_crop.crop_group ) {
      //     if( a.m_crop.crop_name < b.m_crop.crop_name){

      //       return -1;
      //     }
      //   }
      // });
      // datasValue = datas.sort((a, b) => {
      //   if (e) {
      //     return -1;
      //   }
      // });

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  //Add/update seed multiplication ratio
  static addSeedMultiplicationRatioData = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const dataRow = {
            crop_name: element.crop_name,
            user_id: element.user_id,
            created_by: element.user_id,
            updated_by: element.user_id,
            crop_code: element.crop_code,
            croup_group_code: element.group_code.group_code,
            crop_group_code: element.group_code.group_code,
            nucleus_to_breeder: (element.nucleus_breader),
            breeder_to_foundation: element.breader_to_foundation_1,
            foundation_1_to_2: element.foundation_1_to_foundation_2,
            foundation_2_to_cert: element.foundation_2_to_certified,
            status: 'Active',
            is_active: 1,
            created_at: Date.now(),
            updated_at: Date.now(),
          };
          console.log('data============row', dataRow);
          if (element.id > 0) {
            await seedMultiplicationRatioModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {
            });
          } else {
            const existingData = await seedMultiplicationRatioModel.findAll({
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_group_code')),
                sequelize.fn('lower', element.group_code.group_code),
              )
            });
            if (1) {
              const newData = await seedMultiplicationRatioModel.build(dataRow);
              await newData.save();
              tabledAlteredSuccessfully = true;
            }
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      } else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }
      }
    } catch (error) {
      // console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static updateSeedMultiplicationRatioData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
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
      console.log('active', req.body.active);
      let data = {
        crop_name: req.body.crop_name,
        crop_code: req.body.crop_code,
        croup_group_code: req.body.group_code,
        crop_group_code: req.body.group_code,
        nucleus_to_breeder: (req.body.nucleus_breader),
        breeder_to_foundation: req.body.breader_to_foundation_1,
        foundation_1_to_2: req.body.foundation_1_to_foundation_2,
        foundation_2_to_cert: req.body.foundation_2_to_certified,
        status: 'Active',
        is_active: req.body.active,
        updated_by: req.body.user_id,
        created_at: Date.now(),
        updated_at: Date.now(),
        active: req.body.is_active
      }
      const seedMultiplicationData = seedMultiplicationRatioModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  // Get seed multiplication ratio
  static getSeedMultiplicationRatioData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'group_code': 'string',
        'crop_name': 'string',
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
        include: [{
          model: cropModel,
          // where: {
          //   group_code : (req.body.search.group_code)
          //   // is_active:1
          // }
        },


        ],
        left: true,
        raw: false
      };
      if (req.body.search) {
        condition.where = {};
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where = req.body.search.group_code
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['crop_name', 'ASC']];
      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static deleteSeedMultiplicationRatioData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      seedMultiplicationRatioModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  //update status on delete data
  static updateStatusSeedMultiplicationRatioData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      seedMultiplicationRatioModel.update(data, {
        where: {
          id: req.body.id
        },
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getseedMultRatioSeedCropData = async (req, res) => {
    try {
      let condition = {
      }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];
      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["group_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      }
      let data = await cropModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }

  }


  static getAgencyDetailsName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
            }
          },
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'agency_name'],
          'id'
        ],
        where: {

        }
      }

      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.where.district_id = req.body.search.district_id;
        }
      }
      condition.order = [['agency_name', 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('error================', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }



  static getBankNameDetails = async (req, res) => {
    try {
      let condition = {
        where: {
          // branch_name:'ALLAHABAD UP GRAMIN BANK BELATAD'
        },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('bank_name')), 'bank_name']],
      }

      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.dbt_state_code = req.body.search.state_code.toString();
        }
      }


      condition.order = [['bank_name', 'asc']];
      let data = await bankDetailsModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('error======', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBankBranchNameDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              branch_name: {
                [Op.ne]: null
              }

            },
            {
              branch_name: {
                [Op.ne]: ""
              }

            },
            {
              branch_name: {
                [Op.ne]: "#ERROR!"
              }

            },
            {
              branch_name: {
                [Op.ne]: "#NAME?"
              }

            }

          ]
        },

        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };
      condition.order = [['branch_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.bank_name) {
          condition.where.bank_name = (req.body.search.bank_name);
        }
        if (req.body.search.branch_name) {
          condition.where.branch_name = (req.body.search.branch_name);
        }
        if (req.body.search.state_code) {
          condition.where.dbt_state_code = req.body.search.state_code.toString();
        }
      }
      data = await bankDetailsModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIfscCodeDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

        },
        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };

      if (req.body.search) {
        if (req.body.search.bank_name) {
          condition.where.bank_name = (req.body.search.bank_name);
        }
        if (req.body.search.branch_name) {
          condition.where.branch_name = (req.body.search.branch_name);
        }
      }
      data = await bankDetailsModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVarietyDataDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

        },
        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };

      if (req.body.search) {
        if (req.body.search.variety_name) {
          condition.where.variety_name = (req.body.search.id);
        }

      }
      data = await cropVerietyModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }




  // static addSeasonValue = async (req, res) => {
  //   try {

  //     for (let index = 0; index < req.body.nucleusSeed.length; index++) {
  //       const element = req.body.nucleusSeed[index];
  //       const dataRow={

  //         seasons:element.season,
  //           crop_id:element.crop_id
  //       }

  //     const newData = await seasonValueModel.build(dataRow);
  //     await newData.save();
  //     if (newData) {
  //       return response(res, status.DATA_SAVE, 200, {})
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 404)
  //     }
  //     }

  //     // const data = seasonValueModel.build({

  //     // });




  //   }
  //   catch (error) {
  //     console.log(error, 'dataRow');
  //     return response(res, status.DATA_NOT_SAVE, 500)
  //   }
  // }






  // -=------------//

  static addSeasonValue = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      // console.log(tabledExtracted,'tabledExtracted,2339');
      console.log(req.body, 'req');
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
      ) {
        tabledExtracted = true;
        // console.log(req.body.nucleusSeed.season);
        console.log("tabledExtracted", tabledExtracted, '2345');
        for (let index = 0; index < req.body.nucleusSeed.season.length; index++) {
          const element = req.body.nucleusSeed.season[index];
          const data = req.body.nucleusSeed[index];
          console.log(req.body.nucleusSeed.crop_id, '<::allDarta');
          console.log(data, '<::elemenr');
          const dataRow = {

            seasons: element,
            crop_id: req.body.nucleusSeed.crop_id

          };
          // console.log('data===>',dataRow);
          if (element.id > 0) {
            // update
            await seasonValueModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {

            });
          }
          else {
            const newData = await seasonValueModel.build(dataRow);
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
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }


  static converDate(dateString) {

    var date = new Date(dateString);
    var yr = date.getFullYear();
    var mo = date.getMonth() + 1;
    var day = date.getDate();

    var hours = date.getHours();
    var hr = hours < 10 ? '0' + hours : hours;

    var minutes = date.getMinutes();
    var min = (minutes < 10) ? '0' + minutes : minutes;

    var seconds = date.getSeconds();
    var sec = (seconds < 10) ? '0' + seconds : seconds;

    var newDateString = yr + '-' + mo + '-' + day;
    var newTimeString = hr + ':' + min + ':' + sec;

    var excelDateString = newDateString + ' ' + newTimeString;

    return excelDateString;
  }
  static getvarietCode = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'variety_id': 'integer',
        // 'state_id': 'string',
        // 'district_id': 'string',
        // 'lab_name': 'string'
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

        where: {}
      };
      if (req.body.search) {
        if (req.body.search.variety_id) {
          condition.where.id = req.body.search.variety_id;
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['id', 'DESC']];
      const data = await cropVerietyModel.findAndCountAll(condition);
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


  static getDistrictLatLong = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
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

      let condition = {

        where: {
          district_code_LG: req.body.search.district_id,
          // min_longitude: { [Op.gt]:  req.body.search.min_longitude},
          // max_longitude: { [Op.lt]: req.body.search.min_longitude},
          // variety_code: {
          //   [Op.like]: "%" + req.body.search.crop_code + "%",
          // },
          // id: req.body.search.variety_id,
          // is_active: 1
        },
        // raw: false,
        // limit: 1
      };

      // condition.order = [['variety_code', 'Desc']];

      let queryData = await districtLatLongModel.findAll(condition);


      console.log('queryData', queryData);
      console.log(queryData);
      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getDynamicVarietyCodeCharacterstics = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_id': 'integer',
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
        include:[
          {
            model:  db.varietyCategoryMappingModel,
            attributes: ['m_variety_category_id'],
            as: 'category',
            include: [
              {
                model: db.varietyCategoryModel,
                attributes: ['category'],
                require: true
              },
            ],
          }
        ],
        where: {
          id: req.body.search.variety_id,
          // id: req.body.search.variety_id,
          // is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [['variety_code', 'Desc']];

      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static freezeIndentBreederSeedData = async (req, res) => {
    try {
      const id = [] = req.body.search.id;
      console.log('gauravgauarv', id);
      const data = await indentOfBreederseedModel.update({
        is_freeze: 1,
        // is_forward:1
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

  static freezeIndentBreederSeedDataForward = async (req, res) => {
    try {
      const id = [] = req.body.search.id;     
      const data = await indentOfBreederseedModel.update({
        is_forward: 1
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
  

  static freezeIndentBreederSeedReport = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      if (req.body.search.icar) {
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
                  attributes: ['id', 'short_name', 'agency_name'],
                  // include: [{
                  //   model: stateModel,
                  //   left: true,
                  //   attributes: ['id', 'state_code', 'state_short_name'],
                  // }]
                },
              ],
              where: {
                user_type: 'IN',
                // id: {
                //   [Op.ne]: null,
                // },
              }

            },
            {
              model: varietyModel,
              left: true,
              attributes: ['variety_name', 'variety_code'],
            }
          ],
          attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'icar_freeze'],
          // where: {
          //   user_id: {
          //     [Op.ne]: null,
          //     // distinct: true
          //   },
          //   is_freeze: 1
          //   // state_short_name:{
          //   //   [Op.ne]: null,
          //   // }
          //   // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          //   // raw: false,
          // },
          where: {
            [Op.and]: [
              {
                user_id: {
                  [Op.ne]: null
                }

              },
            ]
          },
          // group:['indent_of_breederseeds.variety_id']

        };
      }
      else {
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
                  attributes: ['id', 'short_name', 'agency_name'],
                  // include: [{
                  //   model: stateModel,
                  //   left: true,
                  //   attributes: ['id', 'state_code', 'state_short_name'],
                  // }]
                },
              ],
              where: {
                user_type: 'IN',
                // id: {
                //   [Op.ne]: null,
                // },
              }

            },
            {
              model: varietyModel,
              left: true,
              attributes: ['variety_name', 'variety_code'],
            }
          ],
          attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'icar_freeze'],
          // where: {
          //   user_id: {
          //     [Op.ne]: null,
          //     // distinct: true
          //   },
          //   is_freeze: 1
          //   // state_short_name:{
          //   //   [Op.ne]: null,
          //   // }
          //   // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          //   // raw: false,
          // },
          where: {
            [Op.or]: [
              {
                user_id: {
                  [Op.ne]: null
                }
              },
            ]
          },
          // group:['indent_of_breederseeds.variety_id']

        };
      }

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
        if (req.body.search.type) {
          if (req.body.search.type == "nodal") {
            // condition.where.is_freeze = 1;
            // condition.where.icar_freeze = 0;
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }

        } else {
          condition.where = {
            is_freeze: {
              [Op.eq]: 1
            },
            icar_freeze: {
              [Op.eq]: 0
            }

          }
        }
      }
      data = await indentOfBreederseedModel.findAndCountAll(condition);
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

  //add-state-characterstrics
  static addStateCharacterstics = async (req, res) => {
    try {
      // console.log(r);
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const dataRow = {
            state_code: element.state_code,
            state_name: element.state_name,
            state_data: element
          };
          // console.log('data============row', dataRow);
          if (element.id > 0) {
            // update
            await characterStateModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {
            });
          }
          else {
            const newData = await characterStateModel.build(dataRow);
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
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }


  static upload = async (req, res) => {
    // console.log('hiiiiiiiii');
    console.log('req.body======>', req.files.name.name, req.files.name.data
    );
    const minioClient = await this.clientSetUp();
    const isExist = await minioClient.bucketExists("seeds");
    console.log('hellllllllllloooooooooooo');
    if (!isExist) {
      console.log('hiiiiiii');
      const createBucket = await minioClient.makeBucket('seeds', 'us-east-1');
      console.log('Bucket created successfully in "us-east-1".')
      // console.log('createBucket', createBucket);
    }
    console.log('isExist', isExist);

    const uploadFile = await minioClient.putObject('seeds', req.files.name.name, req.files.name.data);
    console.log('upload', req.files);
    if (!uploadFile) {
      return console.log(uploadFile)
    }
    const dataRow = {
      image_url: uploadFile.etag
    }
    const data = await cropCharactersticsModel.create(dataRow);
    data.save();



    console.log('File uploaded successfully.');
    res.json({
      message: 'File uploaded successfully.',
      status: 200,
    });
  }
  static download = async (req, res) => {
    const { filename = "" } = req.query;
    console.log('filename', filename);
    const minioClient = await this.clientSetUp();
    const file = await minioClient.getObject('seeds', filename);
    return file.pipe(res);
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


  static checkAlreadyExistsCropName = async (req, res) => {
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

      let condition = {

      };
      let existingData;
      if (req.body.search.id) {
        existingData = await cropModel.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.crop_name),
              ),
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],
            id: {
              [Op.ne]: req.body.search.id
            }
          }
        });
      } else {
        existingData = await cropModel.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.crop_name),
              ),
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],
          }
        });
      }
      let tabledAlteredSuccessfully = false;
      if (existingData === undefined || existingData.length < 1) {
        // const data = await cropModel.create(dataRow);
        // await data.save();
        tabledAlteredSuccessfully = true;
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsVarietyNames = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_name': 'string',
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

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      console.log("req.body.search.variety_name===", req.body.search.variety_name);
      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.or]: [{ variety_name: req.body.search.variety_name }],
          is_active: 1
        }
      });

      if ((varitData && varitData.length)) {
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


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static checkAlreadyExistsMaxLotSize = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop': 'string',
        // 'search.max_lot_size':'string'
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

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      let maxLotSize = await maxLotSizeModel.findAll({
        where: {
          [Op.or]: [{ crop: req.body.search.crop }],
          // [Op.and]: [{ max_lot_size: req.body.search.max_lot_size }],
          // is_active: 1
        }
      });

      if ((maxLotSize && maxLotSize.length)) {
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


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }



  static getInsitutionData = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      condition = {}
      let data = await responsibleInsitutionModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      }
      else {
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
  static checkCropNameinSeedLabrotary = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        // 'search.max_lot_size':'string'
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

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      let seedMultiplicationData = await seedMultiplicationRatioModel.findAll({
        where: {
          [Op.or]: [{ crop_name: req.body.crop_name }],
          // [Op.and]: [{ max_lot_size: req.body.search.max_lot_size }],
          // is_active: 1
        }
      });

      if ((seedMultiplicationData && seedMultiplicationData.length)) {
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

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsSeedMultiplicationRatioData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      let rules = {
        'search.crop_code': 'string',
        'search.user_id': 'integer'
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

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if ((req.body.search.crop_code) && (req.body.search.user_id)) {
          if (req.body.search.crop_code) {
            condition.where.crop_group_code = (req.body.search.crop_code);
          }
          if (req.body.search.user_id) {
            condition.where.user_id = parseInt(req.body.search.user_id);
          }
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      }
      let checkdata = await seedMultiplicationRatioModel.findAndCountAll(condition);
      // console.log('checkdata======0', checkdata);
      if ((checkdata.count && checkdata.count > 0)) {
        // console.log('checkdata====1', checkdata);
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        console.log('checkdata====2', checkdata);
        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }

  }
  static getCropIndentorVerietyList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropVerietyModel,
            // left: true,
            // attributes: ['name']
          },
        ],
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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

  static getCropIndentorCropList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            // left: true,
            // attributes: ['name']
          },
        ],
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getCropMaxLotSizeDataforReports = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            left: true,
            raw: false,
            // required:true,
            // include: [
            //   {
            //     model: cropGroupModel,
            //     required:true
            //   }
            // ]
          },
          {
            model: cropGroupModel,
            left: true,
            raw: false,

            // required:true,


          }


        ],
        left: true,
        raw: false,

        // required:true,
        // attributes: ['crop', 'max_lot_size', 'crop_code'],
        where: {},

      }

      let { page, pageSize, searchData } = req.body;
      console.log(req.body)
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 50;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.crop_group_code) {
          condition.where['group_code'] = searchData.crop_group_code
        }
        if (searchData.crop_name) {
          condition.where['crop_code'] = searchData.crop_name
        }

        // if (searchData.year) {
        //   condition.where['year'] = searchData.year
        // }
      }
      // condition.order = [[sequelize.fn('lower', sequelize.col('m_crop.crop_name')), 'ASC']];

      // condition.order = [(sequelize.col('m_crop->m_crop_group.group_name', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [[sequelize.col('m_crop_group.group_name', 'ASC')]]

      let data = await maxLotSizeModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }


  static getSeedTestingLabDataforReports = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;

      let condition = {
        include: [
          // {
          //   model:designationModel,
          //   attributes:['name']

          // },

          {
            model: districtModel,
            left: false,
            raw: false,
            attributes: ['district_name', 'state_name']
          },
          {
            model: designationModel,
            left: false,
            raw: false,
            // attributes: ['district_name', 'state_name']
          },


        ],
        where: {}
      }
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.state_id) {
          condition.where['state_id'] = searchData.state_id;
        }
        if (searchData.district) {
          condition.where['district_id'] = searchData.district;
        }
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [(sequelize.col('m_seed_test_laboratories.lab_name', 'ASC')),
      (sequelize.col('m_seed_test_laboratories.address', 'ASC')),
      (sequelize.col('m_district.state_name', 'ASC')),
      (sequelize.col('m_district.district_name', 'ASC'))
      ];

      const data = await seedLabTestModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getAddCropCharacterDetails = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          // {
          //   model: cropGroupModel,
          //   left: true,
          //   attribute: ['group_name', 'group_code'],
          //   order: [['group_name']]
          // },
          {
            model: cropModel,
            include: [{
              model: cropGroupModel,
              left: true,
              attribute: ['group_name', 'group_code'],
              order: [['group_name']]
            }],
            left: true,
            attribute: ['crop_name'],

          },
        ],

        where: {

        }
      };

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
      condition.order = [(sequelize.col('m_crop.crop_group', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety_name','ASC']];

      if (search) {
        condition.where = {};


        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);

        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
      }

      // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];

      let data = await cropCharactersticsModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getSeedMultiplicationRatioDataSecond = async (req, res) => {
    let returnResponse = {};
    try {
      // const userId = req.body.loginedUserid.id
      let condition = {
        include: [
          // {
          //   model: cropGroupModel,
          //   left: true,
          //   attribute: ['group_name', 'group_code'],
          //   order: [['group_name']]
          // },
          {
            model: cropModel,
            include: [{
              model: cropGroupModel,
              left: true,
              attribute: ['group_name', 'group_code'],
              // order: [['group_name']]
            }],
            left: true,
            attribute: ['crop_name'],
            // where: {
            //   is_active: 1
            // }

          },
        ],


      };

      // if (userId) {
      //   console.log('audhdata===========', userId);
      //   condition.where.user_id = userId;
      //   // console.log("byee",condition.where.user_id);
      // }

      let { page, pageSize, search } = req.body;
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
      // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
      // condition.order = [[sequelize.col('m_crop.crop_name'),'ASC']];
      // [sequelize.col('m_crop.crop_group'),'ASC']
      condition.order = [['crop_name', 'ASC']];

      if (search) {
        condition.where = {};


        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.group_code);
          // condition.include[0].where.is_active = 1;

        }
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        // if (req.body.search.user_id) {
        //   condition.where.user_id = req.body.search.user_id;
        // }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
      }

      // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];

      let data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getDashboardItemCount = async (req, res) => {
    let data = [];
    try {
      let condition = {}
      if (req.body.loginedUserid && req.body.loginedUserid.user_type && req.body.loginedUserid.user_type == 'SD') {
        console.log(req.body.loginedUserid.user_type, 'get-dashboard-item-count')
        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
          ],
          where: {
            is_active: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      else if (req.body.search && req.body.search.crop_type) {
        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
          ],
          where: {
            is_active: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };

      } else {
        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
          ],
          where: {
            // is_active: 1,

          }
        };
      }

      let cropCount = await cropModel.findAll(condition);
      data.push({ "total_crop": cropCount[0].dataValues.crop_code });

      // response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(variety_code))"), "variety_code"],
          ],
          where: {
            is_active: 1,
            is_notified: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("COUNT(DISTINCT(variety_code))"), "variety_code"],
          ],
          where: {
            is_active: 1,
            is_notified: 1,

          }
        };
      }
      let varietyCount = await cropVerietyModel.findAll(condition);
      data.push({ "total_variety": varietyCount[0].dataValues.variety_code });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          is_active: 1,
          user_type: 'IN'
        }
      };
      let indenterCount = await userModel.findAll(condition);
      data.push({ "total_indenter": indenterCount[0].dataValues.username });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          is_active: 1,
          user_type: 'BR'
          // user_type:'ICAR'
        }
      };
      let icarCount = await userModel.findAll(condition);
      data.push({ "total_icar": icarCount[0].dataValues.username });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }

    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          is_active: 1,
          user_type: 'BPC'
        },

      };
      let BPCCount = await userModel.findAll(condition);

      data.push({ "total_bpc": BPCCount[0].dataValues.username });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          is_active: 1,
          user_type: 'SPP'
        },
        raw: true
      };
      let BPCCount = await userModel.findAll(condition);
      data.push({ "total_spp": BPCCount && BPCCount[0] && BPCCount[0].username ? BPCCount[0].username : 0 });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }

    //spp



    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(id)"), "totallab"],
        ],
        where: {
          is_active: 1,
          // user_type: 'BPC'
        },
        raw: true
      };

      let SPPCount = await db.seedLabTestModel.findAll(condition);

      data.push({ "total_lab": SPPCount && SPPCount[0] && SPPCount[0].totallab ? SPPCount[0].totallab : 0 });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }


    response(res, status.DATA_AVAILABLE, 200, data)
  }

  static totalIndent = async (req, res) => {
    let data = [];
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"]
          ],
          where: {
            is_active: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"]
          ],
          where: {
            is_active: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getTotalLiftedCount = async (req, res) => {
    let data = [];
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("Sum(lifting_quantity)"), "lifting_quantity"]
          ],
          where: {
            is_active: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("Sum(lifting_quantity)"), "lifting_quantity"]
          ],
          where: {
            is_active: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      let data = await bsp5bModel.findAll(condition);
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
      console.log(req.body.loginedUserid.user_type, 'submission-of-indent-of-breeder-seed-by-state-report')
      if (req.body.search && req.body.search.crop_type) {
        if (req.body.loginedUserid.user_type == 'SD') {
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
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              is_indenter_freeze: 1
            }
          };
        } else {
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
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze:1
            }
          };
        }

      } else {
        if (req.body.loginedUserid.user_type == 'SD') {

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
              is_indenter_freeze: 1
            }
            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        } else {
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

            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        }
      }
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
      data = await indentOfBreederseedModel.findAll(condition);


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
        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentData = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let indenterUserId;
      let isFlagFilter;
      let indentOfBreederId;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
        indentOfBreederId = { indent_of_breeder_id: req.body.loginedUserid.id }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_name')), 'crop_name'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          ],
          where: {
            [Op.and]: [
              {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                },
              }
            ],
            // icar_freeze: 1
            ...indenterUserId,
            ...isFlagFilter
          },
          order: [['indent_quantity', 'DESC']],
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_name')), 'crop_name'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          ],
          where: {

            ...indenterUserId,
            ...isFlagFilter
          },
          order: [['indent_quantity', 'DESC']],
          raw: true
        };
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code
          }
        }
      }
      let page;
      let pageSize;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      }

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.group = [['crop_name'], [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']];
      data = await indentOfBreederseedModel.findAll(condition);

      let cropCodeArray = [];
      data.forEach(ele => {
        if (ele && ele.crop_code) {
          cropCodeArray.push(ele.crop_code);
        }
      });
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let productionData;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

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

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (req.body.search && req.body.search.crop_type) {
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


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (cropCodeArray && cropCodeArray.length > 0) {
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
                [Op.in]: cropCodeArray
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      else {
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



              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
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
      if (cropCodeArray && cropCodeArray.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: cropCodeArray
          },

        })
      }

      let AllocatedData;
      AllocatedData = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              // is_report_pass: true,
              ...indentOfBreederId
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
        ],
        where: {
          [Op.and]: filterData ? filterData : [],


        },
        raw: true,
        group: [[sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')]],
      });

      // data.forEach((ele, i) => {
      //   data[i].production = 0
      //   productionData.forEach((elem, index) => {
      //     // console.log('element', ele.crop_code)
      //     if (ele.crop_code == elem.crop_code) {
      //       data[index].production = elem.production
      //     }
      //   })
      // })
      // data.forEach((ele, i) => {
      //   data[i].allocated = 0
      //   AllocatedData.forEach((elem, index) => {
      //     // console.log('element', elem.crop_code)
      //     if (ele.crop_code == elem.crop_code) {

      //       data[index].allocated = elem.allocated ? elem.allocated : 0
      //     }
      //   })
      // })

      productionData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].production = elem.production
          }

        })
      })

      AllocatedData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })
      })

      let data1 = await db.bsp5bModel.findAll({
        // include: [
        //   {
        //     model: allocationToIndentorProductionCenterSeed
        //   }
        // ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          [sequelize.col('crop_code'), 'crop_code']
        ],
        group: [
          'crop_code'
          // [sequelize.col('id'), 'id'],
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      data1.forEach(item => {
        data.forEach((elem, i) => {
          if (elem.crop_code == item.crop_code) {
            data[i].total_lifting = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
          }
        })
      })
      // let dataReportArray = data.map(ele=>{
      //   productionData.forEach(item=>{
      //     ele=> ele.crop_code == item.crop_code
      //   })
      // })
      // const mappedArray = productionData.map((element, index) => {
      //   console.log('element.crop_code====',element.crop_code);
      //   const correspondingValue = data[element.crop_code];
      //   // Perform any mapping or transformation logic here
      //   return correspondingValue;
      // });

      // console.log('dataReportArray==========', mappedArray);
      // const matchingElements = data.filter((element) =>
      //  productionData.includes(element));
      // console.log('matchingElements',matchingElements);
      // const combinedArray = [];
      // matchingElements.forEach((element) => {
      //   combinedArray.push(element);
      // });
      // console.log('combinedArray================',combinedArray);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartIndentDataVariety = async (req, res) => {
    let data = {};
    try {
      // let filterData = [{ icar_freeze: 1 }];
      let filterData = [];
      let indenterUserId;
      let isFlagFilter;
      let indentOfBreederId;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
        indentOfBreederId = { indent_of_breeder_id: req.body.loginedUserid.id }
      }
      // else if (req.body.search && req.body.search.graphType == "nodal") 
      // {
      //   indenterUserId = { user_id: req.body.loginedUserid.id }
      //   isFlagFilter = { is_indenter_freeze: 1 }
      //   filterData = [{ is_indenter_freeze: 1 }]
      // }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
        filterData = [{ is_freeze: 1 }]
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
        filterData = [{ is_indenter_freeze: 1 }]
      } else {
        isFlagFilter = { icar_freeze: 1 }
        filterData = [{ icar_freeze: 1 }]
      }
      if (req.body.search && req.body.search.crop_type) {
        filterData.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        })
      }

      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          // [sequelize.fn('DISTINCT', ), 'crop_code'],
          // [sequelize.col('indent_of_breederseeds.crop_code'),'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
        ],

        where: {
          [Op.and]: filterData ? filterData : [], ...indenterUserId,
          // ...isFlagFilter,

        },
        // where: {
        //   [Op.and]: [{
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     icar_freeze: 1
        //   }
        //   ]

        // },
        raw: true
      };
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
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
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   condition.where.crop_code = {
        //     [Op.in]: (req.body.search.crop_code)
        //   };
        // }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      ];
      data = await indentOfBreederseedModel.findAll(condition);

      let filterData1 = [];
      if (req.body && req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   filterData1.push({
        //     crop_code: {
        //       [Op.in]: (req.body.search.crop_code)
        //     }
        //   })
        // }
        if (req.body.search.crop_code) {
          filterData1.push({
            crop_code: {
              [Op.eq]: (req.body.search.crop_code)
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          })
        }
      }
      let varietyArr = [];
      if (data && data.length > 0) {

        data.forEach(ele => {
          varietyArr.push(ele && ele.variety_id ? ele.variety_id : '')
        })
      }
      let liftedData;
      if (varietyArr && varietyArr.length > 0) {

        liftedData = await bsp5bModel.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.variety_id')), 'variety_id'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.col('bsp_5_b.variety_id'), 'variety_id']
          ],
          where: {
            // ... filterData1,
            [Op.and]: filterData1 ? filterData1 : [],
            // variety_id: {
            //   [Op.in]: varietyArr
            // }
          },

          // where: {
          //   ...filterData1,

          //  [Op.and]:filterData1 ? filterData1 :[],
          //  ...varietyArr

          // [Op.in]:variety_id :varietyArr
          // },
          raw: true,

        })
      }
      else {
        liftedData = await bsp5bModel.findAll({
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            // ...varietyArr
          },
          raw: true,

        })
      }

      let productionData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"]
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('lot_number_creations.variety_id')]],
        // order:[['indent_quantity', 'DESC']]
      });

      let AllocatedData = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              // is_report_pass: true
              ...indentOfBreederId
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'crop_code'],
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id'), 'variety_id'],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
        ],
        // where: {
        //   [Op.and]: {
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     crop_code: {
        //       [Op.eq]: req.body.search.crop_code
        //     },
        //     year: {
        //       [Op.eq]: req.body.search.year
        //     },
        //     ...seasonData
        //   }
        // },
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')],
        [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')]
        ],
      });

      productionData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            data[i].production = elem.production ? elem.production : '0'
          }

        })
      })

      // console.log('mergedArraymergedArray',mergedArray)
      AllocatedData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            // console.log('hiii')
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })

      })


      if (liftedData && liftedData.length > 0) {
        liftedData.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.variety_id == item.variety_id) {
              data[i].lifting_qty = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
            }
          })

        })
      }

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
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_name')), 'variety_name'],
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"]
        ],
        where: {
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
      data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCropCharactersticsWithId = async (req, res) => {
    try {
      // let { page, pageSize, search } = req.body;
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [
            {
              model: cropModel,
              left: true,
              include: [
                {
                  model: cropGroupModel
                }
              ],
              // attributes: ['crop_name']
            },
            {
              model: cropCharactersticsModel,
              include:[
                {
                  model: db.mCharactersticAgroRegionMappingModel,
                  attributes: ['is_checked','region_id'],
                  as: 'regions',
                  // include: [
                  //   {
                  //     model: db.varietyCategoryModel,
                  //     attributes: ['category'],
                  //     require: true
                  //   },
                  // ],
                }
              ]
            }, 
          ],
          where: {}
        }
      }
      else {
        condition = {
          include: [
            {
              model: cropModel,
              where: {
                is_active: 1
              },
              left: true,
              include: [
                {
                  model: cropGroupModel
                }
              ],
              // attributes: ['crop_name']
            },
            {
              model:cropCharactersticsModel
            },
            // {
            //   model: db.mCharactersticAgroRegionMappingModel,
            //   attributes: ['is_checked','region_id'],
            //   as: 'regions',
            //   // include: [
            //   //   {
            //   //     model: db.varietyCategoryModel,
            //   //     attributes: ['category'],
            //   //     require: true
            //   //   },
            //   // ],
            //   left:true
            // },
            
          ],
          // nest:true,
          where: {}
        }
      }


      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      if (req.params.id) {
        if (req.params.id) {
          condition.where.variety_code = req.params.id
        }

        // if (search.crop_code) {
        //   condition.where['crop_code'] = search.crop_code
        // }
      }

      const data = await cropVerietyModel.findAll(condition);
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


  static getLabDistrictNameData = async (req, res) => {
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
            model: districtModel,
            attributes: [],
            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('state_code')), 'state_code']],
            left: true,
            raw: true,
            // group:[ sequelize.col('district_code')]


          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name'],
        ],

        where: {},
        raw: true
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
      const data = await seedLabTestModel.findAndCountAll(condition);
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



  // ------------//
  static checkAlreadyExistsSeedMultiplicationRatioDataSecond = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      let rules = {
        'search.crop_code': 'string',
        'search.user_id': 'integer'
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

      // console.log('nucleusSeed',req.body.nucleusSeed.crop_name)
      let cropCode = [];
      let userId = [];
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        // console.log(req.body.nucleusSeed)
        // tabledExtracted = true;

        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          cropCode.push(element.crop_code)

          console.log(cropCode, 'crop_code')
          // if ((element.crop_code)) {
          //   for(let i =0; i<cropCode.length;i++){

          //     condition.where.crop_code = [cropCode]
          //   }

          // }


        }

      }
      let condition = {
        where: {

          crop_code: cropCode,
          // user_id:req./
        }

      }
      // if (req.body !== undefined
      //   && req.body.nucleusSeed !== undefined
      //   && req.body.nucleusSeed.length > 0) {
      //     // console.log(req.body.nucleusSeed)
      //   // tabledExtracted = true;
      //   let cropCode =[];
      //   for (let index = 0; index < req.body.nucleusSeed.length; index++) {
      //     const element = req.body.nucleusSeed[index];
      //     cropCode.push(element.crop_code)
      //     console.log(cropCode,'crop_code')
      //     if ((element.crop_code)) {
      //       for(let i =0; i<cropCode.length;i++){

      //         condition.where.crop_code = [cropCode]
      //       }

      //     }


      //   }

      // }

      let checkdata = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if ((checkdata.count && checkdata.count > 0)) {
        // console.log('checkdata====1', checkdata);
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        // console.log('checkdata====2', checkdata);
        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = (req.body.search.year);
      //   }
      //   if ((req.body.search.crop_code) && (req.body.search.user_id)) {
      //     if (req.body.search.crop_code) {
      //       condition.where.crop_group_code = (req.body.search.crop_code);
      //     }
      //     if (req.body.search.user_id) {
      //       condition.where.user_id = parseInt(req.body.search.user_id);
      //     }
      //   }
      //   // if (req.body.search.variety_code) {
      //   //   condition.where.variety_code = (req.body.search.variety_code);
      //   // }
      // }

      // console.log('checkdata======0', checkdata);


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }

  }
  static getCordinatorDistrict = async (req, res) => {
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
              'user_type': 'BR'
              // user_type: 'breeder'
              // created_by:2
            }
          },

          {
            model: districtModel,
            attributes: [],
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
          //  crea
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

  static getChartAllIndentor = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
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

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            ...isFlagFilter
          },
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },
            icar_freeze: 1
          },
          raw: true
        };
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.and]: {
              [Op.in]: req.body.search.crop_code
            }
          }
        }
      }
      condition.group = [['user.name'], ['user.id']];
      data = await indentOfBreederseedModel.findAll(condition);

      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },
        }
      }
      // crop_code: {
      //   [Op.in]: cropCodeArray
      // },
      let userIdArray = [];
      let user_id;
      data.forEach(item => {
        userIdArray.push(item.id);
      });


      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
      }

      let allocatedData;
      if (req.body.search && req.body.search.crop_type) {

        allocatedData = await allocationToIndentorSeed.findAll({
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id')), 'id'],
            // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
            // [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id"),"id"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
          group: [
            // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id')],
            [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id")]
          ],
        });
      } else {
        allocatedData = await allocationToIndentorSeed.findAll({
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id')), 'id'],
            // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
            // [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id"),"id"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          where: {
            [Op.and]: {
              // crop_code: {
              //   [Op.like]: req.body.search.crop_type + '%'
              // },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
          group: [
            // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id')],
            [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id")]
          ],
        });
      }
      // indenetor Data//
      // let filterData = 

      // let filterData = 
      let filter = []
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filter.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filter.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filter.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filter.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
      }


      let liftedQty;
      liftedQty = await bsp5bModel.findAll({
        where: {
          [Op.and]: filter ? filter : []
        },
        include: [
          {
            model: indentOfBreederseedModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('bsp_5_b.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
          [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
          [sequelize.col('indent_of_breederseed.user_id'), 'user_id'],
          // [sequelize.col('bsp_5_b.lifting_quantity'),'lifting_quantity'],
        ],
        raw: true
      })
      let sumofliftedQty = ConditionCreator.sumofDuplicateDataLiftedIndentQty(liftedQty, 'user_id')

      allocatedData.forEach(elem => {

        data.forEach((ele, i) => {
          if (ele.id == elem.id) {
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })
      })
      if (sumofliftedQty && sumofliftedQty.length > 0) {
        sumofliftedQty.forEach(elem => {
          data.forEach((ele, i) => {
            if (ele.id == elem.user_id) {
              data[i].lifting_quantity = elem.lifting_quantity ? elem.lifting_quantity : 0
            }

          })
        })
      }
      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {}
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

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("DISTINCT(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.literal("(indent_of_breederseeds.crop_name)"), "crop_name"],
            [sequelize.col("user.id"), "id"],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],

            // [sequelize.col("user.name"), "name"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            // icar_freeze: 1
            ...isFlagFilter
          },
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("DISTINCT(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.literal("(indent_of_breederseeds.crop_name)"), "crop_name"],
            [sequelize.col("user.id"), "id"],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],

            // [sequelize.col("user.name"), "name"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },
            ...isFlagFilter
          },
          raw: true
        };
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = req.body.search.crop_code
        // }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = { [Op.in]: req.body.search.crop_code }
        }
        if (req.body.search.user_id) {
          condition.include[1].where.id = parseInt(req.body.search.user_id)
        }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        [sequelize.col('indent_of_breederseeds.crop_name'), 'crop_name'],
        [sequelize.col("user.id"), "id"],
      ];

      data = await indentOfBreederseedModel.findAll(condition);
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },
        }
      }
      // crop_code: {
      //   [Op.in]: cropCodeArray
      // },
      let userIdArray = [];
      let user_id;
      console.log('data====', data)
      data.forEach(item => {
        userIdArray.push(item.id);
      });

      userIdArray = [... new Set(userIdArray)]
      console.log(userIdArray, 'userIdArray')
      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
      }

      let allocatedDatasecond;
      let cropTypeSecond;

      if (req.body.search && req.body.search.crop_type) {
        cropTypeSecond = {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        }
      }

      if (req.body.search && req.body.search.crop_type) {

        allocatedDatasecond = await allocationToIndentorSeed.findAll({
          // where:{}

          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          group: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'id'],
            [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id'],

          ],
          // attributes:[
          //   [sequelize.col('allocation_to_indentor_for_lifting_breederseed.crop_code'),'crop_code']

          // ],
          where: {
            [Op.and]: {
              ...cropTypeSecond,
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
        })
      } else {
        allocatedDatasecond = await allocationToIndentorSeed.findAll({
          // where:{}

          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          // attributes: [
          //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'qty'],
          //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id']
          //   // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          // ],
          // // group:[
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'),'crop_code'],
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'),'id'],
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'),'id'],

          // // ],
          raw: true,
          attributes: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          group: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'id'],
            [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id'],

          ],
          where: {
            [Op.and]: {

              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
        })

      }
      const uniqueIndentorDataMap = []
      let uniqueJsonArrays;
      if (allocatedDatasecond && allocatedDatasecond.length > 0) {
        uniqueJsonArrays = seedhelper.sumofDuplicateDataAllocated(allocatedDatasecond)
      }
      if (uniqueJsonArrays && uniqueJsonArrays.length > 0) {

        console.log(uniqueJsonArrays, 'allocatedDataallocatedData')
        uniqueJsonArrays.forEach(elem => {
          data.forEach((ele, i) => {
            if (ele.crop_code == elem.crop_code) {
              data[i].allocated = elem && elem.allocated ? parseFloat(elem.allocated) : 0;

            }
          })
          // console.log(elem,'allocatedData')
        })
      }
      let filter = []
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filter.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filter.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filter.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filter.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
      }
      let cropArr = []
      data.forEach(item => {
        cropArr.push(item && item.crop_code ? item.crop_code : '')
      })
      let liftedQty;
      if (cropArr && cropArr.length > 0) {
        if (req.body.search && req.body.search.user_id) {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],
              crop_code: {
                [Op.in]: cropArr
              }

            },
            include: [
              {
                model: indentOfBreederseedModel,
                where: {
                  user_id: req.body.search.user_id
                },
                attributes: [],
              }


            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
            ],
            raw: true
          })
        } else {
          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],
              crop_code: {
                [Op.in]: cropArr
              }

            },
            include: [
              {
                model: indentOfBreederseedModel,
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }

      } else {
        if (req.body.search && req.body.search.user_id) {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],


            },
            include: [
              {
                model: indentOfBreederseedModel,
                where: {
                  user_id: req.body.search.user_id
                },
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }
        else {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],

            },
            include: [
              {
                model: indentOfBreederseedModel,
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }
      }
      if (liftedQty && liftedQty.length > 0) {
        liftedQty.forEach(item => {
          data.forEach((ele, i) => {
            if (ele.crop_code == item.crop_code) {
              data[i].lifting_qty = item && item.lifting_quantity ? item.lifting_quantity : 0;
            }
          })
        })
      }


      // data.forEach((ele, i) => {
      //   data[i].allocated = 0
      //   allocatedData.forEach((elem, index) => {
      //     if (ele.id == elem.id) {
      //       data[index].allocated = elem.allocated ? elem.allocated : 0;
      //     }
      //   })
      // });
      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getTotalAllocateLiftingCount = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              attributes: [],
              where: {
                //  user_id: req.body.search.user_id,
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                }
              }
            }
          ],
          attributes: [
            // [sequelize.fn('sum', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')),'quantity']
            'quantity'
          ],
          where: {

          },
          row: true
        };
      } else {
        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              attributes: [],
              // where: {
              //   user_id: req.body.search.user_id,
              //   crop_code: {
              //     [Op.like]: req.body.search.crop_type + '%'
              //   }
              // }
            }
          ],
          attributes: [
            // [sequelize.fn('sum', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')),'quantity']
            'quantity'
          ],
          where: {

          },
          row: true
        };
      }
      data = await allocationToIndentor.findAll(condition);
      let qt = [];
      let total = 0;
      if (data.length != 0) {
        data.forEach(element => {
          qt.push(element.dataValues.quantity);
        });
        total = qt.reduce(function (curr, prev) { return curr + prev; });
      }
      response(res, status.DATA_AVAILABLE, 200, total);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static editProfile = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      console.log(mobileno, 'mobileno')
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: (req.body.agency_name).toUpperCase(),
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,


        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,

        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.created_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address
      };


      existingAgencyData = await agencyDetailModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }






      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update(usersData, condition);
        console.log('hiii')
        const updateUsertableData = {
          name: (req.body.agency_name).toUpperCase(),

          email_id: req.body.email,

        }
        const user_data = await userModel.update(updateUsertableData, { where: { id: req.body.user_id } })
        tabledAlteredSuccessfully = true;
        //createUser()
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
  static getProfile = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.agency_id': 'integer',

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

      let { page, pageSize, search } = req.body;


      let condition = {

        where: {
          id: req.body.search.agency_id
          // is_active: 1
        },
        raw: false,

      };
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      // const sortDirection = req.body.order ? req.body.order : 'ASC';



      // condition.order = [[sortOrder, sortDirection]];

      // if (req.body.search) {

      //   if (req.body.search.agency_id) {
      //     condition.where.id = (req.body.search.agency_id);
      //   }
      //   // if (req.body.search.crop_code) {
      //   //   condition.where.crop_code = (req.body.search.crop_code);
      //   // }
      //   // if (req.body.search.crop_name_data) {

      //   //   condition.where.crop_group = (req.body.search.crop_name_data);
      //   // }
      //   // if (req.body.search.crop_group) {

      //   //   condition.where.crop_group = (req.body.search.crop_group);
      //   // }

      // }


      const queryData = await agencyDetailModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static updateProfileData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      const { contact_person_name, contactPersonDesignation, user_id, showMobileNumber, mobile, email, contact_person_designation, latitude, longitude, agency_id, fax_number, phone, pincode, crop_data, image_url } = req.body;
      let data;
      let dataRow = {
        // contact_person_designation:contact_person_designation ? contact_person_designation :'',
        contact_person_name: contact_person_name ? contact_person_name : null,
        crop_data: crop_data ? crop_data : null,
        latitude: latitude ? latitude : null,
        longitude: longitude ? longitude : null,
        email: email ? email : null,
        fax_no: fax_number ? fax_number : null,
        phone_number: phone ? phone : null,
        image_url: image_url ? image_url : null,
        // mobile_number:mobile ? mobile :null, 
        contact_person_designation_id: contact_person_designation,
        pincode: pincode ? pincode : null,
        mobile_number :mobile ? mobile : null,
        contact_person_mobile : mobile ? mobile : null
      }
      if (contactPersonDesignation) {
        dataRow.contact_person_designation = contact_person_designation ? contact_person_designation : '';
      } else {
        dataRow.contact_person_designation_id = contact_person_designation ? contact_person_designation : '';
      }
     
      data = await db.agencyDetailModel.update(dataRow, {
        where: {
          id: agency_id
        }
      })

      // 
      if (data) {
        return response(res, status.OK, 200, data, internalCall);

      }
      else {
        return response(res, status.ID_NOT_FOUND, 200, data, internalCall);

      }
      // const queryData = await agencyDetailModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);



    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static CheckEmeailId = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {

        'search.email_id': 'string',
        'search.password': 'string',
        'search.id': 'integer',

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

      let { page, pageSize, search } = req.body;


      let condition = {

        where: {
          email_id: req.body.search.email_id,
          password: req.body.search.password,
          id: req.body.search.id
          // is_active: 1
        },
        raw: false,

      };
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      const queryData = await userModel.findAndCountAll(condition);
      let emailResponse;

      console.log('queryData', queryData.rows.length);

      if (queryData.rows.length > 0) {
        emailResponse = {
          emailAlreadyRegistered: true
        }

      }
      else {
        emailResponse = {
          emailAlreadyRegistered: false
        }
      }
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, emailResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static UpdatePassword = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      console.log(req)

      let rules = {
        'search.email_id': 'string',
        'search.password': 'string',
        'search.id': 'integer',
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

      let { page, pageSize, search } = req.body;
      let whereClause={}
      let {email_id} = req.body.search;
      if(email_id){
        whereClause.email_id=email_id
      }
      let condition = {

        where: {
          ...whereClause,
          // email_id: req.body.search.email_id,
          // password: req.body.search.currentpassword,
          id: req.params.id,
         
        },
        raw: false,

      };

      const queryData = await userModel.findAndCountAll(condition);

      if (queryData.rows.length > 0) {
        const data = {
          // password: req.body.search.password,
          is_change_password:true,
        }
        const user_data = await userModel.update(data, { where: { id: req.params.id } })
      }

      return response(res, status.OK, 200, 'data updated successfully', internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static getPlantDeatils = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.state_code': 'integer',
        'search.district_code': 'integer',

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

            model: stateModel,
          },
          {
            model: districtModel
          },
          {
            model: designationModel
          }
        ],
        where: {
          // state_id : req.body.search.state_code ? req.body.search.state_code : undefined
        }


      };





      // const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sequelize.col('plant_details.plant_name'), 'asc'],
      [sequelize.col('m_state.state_name'), 'asc'],

      [sequelize.col('m_district.district_name'), 'asc'],
      [sequelize.col('plant_details.latitude'), 'asc'],
      [sequelize.col('plant_details.longitude'), 'asc'],
        // [sequelize.col('agency_detail.addrress'), 'asc'],


      ]

      // condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.state_code) {

          condition.where.state_id = parseInt(req.body.search.state_code);
        }

        if (req.body.search.district_code) {

          condition.where.district_id = (req.body.search.district_code);
        }


      }


      const queryData = await plantDetail.findAndCountAll(condition);



      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getPlantDistrictDetails = async (req, res) => {
    let data = [];
    try {
      let condition = {
        include: [

          {
            model: districtModel,
            attribute: ['district_name'],
            raw: true
          },

        ],

        where: {
          state_id: req.body.search.state
          // is_active: 1,
          // crop_code: {
          //   [Op.like]: req.body.search.crop_type + '%'
          // }
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true,
      };
      let data = await plantDetail.findAndCountAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getProjectCoordinatorReport = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: agencyDetailModel,
            left: true,
            attributes: ['agency_name', 'category', 'district_id', 'short_name', 'address', 'contact_person_name', 'contact_person_mobile', 'email', 'latitude', 'longitude'],
            include: [
              {
                model: stateModel,
                left: true,
                // attributes: ['state_code', 'state_code', 'district_code'],
                where: {}
              },
              {
                model: districtModel,
                left: true,
                attributes: ['district_name', 'state_code', 'district_code'],
                where: {}
              },
              {
                model: designationModel,
                left: true,
                attributes: ['name'],
                where: {}
              },
              {
                model: mCategoryOrgnization,
                left: true
              }
            ],
            ...stateId
          },
        ],
        // raw:true,
        where: {
          user_type: 'BR'
        },
        // attributes: ['user_type', 'agency_id']
      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]


      const data = await userModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getProjectCoordinatorReportCordinator = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            },
          },
          {
            model: stateModel
          }


        ],
        // raw:true,
        where: {
          state_id: req.body.search.state_id
          // user_type: '
        },

      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]


      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getProjectCoordinatorReportCordinatorDistrict = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            },
          },
          {
            model: districtModel,
          }


        ],
        // raw:true,
        where: {
          state_id: req.body.search.state_id
          // user_type: '
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          // [sequelize.col('m_district.district_code'),'district_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],

          'id'
        ],
        // raw:true,

      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }


      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]
      condition.order = [[sequelize.col('m_district.district_name'), 'asc']]


      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getBspcReportDistrict = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {
        where: {
          user_type: 'BPC'
        },
        attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: agencyDetailModel,
            left: false,
            raw: false,
            where: {},
            attributes: ['address',],

            include: [{
              model: districtModel,
              attributes: ['district_name', 'district_code'],
              where: {}
            },
            {
              model: stateModel,
              attributes: ['state_name', 'state_code']
            }
            ]
          },

        ],
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        console.log("Breeder Production Center")
        // if (searchData.breeder_id) {
        //   condition.where['created_by'] = searchData.breeder_id;
        // }

        if (req.body.search.state_id) {
          condition.include[0].include[0].where['state_code'] = req.body.search.state_id;
        }
      }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [
        // (sequelize.col('users.name', 'ASC')),
        // (sequelize.col('agency_detail.short_name', 'ASC'))
        // (sequelize.col('agency_detail->m_state.state_name', 'ASC')),
        (sequelize.col('agency_detail->m_district.district_name', 'ASC')),
        // (sequelize.col('agency_detail.latitute', 'ASC')),
        // (sequelize.col('agency_detail.longitute', 'ASC'))

      ];

      let data = await userModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getBspcReportName = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {
        where: {
          user_type: 'BPC'
        },
        // attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: agencyDetailModel,
            left: false,
            raw: false,
            where: {},
            attributes: []
            // attributes: ['address', 'agency_name'],
          },

        ],
        attributes: [
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'agency_id']
        ],
        raw: true
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        console.log("Breeder Production Center")
        // if (searchData.breeder_id) {
        //   condition.where['created_by'] = searchData.breeder_id;
        // }

        if (req.body.search.state_id) {
          condition.include[0].where['state_id'] = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.include[0].where['district_id'] = req.body.search.district_id;
        }
      }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [
        // (sequelize.col('users.name', 'ASC')),
        // (sequelize.col('agency_detail.short_name', 'ASC'))
        // (sequelize.col('agency_detail->m_state.state_name', 'ASC')),
        [sequelize.fn('lower', sequelize.col('agency_detail.agency_name')), 'ASC'],
        // (sequelize.col('agency_detail.latitute', 'ASC')),
        // (sequelize.col('agency_detail.longitute', 'ASC'))

      ];

      let data = await userModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getDistrictSeedTestingReport = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {

        // attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: districtModel,
            left: false,
            raw: false,

            // attributes: ['address','agency_name' ],


          },

        ],
        where: {
          state_id: req.body.search.state_id
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
        ],
        raw: true
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      //       if (req.body.search) {


      // console.log(' req.body.search.state_id', req.body.search.state_id)
      //         if (req.body.search.state_id) {
      //           condition.where['state_id'] = req.body.search.state_id;
      //         }


      //       }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [


        (sequelize.col('m_district.district_name', 'ASC')),


      ];

      let data = await seedLabTestModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static updateusertable = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      console.log(mobileno, 'mobileno')
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: (req.body.agency_name).toUpperCase(),
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,


        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,

        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.created_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active
      };


      existingAgencyData = await agencyDetailModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }






      if (existingData === undefined || existingData.length < 1) {
        // const data = await agencyDetailModel.update(usersData, condition);
        // console.log('hiii')
        const updateUsertableData = {
          name: (req.body.agency_name).toUpperCase(),

          email_id: req.body.email,

        }
        const user_data = await userModel.update(updateUsertableData, { where: { id: req.body.id } })
        tabledAlteredSuccessfully = true;
        //createUser()
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

  static getCropNameofSeedMultiplictionRatioReport = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: cropModel,

            left: true,
            attributes: ['crop_name', 'crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'cropName'],
        ],
        raw: true,
        where: {
          crop_group_code: req.body.search.cropGroupCode
        }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      // if (req.body.search) {
      //   if (req.body.search.cropGroupCode) {
      //     // condition.include[0].where = {};
      //     condition.include.where.crop_group_code= req.body.search.cropGroupCode
      //   }


      // }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
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

  static getCropNameofMaximumLotsizeReport = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: cropModel,

            left: true,
            attributes: ['crop_name', 'crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
        ],
        raw: true,
        where: {}
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      if (req.body.search) {
        if (req.body.search.cropGroupCode) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = req.body.search.cropGroupCode;
          // condition.where.include[0]={}

          // condition.where.group_code = req.body.search.cropGroupCode
        }


      }

      const data = await maxLotSizeModel.findAndCountAll(condition);
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
  static checksmrcropgroupisAlreayexit = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          // {
          //   model: cropModel,

          //   left: true,
          //   attributes: ['crop_name','crop_code']
          // },

        ],

        where: {}
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      if (req.body.search) {
        if (req.body.search.cropGroupCode) {

          condition.where.crop_group_code = req.body.search.cropGroupCode
        }


      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      console.log(data.rows.length);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 400);
      }
      else {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsState = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: stateModel,
            attributes: [],
            left: true,
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code']
        ],
        raw: true,

        // where: {
        //   state_id : req.body.search.state_code
        // }
      }
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      const data = await plantDetail.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsDistrict = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: districtModel,
            attributes: [],

            left: true,
            // attributes: ['crop_name','crop_code']
          },
          {
            model: userModel,
            attributes: [],
            where: {
              user_type: 'SPP'
            },
            left: true,
            // attributes: ['crop_name','crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ],
        raw: true,
        order: [[sequelize.col('m_district.district_name'), 'ASC']],
        where: {
          state_id: req.body.search.state_code
        }
      }

      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsNameofInstution = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'SPP'
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'plant_name'],
        ],
        raw: true,
        where: {
          state_id: req.body.search.state_id,
          district_id: req.body.search.district_id,
        }
      }
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      // if (req.body.search) {
      //   if (req.body.search.cropGroupCode) {

      //     condition.where.crop_group_code = req.body.search.cropGroupCode
      //   }


      // }
      condition.order = [[sequelize.col('agency_details.agency_name'), 'ASC']];

      // condition.order[[sequelize.col('plant_name'),'ASC']]

      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getProjectPoordinatorreportName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            }
          }
        ],
        where: {
          state_id: req.body.search.state_id
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          'id'
        ]


      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')

      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [['agency_name', 'asc']];




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
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getseedMultRatioSeedUniqueCropDataincropModel = async (req, res) => {
    try {
      let condition = {
        // include:[
        //   {
        //     model:cropModel,
        //     where:{
        //       [Op.and]: [
        //         {
        //           group_code: {
        //             [Op.eq]: req.body.group
        //           }

        //         },
        //         {
        //           crop_code: {
        //             [Op.notIn]: req.body.crop_code
        //           }

        //         }

        //       ]
        //     }

        //   }


        // ],

        // required:true,
        where: {
          [Op.and]: [
            {
              group_code: {
                [Op.eq]: req.body.search.group_code
              }

            },
            {
              is_active: {
                [Op.eq]: 1
              }
            }
            // {
            //   crop_code: {
            //     [Op.in]: req.body.crop_code
            //   }

            // }

          ]

        }
      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];

      //     // if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //     //   condition.where["year"] = element.value;
      //     // }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["group_code"] = element.value;
      //     }
      //     // if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //     //   condition.where["variety_id"] = element.value;
      //     // }
      //     // if (element.columnNameInItemList.toLowerCase() == "id") {
      //     //   condition.where["id"] = element.value;
      //     // }
      //   }
      // }
      // if (req.body.search) {

      //   if (req.body.search.group_code) {
      //     condition.where.group_code = (req.body.search.group_code);
      //   }

      // }
      let data = await cropModel.findAndCountAll(condition);
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

  static getseedMultRatioSeedUniqueCropData = async (req, res) => {
    try {
      let newdata = []
      let groupcode;
      if (req.body.search) {

        for (let index = 0; index < req.body.search.length; index++) {
          const element = req.body.search[index];
          // console.log(element.smr_crop_code)
          newdata = element.smr_crop_code;
          groupcode = element.value

        }
      }
      console.log('newdata', newdata)
      let condition = {
        // required:true,

        // where: {
        //   is_active: 1,
        //   [Op.notIn]:req.body.search.smr_crop_code

        // }

        where: {
          [Op.and]: [
            {
              is_active: {
                [Op.eq]: 1
              }

            },
            {
              group_code: {
                [Op.eq]: groupcode
              }

            },
            {
              crop_name: {
                [Op.notIn]: newdata
              }

            },

          ]
        },



      }
      console.log('smr_crop_code', req.body.smr_crop_code)

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];
      //     console.log(element.smr_crop_code)

      //     if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //       condition.where["year"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["crop_group_code"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //       condition.where["variety_id"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "id") {
      //       condition.where["id"] = element.value;
      //     }

      //   }
      // }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = (req.body.search.year);
      //   }
      //   if (req.body.search.crop_code) {
      //     condition.where.crop_code = (req.body.search.crop_code);
      //   }

      // }
      let data = await cropModel.findAndCountAll(condition);
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

  static getseedMultRatioSeedUniqueCropDataincropModelsecond = async (req, res) => {
    try {
      let condition = {
        // include:[
        //   {
        //     model:cropModel,
        //     where:{
        //       [Op.and]: [
        //         {
        //           group_code: {
        //             [Op.substring]: req.body.search.group_code
        //           }

        //         },
        //         // {
        //         //   crop_code: {
        //         //     [Op.notIn]: req.body.crop_code
        //         //   }

        //         // }

        //       ]
        //     }

        //   }


        // ],

        // required:true,
        // where:{
        //   [Op.and]: [
        //     {
        //       crop_group_code: {
        //         [Op.eq]: req.body.search.group_code
        //       }

        //     },
        //     // {
        //     //   crop_code: {
        //     //     [Op.in]: req.body.crop_code
        //     //   }

        //     // }

        //   ],
        // // raw:true
        // },
        //         attributes:[
        //          `(
        //           SELECT 
        //    *,
        //    (
        //       SELECT COUNT(*)
        //       FROM reactions AS reaction
        //       WHERE reaction.postId = post.id
        //       AND reaction.type = “Laugh”
        //    ) AS laughReactionsCount
        // FROM posts AS post
        //          )` 
        //         //   // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
        //         //   // [sequelize.fn('DISTINCT', sequelize.col('crop_code')), 'crop_code'],
        //         ]
        // raw:true
      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      // condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];

      //     // if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //     //   condition.where["year"] = element.value;
      //     // }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["group_code"] = element.value;
      //     }
      //     // if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //     //   condition.where["variety_id"] = element.value;
      //     // }
      //     // if (element.columnNameInItemList.toLowerCase() == "id") {
      //     //   condition.where["id"] = element.value;
      //     // }
      //   }
      // }
      // if (req.body.search) {

      //   if (req.body.search.group_code) {
      //     condition.where.group_code = (req.body.search.group_code);
      //   }

      // }
      // let data = await seedMultiplicationRatioModel.findAll(condition
      // include:{
      //   model:cropModel,
      //   // where:{group_code :  req.body.search.group_code}
      //   where:{
      //       [Op.and]: [
      //     {
      //       crop_group_code: {
      //         [Op.substring]: req.body.search.group_code
      //       }

      //     },
      //     // {
      //     //   crop_code: {
      //     //     [Op.in]: req.body.crop_code
      //     //   }

      //     // }

      //   ],
      //   }
      // },
      // where:{

      // }

      //   {
      //   attributes:[[sequelize.literal('DISTINCT "seed_multiplication_ratios".crop_code'), 'seed_multiplication_ratios.crop_code']],
      // }
      // );
      // SELECT crop_code FROM seed_multiplication_ratios  UNION   SELECT crop_code FROM m_crops
      const data = await db.sequelize.query(`SELECT crop_name,crop_code,crop_group_code FROM seed_multiplication_ratios WHERE crop_group_code='A01'  UNION   SELECT crop_name,crop_code,group_code FROM m_crops WHERE group_code='A01' `)



      console.log(data, 'nonMatchingRows');

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


  static getBspcCode = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {


        raw: true,

        where: {
          agency_id: req.body.search.agency_id,

        }
      }


      const data = await userModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {


        },
        raw: false,
        attributes: [
          [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
          // 'crop_code'

          [sequelize.col('crop_code'), 'crop_code'],
        ],

      };
      condition.order = [['crop_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getIndentorStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            attributes: [],
            left: true,


          },


        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],

        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getSeedTestingStateList = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: stateModel,

            left: true,
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name']
          // [sequelize.fn('DISTINCT', sequelize.col('m_state.state_c')), 'state_code'],
        ],
        raw: true,
      }
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']]
      const data = await seedLabTestModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getProjectCoordinatorStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'BR'
              // [sequelize.col('user.user_type')]:'IN'
            }
          },
          {
            model: stateModel,
            left: true,
          },
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code']
        ],
        raw: true

      }

      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBspcStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'BPC'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            left: true,


          },


        ],
        where: {
          [Op.and]: [{ state_id: { [Op.ne]: null } }]
          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name']
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }


      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getMaximumCropNameList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
          }

        ],

        where: {
          group_code: req.body.search.group_code
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],

        ],
        raw: true


      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      let data = await maxLotSizeModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('err', error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getdistinctMaximumCropNameList = async (req, res) => {
    try {
      let condition = {


        where: {
          [Op.and]: [
            {
              group_code: {
                [Op.eq]: req.body.search.group_code
              }

            },
            {
              crop_name: {
                [Op.notIn]: req.body.search.crop_code
              }

            },
            {
              is_active: {
                [Op.eq]: 1
              }

            }
          ]
        },

        // raw:true,

      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      let data = await cropModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('err', error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static deletesmrlistdata = async (req, res) => {
    try {

      seedMultiplicationRatioModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deletemaximumlistdata = async (req, res) => {
    try {

      maxLotSizeModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deleteLabtestlistdata = async (req, res) => {
    try {

      seedLabTestModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getIndentorDistrictList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
            }
          },
          {
            model: districtModel,
            attributes: [],
            left: true,
          },
        ],
        where: {
          state_id: req.body.search.state,
          [Op.and]: [

            {
              district_id: {
                [Op.ne]: null
              }
            },
            // {
            //   district_id: {
            //     [Op.ne]: ""
            //   }
            // }
          ]
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ],
        raw: true
      }
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
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
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getCropdatainseedmutiplicationRatio = async (req, res) => {
    try {
      let condition = {

        where: {
          crop_group_code: req.body.search.group_code

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        // attributes: [
        //   [sequelize.fn('DISTINCT', sequelize.col('crop_group_code')), 'crop_group_code'],
        //   'crop_name','crop_code'
        //   // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
        //   // 'id'
        // ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      // condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      let data = await seedMultiplicationRatioModel.findAndCountAll(condition);


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

  static getIndentorStateSppDetails = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            left: true,


          },


        ],
        where: {

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getIndentorDistrictSppList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: districtModel,
            left: true,


          },


        ],
        where: {
          state_id: req.body.search.state

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
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
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getAgencyDetailsIndentorSppName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },


        ],
        where: {

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'agency_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          'id'
        ],

      }



      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.where.district_id = req.body.search.district_id;
        }
      }
      condition.order = [['agency_name', 'ASC']];

      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getCropNameData = async (req, res) => {
    try {
      let condition = {}
      let data;
      if (req.body.cropName) {

        data = await db.sequelize.query(`SELECT * FROM m_crops where lower(crop_name) LIKE '${req.body.cropName}%'`)
      }

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
  static getCropNameDataAlreadyExit = async (req, res) => {
    try {
      let condition = {}
      if (req.body.search.id) {

        condition = {

          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.cropName),
              ),
              {
                id: {
                  [Op.ne]: req.body.search.id
                }

              }
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],

          },



        }

      }
      else {
        condition = {

          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.cropName),
              ),

              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],

          },



        }
      }




      let data = await cropModel.findAndCountAll(condition);


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
  static getVarietyNameData = async (req, res) => {
    try {
      let condition = {}

      // condition = {

      //   where: {
      //     [Op.and]: [
      //       {
      //         variety_name: {
      //           [Op.like]: '%' + req.body.variety_name + '%'
      //         }

      //       },             
      //     ]
      //   },
      //   attributes:['variety_name']
      // }     
      // let data = await cropVerietyModel.findAndCountAll(condition);
      let data;
      if (req.body.variety_name) {

        data = await db.sequelize.query(`SELECT * FROM m_crop_varieties where lower(variety_name) LIKE '${req.body.variety_name}%'`)
      }
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
  static getOtherData = async (req, res) => {
    try {
      let condition = {
        where: {
          characterstics_id: req.query.characterstics_id

        },

      }





      let data = await otherFertilizerModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getSeedCharactersticsCropGroupData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [
              {
                model: cropGroupModel,
                attributes: [],
              }
            ]
          },

        ],
        where: {
          [Op.or]: [
            {
              crop_code: {
                [Op.ne]: null
              }

            },
            {
              crop_code: {
                [Op.ne]: ""
              }

            }

          ]
        },
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // 'id'

        ],
        group: [
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // [sequelize.col('m_crop_varieties.id'), 'id'],
        ],
        get group() {
          return this._group;
        },
        set group(value) {
          this._group = value;
        },
        // m_crop->m_crop_group
      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (req.body.search.type == 'reporticar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'A' + "%" },
              ]
            }

          } if (req.body.search.user_type == 'HICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          }

          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
      }
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];

      let data = await cropCharactersticsModel.findAndCountAll(condition);
      let filterdata = []
      data.rows.forEach(element => {
        if (element.dataValues.group_code != null) {

          const spaIndex = filterdata.findIndex(item => item.group_code === element.dataValues.group_code);
          if (spaIndex == -1) {
            filterdata.push({
              group_code: element.dataValues.group_code,
              group_name: element.dataValues.group_name

            })
          }
        }

      });


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, filterdata);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBankdetailsData = async (req, res) => {
    try {
      let condition = {
        where: {
          ifsc_code: req.body.search.ifsc_code

        },
        attributes: ['branch_name', 'bank_name']

      }
      let data = await bankDetailsModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBspcDatainCharactersticsSecond = async (req, res) => {
    try {
      const condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BPC'
            }
          }
        ]


      };
      condition.order = [['agency_name','ASC']]
      let data = await agencyDetailModel.findAndCountAll(condition);
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
  static activitiesListSecond = async (req, res) => {
    let returnResponse = {}
    try {
      let condition = {
        attributes: ['id', 'name', 'is_active']
      }
      condition.order = [[sequelize.col('name'), 'ASC']]
      let activitiesData = await db.activitiesModel.findAll(condition);
      if (activitiesData) {
        returnResponse = activitiesData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getIndenterDetailsSecond = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      let isFlagFilter;
      let indenterUserId;
      if (req.body.search && req.body.search.graphType && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: cropModel,
              attributes: [],
              left: true
            },



          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          raw: true,
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            user_id: req.body.search.user_id,
            ...isFlagFilter
          }
        };
      } else {
        condition = {
          include: [
            {
              model: cropModel,
              attributes: [],
              left: true
            },



          ],
          where: {
            user_id: req.body.search.user_id
          },
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          raw: true,
          // where: {
          //   crop_code: {
          //     [Op.like]: req.body.search.crop_type + '%'
          //   }
          // }
        };

      }
      // const sortOrder = req.body.sort ? req.body.sort : 'year';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];
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
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentDataSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterDataIndent = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterDataIndent.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterDataIndent.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterDataIndent.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (req.body.search.crop_code && (req.body.search.crop_code != undefined) && req.body.search.crop_code.length > 0) {
        filterDataIndent.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },

        })
      }
      if (req.body.search && req.body.search.crop_type) {
        condition = {
          include: [
            // {
            //   model: userModel,
            //   attributes: []
            // },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            },
            // {
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },


          ],
          where: {
            [Op.and]: filterDataIndent ? filterDataIndent : [],
            icar_freeze: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },


          },
          raw: true,
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            // [sequelize.literal("Sum(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
            // [sequelize.col("m_crop.crop_name"), "crop_name"],
            // [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          // group:[
          //   [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
          // ]
        }
      }
      else {
        condition = {
          include: [
            // {
            //   model: userModel,
            //   attributes: []
            // },
            // {
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },{
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            },

          ],

          raw: true,
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            // [sequelize.literal("Sum(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
            // [sequelize.col("m_crop.crop_name"), "crop_name"],

          ],
          // group:[
          //   [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
          // ]
          where: {
            [Op.and]: filterDataIndent ? filterDataIndent : [],
            icar_freeze: 1
          }
        }
      }

      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.search.year
      //   }
      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season
      //   }
      //   if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
      //     condition.where.crop_code = {
      //       [Op.in]: req.body.search.crop_code
      //     }
      //   }
      // }
      let page;
      let pageSize;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      }

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.group = [[sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']];
      data = await indentOfBreederseedModel.findAll(condition);

      let cropCodeArray = [];
      data.forEach(ele => {
        if (ele && ele.crop_code) {
          cropCodeArray.push(ele.crop_code);
        }
      });
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let breederId;
      if (req.body && req.body.search) {
        if (req.body.search.graphType === "pd-pc") {

          breederId = {
            breeder_id: req.body.loginedUserid.id
          }
        }
      }

      let productionData;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

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
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              // }
            }
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

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (req.body.search && req.body.search.crop_type) {
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
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
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


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (cropCodeArray && cropCodeArray.length > 0) {
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
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.in]: cropCodeArray
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      else {
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
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {



              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
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
      if (cropCodeArray && cropCodeArray.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: cropCodeArray
          },

        })
      }

      let AllocatedData;
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
      if (req.body.search && req.body.search.crop_type) {

        AllocatedData = await bsp1Model.findAll({

          include: [

            {
              model: db.bsp1ProductionCenterModel,
              attributes: [],
              where: {},
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                }
              },


            }
          ],
          attributes: [

            [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "quantity_of_seed_produced"],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id,
          },
          // where:{
          //   year:req.body.search.year,
          //   season : req.body.search.season,
          //   crop_code:{
          //     [Op.like]:req.body.search.crop_type + "%"
          //   },
          //   user_id: req.body.search.user_id,
          // },

          raw: true

        })
      } else {
        AllocatedData = await bsp1Model.findAll({

          include: [

            {
              model: db.bsp1ProductionCenterModel,
              attributes: [],
              where: {},
            },
            {
              model: cropModel,
              attributes: [],
            },
          ],
          raw: true,
          attributes: [
            [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "quantity_of_seed_produced"],
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id,
          },

          raw: true

        })
      }
      if (AllocatedData && (AllocatedData.length > 0)) {
        AllocatedData.forEach(elem => {

          data.forEach((ele, i) => {
            // console.log(ele,'eleele')
            if (ele.crop_code == elem.crop_code) {
              data[i].allocated = elem && elem.quantity_of_seed_produced ? elem.quantity_of_seed_produced : 0
            }

          })
        })
      }
      productionData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].production = elem.production
          }

        })
      })


      // AllocatedData.forEach(elem => {

      //   data.forEach((ele, i) => {
      //     // console.log(ele,'eleele')
      //     if (ele.crop_code == elem.crop_code) {
      //       data[i].allocated = elem.allocated ? elem.allocated : 0
      //     }

      //   })
      // })

      let data1 = await db.bsp5bModel.findAll({
        include: [
          {
            model: cropModel,
            attributes: [],
            // where: {
            //   breeder_id: req.body.loginedUserid.id
            // }
          }
        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          // [sequelize.col('lifting_quantity'), 'total_lifting'],
          [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
          // [sequelize.col('crop_code'), 'crop_code']
        ],
        group: [
          [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
          // [sequelize.col('crop_code'), 'crop_code']
          // [sequelize.col('id'), 'id'],
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      data1.forEach(item => {
        data.forEach((elem, i) => {
          if (elem.crop_code == item.crop_code) {
            data[i].total_lifting = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
          }
        })
      })
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentDataVarietyforpdpc = async (req, res) => {
    let data = {};
    try {
      let filterData = [{ icar_freeze: 1 }];
      if (req.body.search && req.body.search.crop_type) {
        filterData.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        })
      }

      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],
            where:
            {
              breeder_id: req.body.loginedUserid.id
            }
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          // [sequelize.fn('DISTINCT', ), 'crop_code'],
          // [sequelize.col('indent_of_breederseeds.crop_code'),'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
        ],

        where: {
          [Op.and]: filterData ? filterData : [],
          icar_freeze: 1

        },
        // where: {
        //   [Op.and]: [{
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     icar_freeze: 1
        //   }
        //   ]

        // },
        raw: true
      };
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
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
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   condition.where.crop_code = {
        //     [Op.in]: (req.body.search.crop_code)
        //   };
        // }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      ];
      let data = await indentOfBreederseedModel.findAll(condition);

      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   filterData1.push({
        //     crop_code: {
        //       [Op.in]: (req.body.search.crop_code)
        //     }
        //   })
        // }
        if (req.body.search.crop_code) {
          filterData1.push({
            crop_code: {
              [Op.eq]: (req.body.search.crop_code)
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          })
        }
      }
      let varietyArr = [];
      if (data && data.length > 0) {

        data.forEach(ele => {
          varietyArr.push(ele && ele.variety_id ? ele.variety_id : '')
        })
      }
      let liftedData;
      if (varietyArr && varietyArr.length > 0) {

        liftedData = await bsp5bModel.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.variety_id')), 'variety_id'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.col('bsp_5_b.variety_id'), 'variety_id']
          ],
          where: {
            // ... filterData1,
            [Op.and]: filterData1 ? filterData1 : [],
            // variety_id: {
            //   [Op.in]: varietyArr
            // }
          },

          // where: {
          //   ...filterData1,

          //  [Op.and]:filterData1 ? filterData1 :[],
          //  ...varietyArr

          // [Op.in]:variety_id :varietyArr
          // },
          raw: true,

        })
      }
      else {
        liftedData = await bsp5bModel.findAll({
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            // ...varietyArr
          },
          raw: true,

        })
      }

      let productionData = await lotNumberModel.findAll({
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
            // wher: {
            //   breeder_id: req.body.loginedUserid.id
            // }
          }
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"]
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('lot_number_creations.variety_id')]],
        // order:[['indent_quantity', 'DESC']]
      });



      productionData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            data[i].production = elem.production ? elem.production : '0'
          }

        })
      })

      let AllocatedData;
      let filterData2 = []
      AllocatedData = await bsp1Model.findAll({
        include: [

          {
            model: db.bsp1ProductionCenterModel,
            attributes: [],
            where: {},
          },

          {
            model: varietyModel,
            attributes: []

          }
        ],
        attributes: [
          [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"],
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        group: [
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        where: {
          [Op.and]: filterData1 ? filterData1 : [],
          user_id: req.body.loginedUserid.id,
        },


        raw: true

      })

      if (AllocatedData && (AllocatedData.length > 0)) {
        AllocatedData.forEach(elem => {

          data.forEach((ele, i) => {
            if (ele.variety_id == elem.id) {
              data[i].allocated = elem && elem.quantity_of_seed_produced ? elem.quantity_of_seed_produced : 0
            }

          })
        })
      }

      if (liftedData && liftedData.length > 0) {
        liftedData.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.variety_id == item.variety_id) {
              data[i].lifting_qty = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
            }
          })

        })
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndenterDetailsforPdpc = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      if (req.body.search && req.body.search.crop_type) {
        if (req.body.loginedUserid.user_type == 'SD') {
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
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: ['id'],
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze: 1
            }
          };
        } else {
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
                where: {
                  user_id: req.body.loginedUserid.id
                },
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze:1
            }
          };
        }

      } else {
        if (req.body.loginedUserid.user_type == 'SD') {

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
              is_indenter_freeze: 1
            }
            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        } else {
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
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: ['id'],
                left: true
              }
            ],

            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        }
      }
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
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
      if (req.body.search.graphType == 'pdpc') {

        condition = {
          // where: {
          //   user_id: req.body.loginedUserid.id
          // },
          include: [
            // {
            //   model: cropModel,
            //   where: {
            //     breeder_id: req.body.loginedUserid.id
            //   },
            //   attributes: ['crop_name', 'crop_code']
            // },
            {
              model: cropModel,
              attributes: [],
              // where:{
              //   breeder_id:req.body.loginedUserid.id
              // }

            }
          ],
          where: {
            user_id: req.body.loginedUserid.id
          },
          // where: {
          //   icar_freeze: 1
          // }
        }
      } else {
        condition = {

          include: [
            {
              model: cropModel,


              attributes: ['crop_name', 'crop_code']
            }
          ],
          where: {
            user_id: req.body.loginedUserid.id
          },
          // where: {
          //   icar_freeze: 1
          // }
        }

      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.search.year
      //   }
      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season
      //   }
      //   if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
      //     condition.where.crop_code = {
      //       [Op.and]: {
      //         [Op.in]: req.body.search.crop_code
      //       }
      //     }
      //   }
      // }
      // condition.group = [['user.name'], ['user.id']];
      data = await db.breederCropModel.findAll(condition);
      // if (req.body.search.graphType == 'pdpc') {

      // } else {
      //   data = await bsp1Model.findAll(condition);
      // }





      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorCropFilterforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
      if (req.body.search && req.body.search.graphType == 'pdpc') {

        condition = {
          where: {
            user_id: req.body.loginedUserid.id
          },
          include: [
            {
              model: cropModel,

              attributes: []
            },

            // {
            //   model: bsp1Model,

            //   attributes: []
            // },
          ],
          // where: {
          //   icar_freeze: 1
          // },
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ],
          raw: true
        }
      } else {
        condition = {
          where: {
            user_id: req.body.loginedUserid.id
          },

          include: [
            {
              model: cropModel,
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              // },
              attributes: []
            },
            // {
            //   model: bsp1Model,
            // where:{
            //   user_id:req.body.loginedUserid.id
            // },
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ],
          raw: true
        }
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
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.and]: {
              [Op.in]: req.body.search.crop_code
            }
          }
        }
      }
      // condition.group = [['user.name'], ['user.id']];

      // if (req.body.search && req.body.search.graphType == 'pdpc') {

      //   data = await indentOfBreederseedModel.findAll(condition);
      // } else {

      // }
      data = await db.breederCropModel.findAll(condition);





      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorforPdpcSecond = async (req, res) => {
    let condition = {}
    let filterDataIndent = [];
    if (req.body.search) {
      if (req.body.search.crop_type) {
        filterDataIndent.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        })
      }
      if (req.body.search.year) {
        filterDataIndent.push({
          year: {
            [Op.eq]: req.body.search.year
          },
        })

      }
      if (req.body.search.season) {
        filterDataIndent.push({
          season: {
            [Op.eq]: req.body.search.season
          }
        });
      }

    }
    if (req.body.search.crop_code && (req.body.search.crop_code != undefined) && req.body.search.crop_code.length > 0) {
      filterDataIndent.push({
        crop_code: {
          [Op.in]: req.body.search.crop_code
        },

      })
    }
    if (req.body.search && req.body.search.crop_type) {
      condition = {
        include: [
          {
            model: userModel,
            attributes: []
          },
          // {
          //   model: bsp1Model,
          //   wher: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // },

          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }
        ],
        where: {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },

        },
        raw: true,
        attributes: [
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
        ],
        group: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
        ],
        where: {
          [Op.and]: filterDataIndent ? filterDataIndent : [],
          icar_freeze: 1
        },
        require: true,
      }
    }
    else {
      condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            require: true,
          },

          // {
          //   model: bsp1Model,
          //   wher: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // },
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }

        ],

        raw: true,
        attributes: [
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
        ],
        group: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
        ],
        require: true,
        where: {
          [Op.and]: filterDataIndent ? filterDataIndent : [],
          icar_freeze: 1
        }
      }

    }
    // if (req.body.search) {
    //   if (req.body.search.year) {
    //     condition.where.year = req.body.search.year
    //   }
    //   if (req.body.search.season) {
    //     condition.where.season = req.body.search.season
    //   }
    //   if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
    //     condition.where.crop_code = {
    //       [Op.and]: {
    //         [Op.in]: req.body.search.crop_code
    //       }
    //     }
    //   }
    // }
    // condition.group = [['user.name'], ['user.id']];

    let data = await indentOfBreederseedModel.findAll(condition);

    let allocatedData = [];
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
      if (req.body.search.crop_code) {
        filterData.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          }
        });
      }

    }
    allocatedData = await bsp1Model.findAll({
      include: [
        {
          model: db.bsp1ProductionCenterModel,
          attributes: []

        },
        {
          model: indentOfBreederseedModel,
          attributes: []
        }
      ],
      where: {
        [Op.and]: filterData ? filterData : [],
        user_id: req.body.loginedUserid.id
      },
      attributes: [
        [sequelize.col('indent_of_breederseed.user_id'), 'user_id'],
        [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced']
        // [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],
        // bsp1_production_centers.quantity_of_seed_produced

      ],

      raw: true,
      // group:[
      //   [sequelize.col('indent_of_breederseed.user_id'),'user_id'],
      //   [sequelize.col('bsp_1s.id'),'id'],
      // ]
    })
    let allocate;
    if (allocatedData && allocatedData.length > 0) {
      allocate = seedhelper.sumofDuplicateData(allocatedData)
    }
    if (allocate && allocate.length > 0) {
      if (data && data.length > 0) {
        allocate.forEach(item => {
          data.forEach((el, i) => {
            if (el.id == item.user_id) {

              data[i].allocated = item && item.quantity_of_seed_produced ? parseFloat(item.quantity_of_seed_produced) : 0
            }
          })
        })
      }
    }
    let bspliftingQty = await db.bsp5bModel.findAll({
      include: [
        {
          model: cropModel,
          where: {
            breeder_id: req.body.loginedUserid.id
          },
          attributes: [],

        },
        {
          model: indentOfBreederseedModel,

          attributes: [],

        }
      ],
      attributes: [
        [sequelize.col('bsp_5_b.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
        [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
        [sequelize.col('indent_of_breederseed.user_id'), 'user_id']
      ],
      // group:[
      //   'indent_of_breederseed_id'
      // ],
      where: { [Op.and]: filterData ? filterData : [] },
      raw: true
    }
    );
    let liftingdata;
    if (bspliftingQty && bspliftingQty.length > 0) {
      liftingdata = seedhelper.sumofDuplicateDataIndenter(bspliftingQty)
    }
    if (liftingdata && liftingdata.length > 0) {
      if (data && data.length > 0) {
        liftingdata.forEach(item => {
          data.forEach((el, i) => {
            if (el.id == item.user_id) {

              data[i].lifting_quantity = item && item.lifting_quantity ? parseFloat(item.lifting_quantity) : 0
            }
          })
        })
      }
    }
    let allocationData;
    allocationData = await allocationToIndentorSeed.findAll(
      {
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData ? filterData : []
        },
        attributes: [
          //  [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'qty'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.indent_of_breeder_id'), 'user_id'],

        ],

        raw: true
      },

    )
    let allocationDataSum;
    if (allocationData && allocationData.length > 0) {
      allocationDataSum = seedhelper.sumofDuplicateDataAllocatedQty(allocationData)
    }
    if (allocationDataSum && allocationDataSum.length > 0) {
      if (data && data.length > 0) {
        allocationDataSum.forEach(ele => {
          data.forEach((item, i) => {
            console.log(ele, 'ele.qty')
            if (item.id == ele.user_id) {
              data[i].allocatedQtySecond = ele && ele.qty ? parseFloat(ele.qty) : 0
            }
          })
        })
      }
    }


    // console.log(allocate,'allocate')
    response(res, status.DATA_AVAILABLE, 200, data)
  }

  static getChartAllIndentorVarietyforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData2.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData2.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            {
              model: cropModel,
              // left:true,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            }
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],

          where: {
            [Op.and]: filterData2 ? filterData2 : [],
            user_id: req.body.search.user_id,
            icar_freeze: 1

          },
          // where: {
          //   crop_code: {
          //     [Op.like]: req.body.search.crop_type + '%'
          //   },
          //   year: req.body.search.year,
          //   season: req.body.search.season,
          //   user_id: req.body.search.user_id

          //   // crop_code:req.body.search.crop_code,

          //   // where:{
          //   // },
          //   // icar_freeze: 1
          // },
          raw: true
        };
      } else {
        condition = {
          include: [

            {
              model: userModel,
              attributes: [],
              where: {}
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            }
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],

          where: {
            [Op.and]: filterData2 ? filterData2 : [],
            user_id: req.body.search.user_id,
            icar_freeze: 1

          },
          raw: true
        };
      }



      data = await indentOfBreederseedModel.findAll(condition);
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
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      let allocatedData = []
      allocatedData = await bsp1Model.findAll({
        include: [
          {
            model: db.bsp1ProductionCenterModel,
            attributes: []

          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              user_id: req.body.search.user_id,
            }
          },
          {
            model: cropModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          // [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],

        // attributes:[
        //    [sequelize.col('m_crop_variety.id'),'varietyid'],
        //   [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'),'quantity_of_seed_produced']
        //   // [sequelize.col('m_crop_variety.id'),'id'],
        //   // [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],

        // ],
        // group:[
        //   [sequelize.col('m_crop_variety.id'),'id'],
        // ],
        where: {
          [Op.and]: filterData ? filterData : [],
          user_id: req.body.loginedUserid.id
        },
        raw: true
      })
      let allocate;
      if (allocatedData && allocatedData.length > 0) {
        allocate = seedhelper.sumofDuplicateDataVariety(allocatedData)
      }
      if (allocate && allocate.length > 0) {
        if (data && data.length > 0) {
          allocate.forEach(item => {
            data.forEach((el, i) => {
              if (el.crop_code == item.crop_code) {
                console.log(item.quantity_of_seed_produced, 'allocate')
                data[i].allocated = item && item.quantity_of_seed_produced ? parseFloat(item.quantity_of_seed_produced) : 0
              }

            })
          })

        }
      }
      let liftedQty;
      liftedQty = await bsp5bModel.findAll({
        include: [
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              user_id: req.body.search.user_id,

            },
            include: [
              {
                model: cropModel,
                attributes: [],
                where: {
                  breeder_id: req.body.loginedUserid.id

                }
              }
            ],
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],

          },
        ],

        where: {
          [Op.and]: filterData ? filterData : []

        },
        attributes: [
          // [sequelize.col('lifting_quantity'),'lifting_quantity'],
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],

        group: [
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],
        raw: true

      })
      if (liftedQty && liftedQty.length > 0) {
        if (data && data.length > 0) {
          liftedQty.forEach(el => {
            data.forEach((item, i) => {
              if (item.crop_code == el.crop_code) {
                data[i].lifting_quantity = el && el.total_lifting ? parseFloat(el.total_lifting) : 0
              }
            })
          })
        }
      }
      let allocationData;
      allocationData = await allocationToIndentorSeed.findAll(
        {
          include: [
            {
              model: cropModel,
              attributes: []
            },
            {
              model: allocationToIndentorProductionCenterSeed,
              where: {
                indent_of_breeder_id: req.body.search.user_id

              },
              attributes: []
            }
          ],
          where: {
            [Op.and]: filterData ? filterData : []
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
            //  [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
            //  [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'),'qty'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          raw: true
        },

      )
      if (allocationData && allocationData.length > 0) {
        if (data && data.length > 0) {
          allocationData.forEach(ele => {
            data.forEach((item, i) => {

              if (item.crop_code == ele.crop_code) {
                data[i].allocatedQtySecondcrop = ele && ele.qty ? parseFloat(ele.qty) : 0
              }
            })
          })
        }
      }
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getVarietyCategoryList = async (req, res) => {
    try {
      const varietyCategory = await varietyCategoryModel.findAll({
      });
      return response(res, status.SUCCESS, 200, varietyCategory, {
        message: "variety Category list retrieve successfully."
      });

    } catch (error) {
      console.error("variety Category list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static getCharactersticAgroRegionMapingData = async (req, res) => {
    try {
      const agroRegionData = await db.mCharactersticAgroRegionMappingModel.findAll();
      if(agroRegionData.length){
        return response(res, status.SUCCESS, 200, agroRegionData);
      }else{
        return response(res, status.SUCCESS, 201, []);
      }
    } catch (error) {
      console.error("variety Category list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
}

module.exports = SeedController;
