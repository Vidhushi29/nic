const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const Sequelize = require('sequelize');
const { agencyDetailModel, cropModel, designationModel, indenterModel, nucleusSeedAvailabityModel, userModel, varietyModel, seasonModel, breederCropModel, breederCropsVerietiesModel } = require('../models');

class IndenterController {
  static getBreederSeedsSubmisionList = async (req, res) => {
    try {
      let icarStatus;
      if(req.body.loginedUserid && req.body.loginedUserid.user_type === "BR"){
        icarStatus = {
          icar_freeze:1
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            left: true,
            attributes: ['id', 'variety_name', 'release_date','introduce_year'],
          },
          {
            model: userModel,
            left: true,
            attributes: ['id', 'name'],
            where: {
              is_active: '1'
            },
            include: [{
              model: agencyDetailModel,
              left: true,
              attributes: ['id', 'agency_name'],
              where: {
                is_active: '1'
              }
            }]
          },
          {
            attributes: ['season'],
            model: seasonModel,
            left: true,
          }
        ],
        where: {
        ...icarStatus
        },
        raw: true,
        nest: true
      }
      // condition.where.icar_freeze = 1;
      let { page, pageSize, search, userId } = req.body;

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
          else if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          else if (element.columnNameInItemList.toLowerCase() == "season.value") {
            condition.where["season"] = element.value;
          }
          else if (1) {
            // condition.where["icar_freeze"] = 1;
          }
          else {
            condition.where[element.columnNameInItemList] = element.value;
          }
        }
      }

      condition.order = [['id', 'DESC']];
      let data = await indenterModel.findAndCountAll(condition);
      const uniqueRecords = [];
      const uniqueUsers = [];
      const records = [];
      let indentors = [];
      data.rows.forEach((row, index) => {
        const uniqueRecord = uniqueRecords.includes(row.variety_id);
        // const uniqueUser = uniqueUsers.includes(row.user.id);
        if (!uniqueRecord) {
          // console.log('uniqueRecord 85', uniqueRecord);
          // console.log('uniqueUser 86', uniqueUser);
          uniqueRecords.push(row.variety_id);
          uniqueUsers.push(row.user.id);
          indentors = [];
          indentors.push({
            id: row.id,
            indent_quantity: row.indent_quantity,
            user: row.user,
          });
          row.indentors = indentors;
          records.push(row);
        }
        // if (uniqueUser && !uniqueRecord) {
        //   console.log('uniqueRecord 99', uniqueRecord);
        //   console.log('uniqueUser 100', uniqueUser);
        //   uniqueRecords.push(row.variety_id);
        //   indentors = [];
        //   indentors.push({
        //     id: row.id,
        //     indent_quantity: row.indent_quantity,
        //     user: row.user,
        //   });
        //   row.indentors = indentors;
        //   records.push(row);
        // }
        // if (uniqueRecord && !uniqueUser) {
        //   console.log('uniqueRecord 112', uniqueRecord);
        //   console.log('uniqueUser 113', uniqueUser);
        //   uniqueUsers.push(row.user.id);
        //   indentors.push({
        //     id: row.id,
        //     indent_quantity: row.indent_quantity,
        //     user: row.user,
        //   });
        // }
        else {
          // console.log('uniqueRecord 122', uniqueRecord);
          // console.log('uniqueUser 123', uniqueUser);/
          const index = records.findIndex(el => el.variety_id === row.variety_id);
          // console.log('index', records[index]);
          records[index].indentors.push({
            id: row.id,
            indent_quantity: row.indent_quantity,
            user: row.user,
          });
        }
      });
      data.rows = await this.productionCenterNameAccToBreeder(records, userId);
      // data.rows = records;
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

  static productionCenterNameAccToBreeder = async (records, userId) => {
    console.log('records', records);
    const getBreederCrop = await Promise.all(records.map(async data => {
      const breederCrops = await breederCropModel.findAll({
        attributes: ['production_center_id'],
        include: [
          {
            model: breederCropsVerietiesModel,
            left: true,
            attributes: [],
            where: {
              variety_id: data.variety_id,
            }
          },
          {
            model: userModel,
            left: true,
            attributes: ['id','name'],
            include: {
              attributes: ['id', 'address','agency_name','user_id', 'contact_person_name'],
              model: agencyDetailModel,
              left: true,
              include: {
                attributes: ['name'],
                model: designationModel,
                left: true,
              }
            }
          }
        ],
        where: {
          user_id: userId,
          crop_code: data.crop_code,
          season: data.season,
          year: data.year
        },
      });
      data.productionCenters = breederCrops.map(el=> el.user);
      return data;
    }));
    return getBreederCrop;
  }

  static fetchYear = async (req, res) => {
    try {
      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.year')), 'year'],
        ],
        raw: true,
        where:{
          icar_freeze:1
        },
        order: [['year', 'DESC']]
      });

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCropByYear = async (req, res) => {
    try {
      const year = Number(req.query.year);
      const season = req.query.season
      let seasonFilter = {}
      if (season) {
        seasonFilter = { season: season }
      }
      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
        ],

        where: {
          year: year,
          ...seasonFilter,
          icar_freeze:1
          // season: season
        },
        include: [
          {
            model: cropModel,
            left: true,
            attributes: ['id', 'crop_name'],
          },
        ],
        order: [['crop_code', 'ASC']],
        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchSeasonByCrop = async (req, res) => {
    try {
      const year = Number(req.query.year);

      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.season')), 'season'],
        ],

        include: {
          attributes: ['season'],
          model: seasonModel,
          left: true,
        },

        where: {
          year: year,
          icar_freeze:1
        },

        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCropGroup = async (req, res) => {
    try {
      const year = Number(req.query.year);
      const season = req.query.season;

      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.group_code')), 'group_code'],

          'group_name'
        ],

        where: {
          year: year,
          season: season,
          icar_freeze:1
        },

        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCropNameByYearAndSeason = async (req, res) => {
    try {
      const year = Number(req.query.year);
      const season = req.query.season;
      const userId = req.query.userId;
      const group_code = req.query.cropGroup;
      const icar_freeze = req.query.icar_freeze;
      console.log('icar_freeze==',year);
      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],

          'crop_name'
        ],

        where: {
          year,
          season,
          group_code,
          icar_freeze
        },
        raw: true,
      });
      let crops = [];
      await Promise.all(data.map(async el => {
        const cropCode = await cropModel.findOne({
          where: {
            crop_code: el.crop_code,
            crop_name: el.crop_name,
            breeder_id: userId,
          },
          raw: true,
        });
        if (cropCode && cropCode.crop_code === el.crop_code) {
          crops.push(el);
        }
      }));
      response(res, status.DATA_AVAILABLE, 200, crops);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchVarietyForSeedTestingResult = async (req, res) => {
    try {
      const { year, season, crop_code } = req.body;

      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
        ],

        include: {
          attributes: ['variety_code', 'variety_name'],
          model: varietyModel,
          left: true,
        },

        where: {  
          icar_freeze:1,
          year: Number(year),
          season: season,
          crop_code: crop_code,
          
        },

        raw: true,
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCropName = async (req, res) => {
    try {
      const year = Number(req.query.year);
      const season = req.query.season;
      const cropGroup = req.query.cropGroup;

      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],

          'crop_name'
        ],

        where: {
          year: year,
          season: season,
          group_code: cropGroup,
          icar_freeze:1,
        },

        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCrop = async (req, res) => {
    try {
      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
        ],
        where:{
          icar_freeze:1
        },
        include: [
          {
            model: cropModel,
            left: true,
            attributes: ['id', 'crop_name'],
          },
        ],
        order: [['crop_code', 'ASC']],
        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchCropVarieties = async (req, res) => {
    try {
      const year = Number(req.query.year);
      const season = req.query.season;
      const cropGroup = req.query.cropGroup;
      const cropCode = req.query.cropCode;

      const data = await indenterModel.findAll({

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],

          'variety_id'
        ],
        include: {
          model: varietyModel,
          left: true,
          attributes: ['id', 'variety_name', 'variety_code'],
        },
        where: {
          year: year,
          season: season,
          group_code: cropGroup,
          crop_code: cropCode,
        },

        raw: true,
        nest: true,
      });
      const row = data.map(element => element.m_crop_variety);
      response(res, status.DATA_AVAILABLE, 200, row);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static productionCenterName = async (req, res) => {
    try {
      const { userId } = req.query;
      console.log('userId', userId);
      const data = await userModel.findAll({
        attributes: ['id', 'name'],
        include: [
          {
            model: agencyDetailModel,
            left: true,
            attributes: ['id', 'agency_name','contact_person_name', 'address'],
            include: [
              {
                model: designationModel,
                left: true,
                attributes: ['name']
              },
            ],
          },
        ],
        where: {
          // created_by: userId,
          user_type: "BPC",
        },
        order: [['id', 'ASC']],
      });
      console.log('data', data);

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static fetchNucleusSeed = async (req, res) => {
    try {
      const { userId, varietyId } = req.query;
      const data = await nucleusSeedAvailabityModel.findOne({
        attributes: ['id', 'quantity'],
        where: {
          user_id: userId,
          variety_id: varietyId,
        },
        order: [['id', 'ASC']],
      });
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static getCropGroup = async (req, res) => {
    try {
      const data = await indenterModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('indent_of_breederseeds.group_code')), 'group_code'],

          'group_name'
        ],
        order: [['group_name', 'ASC']],
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

}
module.exports = IndenterController;