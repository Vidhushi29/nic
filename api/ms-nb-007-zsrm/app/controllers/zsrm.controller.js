require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const paginateResponse = require("../_utility/generate-otp");
const { raw } = require('body-parser');
const db = require("../models");
const { cloneDeep } = require('sequelize/lib/utils');
const indenterModel = db.indenterModel;
const agencyDetailModel = db.agencyDetailModel
const userModel = db.userModel
const stateModel = db.stateModel;
const seasonModel = db.seasonModel;
const cropGroupModel = db.cropGroupModel;
const cropVerietyModel = db.cropVerietyModel;
const varietyModel = db.varietyModel;
const cropDataModel = db.cropModel
const districtModel = db.districtModel;
const zsemreqfsModel = db.zsrmReqFs;
const zsrmreqqsModel = db.zsrmReqQs;
const zsrmreqqsdistModel = db.zsrmReqQsDistWise;
const cropcharactersModel = db.cropCharactersticsModel;
const srpModel = db.srpModel;
const srrModel = db.srrModel;
const zsrmbstofsModel = db.ZsrmBsToFs; //
//ZSRM requriement for FS 

exports.getCropList = async (req, res) => {
  try {
    const cropList = await cropDataModel.findAll({
      where: { is_active: 1},
      attributes: ['id', 'crop_code', 'crop_name', 'srr',],
      order: [['crop_name', 'ASC']]
    });
    console.log(cropList);

    if(cropList.length > 0) {

   return  response(res, status.DATA_AVAILABLE, 200, cropList);
    }
    else {
      return  response(res, status.DATA_NOT_AVAILABLE, 501, []);
    }
  }
  catch (error) {
    return   response(res, status.UNEXPECTED_ERROR, 501);
  }
}

exports.getVarietyList = async (req, res) => {
  try {
    const crop_code =req.query.crop_code;
    console.log(crop_code);
   const varietyList = await varietyModel.findAll({
  include: [
    {
      model: cropcharactersModel,
      attributes: []
    },
  ],
  where: { is_active: 1, crop_code: crop_code },
  attributes: [
    'id', 
    'variety_code', 
    'variety_name', 
    'status', 
    'developed_by',
    
    // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
    [
      sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
      'not_date_substring'
    ],
    
    // // CASE statement for 'matuarity_day_from' field
    [
      sequelize.literal(`
        CASE
          WHEN "matuarity_day_from" = '1' THEN 'Early'
          WHEN "matuarity_day_from" = '2' THEN 'Medium'
          WHEN "matuarity_day_from" = '3' THEN 'Late'
          WHEN "matuarity_day_from" = '4' THEN 'Perennial'
          ELSE 'NA'
        END
      `),
      'maturity_type'
    ],
    
    // CASE statement for 'is_notified' field
    [
      sequelize.literal(`
        CASE
          WHEN "is_notified" = 1 THEN 'Notified'
          ELSE 'Non-Notified'
        END
      `),
      'notification_status'
    ]
  ],
  order: [['variety_name', 'ASC']]
});
    console.log(varietyList);

    if(varietyList.length > 0) {

   return  response(res, status.DATA_AVAILABLE, 200, varietyList);
    }
    else {
      return  response(res, status.DATA_NOT_AVAILABLE, 501, []);
    }
  }
  catch (error) {
    return   response(res, status.UNEXPECTED_ERROR, 501, error.message);
  }
}


exports.getVarietyData = async (req, res) => {
  try {
    const variety_code =req.query.variety_code;
    console.log(crop_code);
   const varietyData = await varietyModel.findOne({
  include: [
    {
      model: cropcharactersModel,
      attributes: []
    },
  ],
  where: { is_active: 1, variety_code: variety_code },
  attributes: [
    'id', 
    'variety_code', 
    'variety_name', 
    'status', 
    'developed_by',
    
    // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
    [
      sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
      'not_date_substring'
    ],
    
    // // CASE statement for 'matuarity_day_from' field
    [
      sequelize.literal(`
        CASE
          WHEN "matuarity_day_from" = '1' THEN 'Early'
          WHEN "matuarity_day_from" = '2' THEN 'Medium'
          WHEN "matuarity_day_from" = '3' THEN 'Late'
          WHEN "matuarity_day_from" = '4' THEN 'Perennial'
          ELSE 'NA'
        END
      `),
      'maturity_type'
    ],
    
    // CASE statement for 'is_notified' field
    [
      sequelize.literal(`
        CASE
          WHEN "is_notified" = 1 THEN 'Notified'
          ELSE 'Non-Notified'
        END
      `),
      'notification_status'
    ]
  ],
  order: [['variety_name', 'ASC']]
});

    if(varietyData) {

   return  response(res, status.DATA_AVAILABLE, 200, varietyData);
    }
    else {
      return  response(res, status.DATA_NOT_AVAILABLE, 404, []);
    }
  }
  catch (error) {
    return   response(res, status.UNEXPECTED_ERROR, 501, error.message);
  }
}

exports.saveZsrmReqFs = async(req, res) => {
  
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type="";
    let unit= "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
       body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }
    
    let recordExist = await zsemreqfsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
      },
    });
    if(recordExist) {
      return response(res, "Record already exist", 409, {});
    }
   if ((cropExist.crop_code).slice(0, 1) == 'A') {
    crop_type = 'agriculture';
    unit = 'qt';
   }
   else if ((cropExist.crop_code).slice(0, 1) == 'H') {
    crop_type = 'horticulture'
    unit = 'kg';
   }
   console.log("crop_type:", crop_type);
    console.log("unit:", unit);

    let state = await agencyDetailModel.findOne({
       where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    const total = (body.ssc +  body.doa + body.sau +  body.nsc +  body.sfci + body.pvt + body.others) ;

    let data = await zsemreqfsModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      req: body.req,
      ssc: body.ssc,
      doa: body.doa,
      sau: body.sau,
      nsc: body.nsc,
      sfci: body.sfci,
      pvt: body.pvt,
      others: body.others,
      total: total,
      shtorsur: total - body.req,
      remarks: body.remarks,
      state_id: state.state_id,
         
    })
    console.log("data added", data);
  if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

exports.updateZsrmReqFsById = async(req, res) => {
  
  try {
    const body = req.body;
    const recordExist = await zsemreqfsModel.findOne({where: {id: req.params.id,is_active:true, user_id:body.loginedUserid.id}});
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await zsemreqfsModel.update({ req: body.req,
      ssc: body.ssc,
      doa: body.doa,
      sau: body.sau,
      nsc: body.nsc,
      sfci: body.sfci,
      total: (body.ssc +  body.doa + body.sau +  body.nsc +  body.sfci),
      shtorsur: (body.req - (body.ssc +  body.doa + body.sau +  body.nsc +  body.sfci)),
      pvt: body.pvt,
      others: body.others,
      remarks: body.remarks,
    updated_at:Date.now()},
    {
      where: {
        id: req.params.id,
      },
    },). then(() => response(res, status.DATA_UPDATED, 200, {}) )
    .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

} catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

exports.getZsrmReqFsById = async(req, res) => {
  
  try {
    const body = req.body;
    const recordExist = await zsemreqfsModel.findOne({where: {id: req.params.id,is_active:true, user_id:body.loginedUserid.id}});
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    
    return response(res, status.DATA_AVAILABLE, 200, recordExist)

} catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

exports.deleteZsrmReqFsById = async (req, res) => {
  try {

    const data = await zsemreqfsModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id}});

    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await zsemreqfsModel.update({ is_active: false,  deletedAt: Date.now()},
    {
      where: {
        id: req.params.id,
      },
    },). then(() => response(res, status.DATA_DELETED, 200, {}) )
    .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 500)
  }
}

//view result on the basis of year and season
exports.viewZsrmReqFsAll = async(req, res) => { 
  
  try {
    // const body = req.body;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

     // Calculate offset based on page and limit
     const offset = (page - 1) * limit;


    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model:stateModel,
          attributes: ['state_name']
        },
        {
          model:userModel,
          attributes: ['name']
        }
      ],
      where: {
      year: req.query.year,
      season: req.query.season,
      user_id: req.body.loginedUserid.id,
      is_active: true
    },

    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel,'state_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_type', 'is_active' ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset,    // Skip records based on page

    });
    console.log("data found", data);
    
 if (data.length > 0) {

    const result = data.map((item)=>{return {     year: item.year,
      season: item.season,
      user_id: item.user_id,
      crop_name: item.m_crop.crop_name,
      variety_name: item.m_crop_variety.variety_name,
      state_name: item.m_state.state_name,
      user_name: item.user.name,
      unit: item.unit,
      req: parseFloat(item.req),
      ssc: parseFloat(item.ssc),
      doa: parseFloat(item.doa),
      sau: parseFloat(item.sau),
      nsc: parseFloat(item.nsc),
      sfci: parseFloat(item.sfci),
      total: parseFloat(item.total),
      shtorsur: parseFloat(item.shtorsur),
      pvt: parseFloat(item.pvt),
      others: parseFloat(item.others),
      remarks: item.remarks,
    }
  });

    // Get total records for pagination
    const totalRecords = await db.zsrmReqFs.count({
      where: {
        year: req.query.year,
        season: req.query.season,
        user_id: req.body.loginedUserid.id,
        is_active: true
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
} 
//view result on the basis of year and season crop
exports.viewZsrmReqFsCrop = async(req, res) => {
  
  try {
    //const body = req.body;
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }


    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: req.query.crop_code,
      },
    });
    console.log(
      req.query.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model:stateModel,
          attributes: ['state_name']
        }, {
          model:userModel,
          attributes: ['name']
        }
      ],
      where: {
      year: req.query.year,
      season: req.query.season,
      crop_code: req.query.crop_code,
      user_id: req.body.loginedUserid.id,
      is_active: true
    },
    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],


    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active' ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset,    // Skip records based on page
    });
    console.log("data found", data);
    
    if (data.length > 0) {

      const result = data.map((item)=>{return {     year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name:item.user.name,
        unit: item.unit,
        req: parseFloat(item.req),
        ssc: parseFloat(item.ssc),
        doa: parseFloat(item.doa),
        sau: parseFloat(item.sau),
        nsc: parseFloat(item.nsc),
        sfci: parseFloat(item.sfci),
        total: parseFloat(item.total),
        shtorsur: parseFloat(item.shtorsur),
        pvt: parseFloat(item.pvt),
        others: parseFloat(item.others),
        remarks: item.remarks,
      }
    })
       // Get total records for pagination
    const totalRecords = await db.zsrmReqFs.count({
      where: {
        year: req.query.year,
        season: req.query.season,
        user_id: req.body.loginedUserid.id,
        crop_code: req.query.crop_code,
        is_active: true
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
    
}
//view result on the basis of year and season crop season
exports.viewZsrmReqFsCropVariety = async(req, res) => {
  
  try {
   // const body = req.body;

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }


    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: req.query.crop_code,
      },
    });
    console.log(
      req.query.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: req.query.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let data = await db.zsrmReqFs.findOne({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: {
      year: req.query.year,
      season: req.query.season,
      crop_code: req.query.crop_code,
      variety_code: req.query.variety_code,
      user_id: req.body.loginedUserid.id,
      is_active: true
    },

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active' ]
    }
    });
    console.log("data found", data);
    
  if (data) {
    const result = {
      year: data.year,
      season: data.season,
      user_id: data.user_id,
      crop_name: data.m_crop.crop_name,
      variety_name: data.m_crop_variety .variety_name,
      state_name:data.m_state.state_name,
      user_name: data.user.name,
      unit: data.unit,
      req: parseFloat(data.req),
      ssc: parseFloat(data.ssc),
      doa: parseFloat(data.doa),
      sau: parseFloat(data.sau),
      nsc: parseFloat(data.nsc),
      sfci: parseFloat(data.sfci),
      total: parseFloat(data.total),
      shtorsur: parseFloat(data.shtorsur),
      pvt: parseFloat(data.pvt),
      others: parseFloat(data.others),
      remarks: data.remarks,
    };
      response(res, status.DATA_AVAILABLE, 200, result);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

// data of all indenters on the basis of year and season for seed division report
exports.viewZsrmReqFsAllSD= async(req, res) => { 
  
  try {
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

     // Calculate offset based on page and limit
     const offset = (page - 1) * limit;


    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name', [
            sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),  // Extract substring from 'variety_name' starting at position 1, length 5
            'not_date'  // Alias the result as 'variety_name_substring'
          ]]
        },
        {
          model:userModel,
          attributes: ['name']
        }
      ],
      where: {
      year: req.query.year,
      season: req.query.season,
      is_active: true
    },

    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active', 'user_id', 'year', 'season' ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset,    // Skip records based on page

    });
    console.log("data found", data);
    
 if (data.length > 0) {

    const result = data.map((item)=>{return {     year: item.year,
      season: item.season,
      user_id: item.user_id,
      crop_name: item.m_crop.crop_name,
      variety_name: item.m_crop_variety.variety_name,
      not_year:item.m_crop_variety.not_date,
      user_name: item.user.name,
      unit: item.unit,
      req: parseFloat(item.req),
      ssc: parseFloat(item.ssc),
      doa: parseFloat(item.doa),
      sau: parseFloat(item.sau),
      nsc: parseFloat(item.nsc),
      sfci: parseFloat(item.sfci),
      total: parseFloat(item.total),
      shtorsur: parseFloat(item.shtorsur),
      pvt: parseFloat(item.pvt),
      others: parseFloat(item.others),
      remarks: item.remarks,
    }
  });

    // Get total records for pagination
    const totalRecords = await db.zsrmReqFs.count({
      where: {
        year: req.query.year,
        season: req.query.season,
        is_active: true
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
} 

// data of all indenters on the basis of year and season for seed division report 
// indenter wise crop wise req, total and shortorsurplus
exports.viewZsrmReqFsAllSDCropWiseReport =async (req,res) => {
  try {

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

     // Calculate offset based on page and limit
     const offset = (page - 1) * limit;


     let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
      {
          model: userModel,
          attributes: []
      }],
      where: {
        year: req.query.year,
        season: req.query.season,
        is_active: true
      },
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('user.name'), 'user_name'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.req')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.shtorsur')), 'shtorsur'], 
      ],
     group: [ [sequelize.col('user.id'), 'user_id'],
     [sequelize.col('m_crop.crop_code'), 'crop_code'],
     [sequelize.col('user.name'), 'user_name'],
     [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
     
      limit: limit,  // Limit the number of records returned
      offset: offset,  // Skip records based on page

      order: [
        [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
        [userModel,'name', 'ASC']
    ],
    });
    console.log("data found", data);
    
 if (data.length > 0 ) {

  // Get total records for pagination
    const totalRecords = await db.zsrmReqFs.count({
      distinct: true, // This ensures that we count the distinct groups.
      group: ['user_id', 'crop_code'], // We are grouping by user_id and crop_id.
      where: {
        year: req.query.year,
        season: req.query.season,
        is_active: true
      }
    });
    console.log(totalRecords.length);
    const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

// data on the basis of inputs given year or season or crop or variety in search for any indenter
exports.viewZsrmReqFsAllUpdated = async(req, res) => { 
  
  try {
   // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

     // Calculate offset based on page and limit
     const offset = (page - 1) * limit;

     let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model:stateModel,
          attributes: ['state_name']
        },
        {
          model:userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [ [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel,'state_name', 'ASC'],
      [userModel,'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_type', 'is_active' ]
      },
      limit: limit,      // Limit the number of records returned
      offset: offset, 
    };
    // if (req.body.search) {
    //   if (req.body.search.year) {
    //     condition.where.year = (req.body.search.year);
    //   }
    //   if (req.body.search.season) {
    //     condition.where.season = (req.body.search.season);
    //   }
    //   if (req.body.search.crop_id) {
    //     condition.where.crop_id = (req.body.search.crop_id);
    //   }
    //   if(req.body.search.variety_id) {
    //     condition.where.variety_id = (req.body.search.variety_id);
    //   }
    // } 

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if(req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    let data = await db.zsrmReqFs.findAll(condition);
    console.log("data found", data);
if (data.length == 0)
  //res.status(404).json({message: "No data found"})
  return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item)=>{return {     
      id: item.id,
      year: item.year,
      season: item.season,
      user_id: item.user_id,
      crop_code: item.crop_code,
      variety_code: item.variety_code,
      crop_name: item.m_crop.crop_name,
      variety_name: item.m_crop_variety.variety_name,
      state_name: item.m_state.state_name,
      user_name: item.user.name,
      unit: item.unit,
      req: parseFloat(item.req),
      ssc: parseFloat(item.ssc),
      doa: parseFloat(item.doa),
      sau: parseFloat(item.sau),
      nsc: parseFloat(item.nsc),
      sfci: parseFloat(item.sfci),
      total: parseFloat(item.total),
      shtorsur: parseFloat(item.shtorsur),
      pvt: parseFloat(item.pvt),
      others: parseFloat(item.others),
      remarks: item.remarks,
    }
  });

    // Get total records for pagination
    const totalRecords = await db.zsrmReqFs.count(condition);

    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
    
 
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
} 



// ZSRM QS requirement and availability form 

exports.addZsrmReqQsDistWise = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type="";
    let unit= "";
    let cropExist = await cropDataModel.findOne({
      where: {
        id: body.crop_id,
      },
    });
    console.log(body.crop_id);
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        id: body.variety_id,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmreqqsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_id: body.crop_id,
        variety_id: body.variety_id,
        user_id: body.loginedUserid.id
      },
    });
    if(recordExist && recordExist.isFinalSubmitted==true) {
      return response(res, "Record already exist", 409, {});
    }
    else if (recordExist && recordExist.isFinalSubmitted==false) {

      if(await zsrmreqqsdistModel.findOne({zsrmreqfs_id: recordExist.id, district_id: body.district_id })) {
        return response(res, "Record already exist for this district", 409, {});
      }

      const recordDist = await zsrmreqqsdistModel.create(
        {
          zsrmreqfs_id: recordExist.id,
          district_id: body.district_id,
          req: body.req,
          avl: body.avl,
          shtorsur: body.avl - body.req
        }
      )
    }
      if ((cropExist.crop_code).slice(0, 1) == 'A') {
        crop_type = 'agriculture';
        unit = 'qt';
       }
       else if ((cropExist.crop_code).slice(0, 1) == 'H') {
        crop_type = 'horticulture'
        unit = 'kg';
       }
       console.log("crop_type:", crop_type);
        console.log("unit:", unit);
    
        let state = await agencyDetailModel.findOne({
           where: {
    
            user_id: body.loginedUserid.id,
          },
          attributes: ['state_id']
        }
        )
        console.log("state_id:", state);

        let data = await zsrmreqqsModel.create({
          year: body.year,
          season: body.season,
          crop_type: crop_type,
          crop_id: body.crop_id,
          variety_id: body.variety_id,
          user_id: body.loginedUserid.id,
          unit: unit,
          state_id: state.state_id,
        })   
  if (data) {
    let dataDist = zsrmreqqsdistModel.create(
      {
        zsrmreqfs_id: data.id,
        district_id: body.district_id,
        req: body.req,
        shtorsur: body.shtorsur,
        avl: body.avl
      }
    )
    if (dataDist) {
      return response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.deleteZsrmReqQsDistWise = async (req, res) => {
  try {

  const data = await zsrmreqqsdistModel.findOne({ where: { id: req.params.id, is_active:true, user_id:body.loginedUserid.id}});

  if (!data) {
    return response(res, status.DATA_NOT_AVAILABLE, 404);
  }

  await zsrmreqqsdistModel.update({ is_active: false,  deletedAt: Date.now()},
  {
    where: {
      id: req.params.id,
    },
  },). then(() => response(res, status.DATA_DELETED, 200, {}) )
  .catch(() => response(res, status.DATA_NOT_DELETED, 500));
}
catch (error) {
  return response(res, status.UNEXPECTED_ERROR, 500)
}
}

exports.deleteZsrmReqQs = async (req, res) => {try {

  const data = await zsrmreqqsModel.findOne({ where: { id: req.params.id, is_active:true, user_id:body.loginedUserid.id}});

  if (!data) {
    return response(res, status.DATA_NOT_AVAILABLE, 404);
  }

  const dataDeleted = await zsrmreqqsdistModel.update({ is_active: false,  deletedAt: Date.now()},
  {
    where: {
      id: req.params.id,
    },
  },);
  
  if(dataDeleted) {
    await zsrmreqqsModel.update({ is_active: false,  deletedAt: Date.now()},
    {
      where: {
        id: req.params.id,
      },
    },).then(() => response(res, status.DATA_DELETED, 200, {}) )
    .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
 else {
  return response(res, status.DATA_NOT_DELETED, 500);
 } 
}
catch (error) {
  return response(res, status.UNEXPECTED_ERROR, 500)
}
}

//srr 

exports.addSrp = async (req, res) => {
  try {

    const body = req.body;
    let crop_type="";
    let unit= "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
       body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await srpModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
      },
    });
    if(recordExist) {
      return response(res, "Record already exist", 404, {});
    }
   if ((cropExist.crop_code).slice(0, 1) == 'A') {
    crop_type = 'agriculture';
    unit = 'qt';
   }
   else if ((cropExist.crop_code).slice(0, 1) == 'H') {
    crop_type = 'horticulture'
    unit = 'kg';
   }
   console.log("crop_type:", crop_type);
    console.log("unit:", unit);

    let state = await agencyDetailModel.findOne({
       where: {

        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await srpModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code:cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      proposedAreaUnderVariety: body.proposedAreaUnderVariety,
      seedrate: body.seedrate, 
      SRRTargetbySTATE: body.SRRTargetbySTATE,
      seedRequired: body.seedRequired,
      qualityquant:body.qualityquant,
      certifiedquant: body.certifiedquant,
      doa: body.doa,
      ssfs: body.ssfs,
      saus: body.saus,
      ssc: body.ssc,
      nsc: body.nsc,
      othergovpsu: body.othergovpsu,
      coop:body.coop,
      seedhub:body.seedhub,
      pvt: body.pvt,
      others: body.others,
      total: body.total,
      shtorsur: body.shtorsur,
      SMRKeptBSToFS: body.SMRKeptBSToFS,
      SMRKeptFSToCS: body.SMRKeptFSToCS,
      FSRequiredtomeettargetsofCS:body.FSRequiredtomeettargetsofCS,
      BSRequiredBSRequiredtomeettargetsofFS:body.BSRequiredBSRequiredtomeettargetsofFS,
      state_id: state.state_id,
         
    })
    console.log("data added", data);
  if (data) {
      return response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }

  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.deleteSrp = async (req, res) => {
try{
  const data = await srpModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id}});
  if (!data) {
    return response(res, status.DATA_NOT_AVAILABLE, 404);
  }
  await srpModel.update({ is_active: false,  deletedAt: Date.now()},
    {
      where: {
        id: req.params.id,
      },
    },). then(() => response(res, status.DATA_DELETED, 200, {}) )
    .catch(() => response(res, status.DATA_NOT_DELETED, 500));
}
catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}

}

exports.updateSrp =async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await srpModel.findOne({where: {id: req.params.id,is_active:true, user_id:body.loginedUserid.id}});
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await srpModel.update({ 
      proposedAreaUnderVariety: body.proposedAreaUnderVariety,
      seedrate: body.seedrate, 
      SRRTargetbySTATE: body.SRRTargetbySTATE,
      seedRequired: body.seedRequired,
      qualityquant:body.qualityquant,
      certifiedquant: body.certifiedquant,
      doa: body.doa,
      ssfs: body.ssfs,
      saus: body.saus,
      ssc: body.ssc,
      nsc: body.nsc,
      othergovpsu: body.othergovpsu,
      coop:body.coop,
      seedhub:body.seedhub,
      pvt: body.pvt,
      others: body.others,
      total: body.total,
      shtorsur: body.shtorsur,
      SMRKeptBSToFS: body.SMRKeptBSToFS,
      SMRKeptFSToCS: body.SMRKeptFSToCS,
      FSRequiredtomeettargetsofCS:body.FSRequiredtomeettargetsofCS,
      BSRequiredBSRequiredtomeettargetsofFS:body.BSRequiredBSRequiredtomeettargetsofFS,
    updated_at: Date.now(),},
    {
      where: {
        id: req.params.id,
      },
    },). then(() => response(res, status.DATA_UPDATED, 200, {}) )
    .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

} catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
  
}

exports.viewSrpById = async (req, res) => {
  try{
    const data = await srpModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id},
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_type', 'is_active' ]
      },},
      
    );
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    return response(res, status.DATA_AVAILABLE, 200, data) ;
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

//all records filter year, season, crop_code, variety_code
exports.viewSrpAll = async (req, res) => { try {
   const userid = req.body.loginedUserid.id;

   const { page, limit } = req.query;  // Extract pagination params from query string
   console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
     include: [
       {
         model: cropDataModel,
         attributes: ['crop_name', 'srr']
       },
       {
         model: varietyModel,
         attributes: [
          'variety_name', 
          'status', 
          'developed_by',
          
          // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
          [
            sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
            'not_date'
          ],
          'is_notified'
          
          // // // CASE statement for 'matuarity_day_from' field
          // [
          //   sequelize.literal(`
          //     CASE
          //       WHEN "matuarity_day_from" = '1' THEN 'Early'
          //       WHEN "matuarity_day_from" = '2' THEN 'Medium'
          //       WHEN "matuarity_day_from" = '3' THEN 'Late'
          //       WHEN "matuarity_day_from" = '4' THEN 'Perennial'
          //       ELSE 'NA'
          //     END
          //   `),
          //   'maturity_type'
          // ],
         
          // CASE statement for 'is_notified' field
          // [
          //   sequelize.literal(`
          //     CASE
          //       WHEN "is_notified" = 1 THEN 'Notified'
          //       ELSE 'Non-Notified'
          //     END
          //   `),
          //   'notification_status'
          // ]
        ]
       },
       {
        model: db.cropCharactersticsModel,
        attributes: ['matuarity_day_from']
       },
       {
         model:stateModel,
         attributes: ['state_name']
       },
       {
         model:userModel,
         attributes: ['name']
       }
     ],
     where: { user_id: userid, is_active: true },
     order: [ ['year', 'ASC'],
     ['season', 'ASC'],
     [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
     [varietyModel, 'variety_name', 'ASC'],
     [stateModel,'state_name', 'ASC'],
     [userModel,'name', 'ASC']],
     attributes: {
       exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
     },
     limit: limit,      // Limit the number of records returned
     offset: offset, 
   };
   if (req.query.year) {
    condition.where.year = (req.query.year);
  }
  if(req.query.season) {
    condition.where.season = (req.query.season);
  }

   if (req.query.crop_code) {
     condition.where.crop_code = (req.query.crop_code);
   }
   if(req.query.variety_code) {
     condition.where.variety_code = (req.query.variety_code);
   }
   let data = await srpModel.findAll(condition);
   console.log(data.sql);
   console.log("data found", data);
if (data.length == 0)
 //res.status(404).json({message: "No data found"})
 return response(res, status.DATA_NOT_AVAILABLE, 404)

   const result = data.map((item)=>{
    console.log("ite,:", item)
    return {     
     id: item.id,
     year: item.year,
     season: item.season,
     crop_code: item.crop_code,
     variety_code: item.variety_code,
     crop_name: item.m_crop.crop_name,
     variety_name: item.m_crop_variety.variety_name,
     not_year: item.m_crop_variety.not_date,
     status: item.m_crop_variety.status,
     developed_by: item.m_crop_variety.developed_by,
     maturity_type: item.m_variety_characteristic? 
     (item.m_variety_characteristic.matuarity_day_from == '1'? 'Early':
      (item.m_variety_characteristic.matuarity_day_from == '2'? 'Medium':
        (item.m_variety_characteristic.matuarity_day_from == '3'? 'Late':
          (item.m_variety_characteristic.matuarity_day_from == '4'? 'Perennial': 'NA')
        )
      )): 'NA',
     notification_status: item.m_crop_variety.is_notified==1 ? 'Notified':'Non-Notified',
     unit: item.unit,
     proposedAreaUnderVariety: parseFloat(item.proposedAreaUnderVariety),
     seedrate: parseFloat(item.seedrate), 
     SRRTargetbyGOI: parseFloat(item.m_crop.srr),
     SRRTargetbySTATE: parseFloat(item.SRRTargetbySTATE),
     seedRequired: parseFloat(item.seedRequired),
     qualityquant:parseFloat(item.qualityquant),
     certifiedquant: parseFloat(item.certifiedquant),
     doa: parseFloat(item.doa),
     ssfs: parseFloat(item.ssfs),
     saus: parseFloat(item.saus),
     ssc: parseFloat(item.ssc),
     nsc: parseFloat(item.nsc),
     othergovpsu: parseFloat(item.othergovpsu),
     coop:parseFloat(item.coop),
     seedhub:parseFloat(item.seedhub),
     pvt: parseFloat(item.pvt),
     others: parseFloat(item.others),
     total: parseFloat(item.total),
     shtorsur: parseFloat(item.shtorsur),
     SMRKeptBSToFS: parseFloat(item.SMRKeptBSToFS),
     SMRKeptFSToCS: parseFloat(item.SMRKeptFSToCS),
     FSRequiredtomeettargetsofCS:parseFloat(item.FSRequiredtomeettargetsofCS),
     BSRequiredBSRequiredtomeettargetsofFS:parseFloat(item.BSRequiredBSRequiredtomeettargetsofFS),
   }
 });
//  console.log(result,'result')
   // Get total records for pagination
   const totalRecords = await srpModel.count(condition);

   const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

   response(res, status.DATA_AVAILABLE, 200, {
     data:result,
     pagination: {
       currentPage: parseInt(page),
       totalRecords: totalRecords,
       totalPages: totalPages,
       pageSize: parseInt(limit),
     },
   });
   

 } catch (error) {
   console.log(error);
   return response(res, status.UNEXPECTED_ERROR, 501)
 }
}


exports.viewSrpAllCropWiseSummary = async (req, res) => { 
  try {
  const userid = req.body.loginedUserid.id;

  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
   const offset = (page - 1) * limit;

   let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: {
        user_id: userid, is_active: true
      },
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'],[sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'], 
      ],
     group: [ [sequelize.col('year'), 'year'],
     [sequelize.col('seedrollingplan.season'), 'season'],
     [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
    ],
   //  [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
     
    limit: limit,  // Limit the number of records returned
    offset: offset,  // Skip records based on page
  
      order : [
        ['year', 'ASC'],
        ['season', 'ASC'],
     [sequelize.col('m_crop.crop_name'), 'ASC'],
    ],
    }
  if (req.query.year) {
   condition.where.year = (req.query.year);
 }
 if(req.query.season) {
   condition.where.season = (req.query.season);
 }

  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }

  let data = await srpModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)

  // Get total records for pagination
  const totalRecords = await srpModel.count(condition);

  const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.viewSrpAllCropWise = async (req, res) => { 
  try {
  const userid = req.body.loginedUserid.id;

  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
   const offset = (page - 1) * limit;

   let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: {
        user_id: userid, is_active: true
      },
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'],[sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('proposedAreaUnderVariety')), 'AreaUnderVariety'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'SeedRequired'],
        [sequelize.fn('SUM', sequelize.col('doa')), 'doa'],
        [sequelize.fn('SUM', sequelize.col('ssfs')), 'ssfs'],
        [sequelize.fn('SUM', sequelize.col('ssc')), 'ssc'],
        [sequelize.fn('SUM', sequelize.col('nsc')), 'nsc'],
        [sequelize.fn('SUM', sequelize.col('saus')), 'saus'],
        [sequelize.fn('SUM', sequelize.col('othergovpsu')), 'othergovpsu'],
        [sequelize.fn('SUM', sequelize.col('coop')), 'coop'], 
        [sequelize.fn('SUM', sequelize.col('pvt')), 'pvt'], 
        [sequelize.fn('SUM', sequelize.col('seedhub')), 'seedhub'], 
        [sequelize.fn('SUM', sequelize.col('others')), 'others'], 
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'], 
        [sequelize.fn('SUM', sequelize.col('BSRequiredBSRequiredtomeettargetsofFS')), 'BSRequiredBSRequiredtomeettargetsofFS'], 
        [sequelize.fn('SUM', sequelize.col('FSRequiredtomeettargetsofCS')), 'FSRequiredtomeettargetsofCS'], 
      ],
     group: [ [sequelize.col('year'), 'year'],
     [sequelize.col('seedrollingplan.season'), 'season'],
     [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
    ],
   //  [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
     
    limit: limit,  // Limit the number of records returned
    offset: offset,  // Skip records based on page
  
      order : [
        ['year', 'ASC'],
        ['season', 'ASC'],
     [sequelize.col('m_crop.crop_name'), 'ASC'],
    ],
    }
  if (req.query.year) {
   condition.where.year = (req.query.year);
 }
 if(req.query.season) {
   condition.where.season = (req.query.season);
 }

  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }

  let data = await srpModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)

  // Get total records for pagination
  const totalRecords = await srpModel.count(condition);

  const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.viewSrpAllSD = async (req, res) => { try {
  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
   const offset = (page - 1) * limit;

   let condition = {
    include: [
      {
        model: cropDataModel,
        attributes: ['crop_name', 'srr']
      },
      {
        model: varietyModel,
        attributes: [
         'variety_name', 
         'status', 
         'developed_by',
         
         // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
         [
           sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
           'not_date'
         ],
         'is_notified'
         
         // // // CASE statement for 'matuarity_day_from' field
         // [
         //   sequelize.literal(`
         //     CASE
         //       WHEN "matuarity_day_from" = '1' THEN 'Early'
         //       WHEN "matuarity_day_from" = '2' THEN 'Medium'
         //       WHEN "matuarity_day_from" = '3' THEN 'Late'
         //       WHEN "matuarity_day_from" = '4' THEN 'Perennial'
         //       ELSE 'NA'
         //     END
         //   `),
         //   'maturity_type'
         // ],
        
         // CASE statement for 'is_notified' field
         // [
         //   sequelize.literal(`
         //     CASE
         //       WHEN "is_notified" = 1 THEN 'Notified'
         //       ELSE 'Non-Notified'
         //     END
         //   `),
         //   'notification_status'
         // ]
       ]
      },
      {
        model: db.cropCharactersticsModel,
        attributes: ['matuarity_day_from']
       },
      {
        model:userModel,
        attributes: ['name']
      }
    ],
    where: { is_active: true },
    order: [ [userModel,'name', 'ASC'],
    ['year', 'ASC'],
    ['season', 'ASC'],
    [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
    [varietyModel, 'variety_name', 'ASC'],
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset, 
  };
  if (req.query.year) {
   condition.where.year = (req.query.year);
 }
 if(req.query.season) {
   condition.where.season = (req.query.season);
 }
 if(req.query.userid) {
  condition.where.user_id = (req.query.userid);
}


  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }
  if(req.query.variety_code) {
    condition.where.variety_code = (req.query.variety_code);
  }
  let data = await srpModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)

  const result = data.map((item)=>{
   console.log(item.m_crop_variety.not_year);
   return {     
    id: item.id,
    user_id:item.user_id,
    user_name: item.user.name,
    year: item.year,
    season: item.season,
    crop_name: item.m_crop.crop_name,
    variety_name: item.m_crop_variety.variety_name,
    not_year: item.m_crop_variety.not_date,
     status: item.m_crop_variety.status,
     developed_by: item.m_crop_variety.developed_by,
     maturity_type: item.m_variety_characteristic? 
     (item.m_variety_characteristic.matuarity_day_from == '1'? 'Early':
      (item.m_variety_characteristic.matuarity_day_from == '2'? 'Medium':
        (item.m_variety_characteristic.matuarity_day_from == '3'? 'Late':
          (item.m_variety_characteristic.matuarity_day_from == '4'? 'Perennial': 'NA')
        )
      )): 'NA',
     notification_status: item.m_crop_variety.is_notified==1 ? 'Notified':'Non-Notified',
    unit: item.unit,
    proposedAreaUnderVariety: parseFloat(item.proposedAreaUnderVariety),
     seedrate: parseFloat(item.seedrate), 
     SRRTargetbyGOI: parseFloat(item.m_crop.srr),
     SRRTargetbySTATE: parseFloat(item.SRRTargetbySTATE),
     seedRequired: parseFloat(item.seedRequired),
     qualityquant:parseFloat(item.qualityquant),
     certifiedquant: parseFloat(item.certifiedquant),
     doa: parseFloat(item.doa),
     ssfs: parseFloat(item.ssfs),
     saus: parseFloat(item.saus),
     ssc: parseFloat(item.ssc),
     nsc: parseFloat(item.nsc),
     othergovpsu: parseFloat(item.othergovpsu),
     coop:parseFloat(item.coop),
     seedhub:parseFloat(item.seedhub),
     pvt: parseFloat(item.pvt),
     others: parseFloat(item.others),
     total: parseFloat(item.total),
     shtorsur: parseFloat(item.shtorsur),
     SMRKeptBSToFS: parseFloat(item.SMRKeptBSToFS),
     SMRKeptFSToCS: parseFloat(item.SMRKeptFSToCS),
     FSRequiredtomeettargetsofCS:parseFloat(item.FSRequiredtomeettargetsofCS),
     BSRequiredBSRequiredtomeettargetsofFS:parseFloat(item.BSRequiredBSRequiredtomeettargetsofFS),
  }
});

  // Get total records for pagination
  const totalRecords = await srpModel.count(condition);

  const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

  response(res, status.DATA_AVAILABLE, 200, {
    data: result,
    pagination: {
      currentPage: parseInt(page),
      totalRecords: totalRecords,
      totalPages: totalPages,
      pageSize: parseInt(limit),
    },
  });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.viewSrpAllCropWiseSD = async (req, res) => { 
  try {

  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
   const offset = (page - 1) * limit;

   let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
        {
          model: userModel,
          attributes: []
        }],
      where: {
       is_active: true
      },
      attributes: [
        [sequelize.col('seedrollingplan.user_id'),'user_id'],
        [sequelize.col('user.name'),'name'],
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'],[sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('proposedAreaUnderVariety')), 'AreaUnderVariety'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'SeedRequired'],
        [sequelize.fn('SUM', sequelize.col('doa')), 'doa'],
        [sequelize.fn('SUM', sequelize.col('ssfs')), 'ssfs'],
        [sequelize.fn('SUM', sequelize.col('ssc')), 'ssc'],
        [sequelize.fn('SUM', sequelize.col('nsc')), 'nsc'],
        [sequelize.fn('SUM', sequelize.col('saus')), 'saus'],
        [sequelize.fn('SUM', sequelize.col('othergovpsu')), 'othergovpsu'],
        [sequelize.fn('SUM', sequelize.col('coop')), 'coop'], 
        [sequelize.fn('SUM', sequelize.col('pvt')), 'pvt'], 
        [sequelize.fn('SUM', sequelize.col('seedhub')), 'seedhub'], 
        [sequelize.fn('SUM', sequelize.col('others')), 'others'], 
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'], 
        [sequelize.fn('SUM', sequelize.col('BSRequiredBSRequiredtomeettargetsofFS')), 'BSRequiredBSRequiredtomeettargetsofFS'], 
        [sequelize.fn('SUM', sequelize.col('FSRequiredtomeettargetsofCS')), 'FSRequiredtomeettargetsofCS'], 
      ],
     group: [  [sequelize.col('seedrollingplan.user_id'),'user_id'],
    [sequelize.col('user.name'),'name'],
    [sequelize.col('year'), 'year'],
     [sequelize.col('seedrollingplan.season'), 'season'],
     [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
    ],
   //  [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
     
    limit: limit,  // Limit the number of records returned
    offset: offset,  // Skip records based on page
  
      order : [ 
      [sequelize.col('user.name'),'ASC'],
        ['year', 'ASC'],
        ['season', 'ASC'],
     [sequelize.col('m_crop.crop_name'), 'ASC'],
    ],
    }
  if (req.query.year) {
   condition.where.year = (req.query.year);
 }
 if(req.query.season) {
   condition.where.season = (req.query.season);
 }

  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }
  if (req.query.userid) {
    condition.where.user_id = (req.query.userid);
  }


  let data = await srpModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)

  // Get total records for pagination
  const totalRecords = await srpModel.count(condition);

  const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}


exports.viewSrpAllCropWiseSummarySD = async (req, res) => { 
  try {
  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
   const offset = (page - 1) * limit;

   let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
        {
          model: userModel,
          attributes: []
        }],
      where: {
         is_active: true
      },
      attributes: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'],[sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'], 
      ],
     group: [
      [sequelize.col('seedrollingplan.user_id'), 'user_id'],
      [sequelize.col('user.name'), 'name'],
       [sequelize.col('year'), 'year'],
     [sequelize.col('seedrollingplan.season'), 'season'],
     [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
    ],
   //  [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
     
    limit: limit,  // Limit the number of records returned
    offset: offset,  // Skip records based on page
  
      order : [
        [sequelize.col('user.name'), 'ASC'],
        ['year', 'ASC'],
        ['season', 'ASC'],
     [sequelize.col('m_crop.crop_name'), 'ASC'],
    ],
    }
  if (req.query.year) {
   condition.where.year = (req.query.year);
 }
 if(req.query.season) {
   condition.where.season = (req.query.season);
 }

  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }

  if (req.query.userid) {
    condition.where.user_id = (req.query.userid);
  }

  let data = await srpModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)

  // Get total records for pagination
  const totalRecords = await srpModel.count(condition);

  const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.addSrr = async (req, res) => {
  try {

    const body = req.body;
    let crop_type="";
    let unit= "";

    let startYear = parseInt(body.year.split('-')[0]);

    // Calculate the next year range
   let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;

    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
       body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let recordExist = await srrModel.findOne({
      where: {
        year: body.year,
        crop_code: body.crop_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
      },
    });

  
       console.log(nextYear);
       let recordExistForNext = await srrModel.findOne({
        where: {
          year: nextYear,
          crop_code: body.crop_code,
          seed_type: body.seed_type,
          user_id: body.loginedUserid.id,
        },
      });

    if(recordExist && recordExistForNext)
        return response(res, "Seed Roll Plan already exist for this year", 409, {});


    if(!recordExist)  //first time entry case     
      {
    
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
        crop_type = 'agriculture';
        unit = 'qt';
       }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
        crop_type = 'horticulture'
        unit = 'kg';
    }
    let state = await agencyDetailModel.findOne({
      where: {
       user_id: body.loginedUserid.id,
     },
     attributes: ['state_id']
   }
   )
   const data  = await srrModel.create({
        year: body.year,
        crop_type: crop_type,
        crop_code: body.crop_code,
        crop_group_code:cropExist.group_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
        state_id: state.state_id,
        unit: unit,
        plannedAreaUnderCropInHa: 0.00,
        seedRateInQtPerHt: 0.00,
        plannedSeedQuanDis: 0.00,
        plannedSrr: 0.00,
        areaSownUnderCropInHa:body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        prevYearId: null,
      });
       const nextYearData= await srrModel.create({
        year: nextYear,
        crop_type: crop_type,
        crop_code: body.crop_code,
        crop_group_code:cropExist.group_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
        state_id: state.state_id,
        unit: unit,
        plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
        seedRateInQtPerHt: body.seedRateInQtPerHt,
        plannedSeedQuanDis: body.plannedSeedQuanDis,
        plannedSrr: body.plannedSrr,
        areaSownUnderCropInHa:0.00,
        seedRateAcheived: 0.00,
        seedQuanDis: 0.00,
        acheivedSrr: 0.00,
        prevYearId: data.id
       });
      return response(res, status.DATA_SAVE, 200, {});
    }
    else {
      await recordExist.update({
        areaSownUnderCropInHa:body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        update_at:Date.now(),
      },);
    const nextYearData = await srrModel.create({
      year: nextYear,
      crop_type: recordExist.crop_type,
      crop_code: recordExist.crop_code,
      crop_group_code:recordExist.crop_group_code,
      seed_type: recordExist.seed_type,
      user_id: recordExist.user_id,
      unit: recordExist.unit,
      state_id: recordExist.state_id,
      plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
      seedRateInQtPerHt: body.seedRateInQtPerHt,
      plannedSeedQuanDis: body.plannedSeedQuanDis,
      plannedSrr: body.plannedSrr,
      areaSownUnderCropInHa:0.00,
      seedRateAcheived: 0.00,
      seedQuanDis: 0.00,
      acheivedSrr: 0.00,
      prevYearId: recordExist.id
     });

     response(res, status.DATA_SAVE, 200, {});
    }
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrrByYearCropSeedType = async (req, res) => { 
  try {
  const userid = req.body.loginedUserid.id;
  let startYear = parseInt(req.query.year.split('-')[0]);
    // Calculate the next year range
   let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;
   let cropExist = await cropDataModel.findOne({
    where: {
      crop_code: req.query.crop_code,
    },
  });
    let recordExist = await srrModel.findOne({
      where: {
        year:req.query.year,
        crop_code: req.query.crop_code,
        seed_type: req.query.seed_type,
        user_id: userid,
        is_active: true
      },
    });

    let recordExistForNext = await srrModel.findOne({
        where: {
          year: nextYear,
          crop_code: req.query.crop_code,
          seed_type: req.query.seed_type,
          user_id: userid, 
          is_active:true
        },
      });
    if(!recordExist) {
      data = {
        srr: cropExist.srr,
        plannedAreaUnderCropInHa: 0.00,
        seedRateInQtPerHt: 0.00,
        plannedSeedQuanDis:0.00,
        plannedSrr:0.00
      }
    return response(res, status.DATA_AVAILABLE, 200, data)
    }
    else if (recordExist && !recordExistForNext) {
      data = {
        srr: cropExist.srr,
        plannedAreaUnderCropInHa: recordExist.plannedAreaUnderCropInHa,
        seedRateInQtPerHt: recordExist.seedRateInQtPerHt,
        plannedSeedQuanDis:recordExist.plannedSeedQuanDis,
        plannedSrr:recordExist.plannedSrr
      }
      return response(res, status.DATA_AVAILABLE, 200, data)
    }
    else if(recordExist && recordExistForNext) {
    //   let condition = {
    //     include: [
    //       {
    //         model: srrModel,
    //         as: 'nextYearData',
    //         required: true, 
    //         attributes: ['plannedAreaUnderCropInHa','seedRateInQtPerHt','plannedSeedQuanDis', 'plannedSrr',]
    //       },
    //       {
    //         model: cropDataModel,
    //         attributes: ['crop_name', 'srr']
    //       },
    //     ],
    //     where: {   
    //       year:req.query.year,
    //       crop_code: req.query.crop_code,
    //       seed_type: req.query.seed_type,
    //       user_id: userid, is_active: true},
    //     attributes: {
    //       exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
    //     }
    //   };
    //   let data = await srrModel.findOne(condition);
    //  const result = {    
    //     id: data.id,
    //     year: data.year,
    //     crop_code: data.crop_code,
    //     crop_name: data.m_crop.crop_name,
    //     srr: data.m_crop.srr,
    //     seed_type: data.seed_type,
    //     unit: data.unit,
    //     areaSownUnderCropInHa:parseFloat(data.areaSownUnderCropInHa),
    //     seedRateAcheived: parseFloat(data.seedRateAcheived),
    //     seedQuanDis: parseFloat(data.seedQuanDis),
    //     acheivedSrr: parseFloat(data.acheivedSrr),
    //     NextYearAreaUnderCropInHa: parseFloat(data.nextYearData.plannedAreaUnderCropInHa),
    //     NextYearseedRateInQtPerHt: parseFloat(data.nextYearData.seedRateInQtPerHt),
    //     NextYearSeedQuanDis: parseFloat(data.nextYearData.plannedSeedQuanDis),
    //     NextYearSrr: parseFloat(data.nextYearData.plannedSrr),
    //   };
    //   // Get total records for pagination
    return response(res, "Record already exist", 409, {});
  

    }
} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.viewSrrAll = async (req, res) => { 
  try {
  const userid = req.body.loginedUserid.id;
  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
  const offset = (page - 1) * limit;

   let condition = {
    include: [
      {
        model: srrModel,
        as: 'nextYearData',
        required: true, 
        attributes: ['plannedAreaUnderCropInHa','seedRateInQtPerHt','plannedSeedQuanDis', 'plannedSrr',]
      },
      {
        model: cropDataModel,
        attributes: ['crop_name', 'srr']
      },
      {
        model:stateModel,
        attributes: ['state_name']
      },
      {
        model:userModel,
        attributes: ['name']
      }
    ],
    where: { user_id: userid, is_active: true},
    order: [ ['year', 'ASC'],
    [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
    [ 'seed_type', 'ASC'],
    [stateModel,'state_name', 'ASC'],
    [userModel,'name', 'ASC']],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset, 
  };
  if (req.query.year) {
    condition.where.year = (req.query.year);
  }
  if (req.query.crop_code) {
    condition.where.crop_code = (req.query.crop_code);
  }
  if(req.query.seed_type) {
    condition.where.seed_type = (req.query.seed_type);
  }
  let data = await srrModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)
  let count =0

  const result = data.map((item)=>{
   return {     
    id: item.id,
    year: item.year,
    crop_code: item.crop_code,
    crop_name: item.m_crop.crop_name,
    srr:item.m_crop.srr,
    seed_type: item.seed_type,
    unit: item.unit,
    areaSownUnderCropInHa:parseFloat(item.areaSownUnderCropInHa),
    seedRateAcheived: parseFloat(item.seedRateAcheived),
    seedQuanDis: parseFloat(item.seedQuanDis),
    acheivedSrr: parseFloat(item.acheivedSrr),
    NextYearAreaUnderCropInHa: parseFloat(item.nextYearData.plannedAreaUnderCropInHa),
    NextYearseedRateInQtPerHt: parseFloat(item.nextYearData.seedRateInQtPerHt),
    NextYearSeedQuanDis: parseFloat(item.nextYearData.plannedSeedQuanDis),
    NextYearSrr: parseFloat(item.nextYearData.plannedSrr),
  } 
});

  // Get total records for pagination
  let totalRecords = await srrModel.count(condition);
  const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
  response(res, status.DATA_AVAILABLE, 200, {
    data: result,
    pagination: {
      currentPage: parseInt(page),
      totalRecords: totalRecords,
      totalPages: totalPages,
      pageSize: parseInt(limit),
    },
  });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}

exports.viewSrrAllReport = async (req, res) => { 
  try {
  const userid = req.body.loginedUserid.id;
  const { page, limit } = req.query;  // Extract pagination params from query string
  console.log(page, limit);
  const offset = (page - 1) * limit;

   let condition = {
    include: [
      {
        model: srrModel,
        as: 'nextYearData',
        required: true, 
        attributes: ['plannedAreaUnderCropInHa','seedRateInQtPerHt','plannedSeedQuanDis', 'plannedSrr',]
      },
      {
        model: cropDataModel,
        attributes: ['crop_name', 'srr']
      },
      {
        model:stateModel,
        attributes: ['state_name']
      },
      {
        model:userModel,
        attributes: ['name']
      }
    ],
    where: { user_id: userid, is_active: true},
    order: [ ['year', 'ASC'],
    [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
    [ 'seed_type', 'ASC'],
    [stateModel,'state_name', 'ASC'],
    [userModel,'name', 'ASC']],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
    },
    limit: limit,      // Limit the number of records returned
    offset: offset, 
  };
 // Handle multiple years (if provided in the body)
if (req.body.year) {
  condition.where.year = Array.isArray(req.body.year) ? { [Op.in]: req.body.year } : req.body.year;
}

// Handle multiple crop_codes (if provided in the body)
if (req.body.crop_code) {
  condition.where.crop_code = Array.isArray(req.body.crop_code) ? { [Op.in]: req.body.crop_code } : req.body.crop_code;
}

// Handle seed_type if provided in the body
if (req.body.seed_type) {
  condition.where.seed_type = req.body.seed_type;
}
  let data = await srrModel.findAll(condition);
  console.log("data found", data);
if (data.length == 0)
//res.status(404).json({message: "No data found"})
return response(res, status.DATA_NOT_AVAILABLE, 404)
  const result = data.map((item)=>{
   return {     
    id: item.id,
    year: item.year,
    crop_code: item.crop_code,
    crop_name: item.m_crop.crop_name,
    srr:item.m_crop.srr,
    seed_type: item.seed_type,
    unit: item.unit,
    plannedAreaUnderCropInHa: parseFloat(item.plannedAreaUnderCropInHa),
    seedRateInQtPerHt: parseFloat(item.seedRateInQtPerHt),
    plannedSeedQuanDis:parseFloat(item.plannedSeedQuanDis),
    plannedSrr:parseFloat(item.plannedSrr),
    areaSownUnderCropInHa:parseFloat(item.areaSownUnderCropInHa),
    seedRateAcheived: parseFloat(item.seedRateAcheived),
    seedQuanDis: parseFloat(item.seedQuanDis),
    acheivedSrr: parseFloat(item.acheivedSrr),
    NextYearAreaUnderCropInHa: parseFloat(item.nextYearData.plannedAreaUnderCropInHa),
    NextYearseedRateInQtPerHt: parseFloat(item.nextYearData.seedRateInQtPerHt),
    NextYearSeedQuanDis: parseFloat(item.nextYearData.plannedSeedQuanDis),
    NextYearSrr: parseFloat(item.nextYearData.plannedSrr),
  } 
});

  // Get total records for pagination
  let totalRecords = await srrModel.count(condition);
  const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
  response(res, status.DATA_AVAILABLE, 200, {
    data: result,
    pagination: {
      currentPage: parseInt(page),
      totalRecords: totalRecords,
      totalPages: totalPages,
      pageSize: parseInt(limit),
    },
  });
  

} catch (error) {
  console.log(error);
  return response(res, status.UNEXPECTED_ERROR, 501)
}
}


// exports.deleteSrr = async (req, res) => {
//   try{
//     const data = await srrModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id}});
//     if (!data) {
//       return response(res, status.DATA_NOT_AVAILABLE, 404);
//     }
//     await data.update({ is_active: false,  deletedAt: Date.now()},);
//      await srrModel.update({
//       is_active: false,  deletedAt: Date.now()
//      },
//      {where: {
//       prevYearId:data.id
//      }});
//       return response(res, status.DATA_DELETED, 200, {});
//   }
//   catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501)
//   }
  
//   }
  
exports.updateSrr =async (req, res) => {
  
    try {
      const body = req.body;
      const recordExist = await srrModel.findOne({where: {id: req.params.id,is_active:true, user_id:body.loginedUserid.id}});
      if (!recordExist) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }
  
      await recordExist.update({
        areaSownUnderCropInHa:body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        update_at:Date.now(),
      },);
     await srrModel.update({
      plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
      seedRateInQtPerHt: body.seedRateInQtPerHt,
      plannedSeedQuanDis: body.plannedSeedQuanDis,
      plannedSrr: body.plannedSrr,
      update_at:Date.now(),
     },
     {where: {
      prevYearId: recordExist.id
     }});
     return response(res, status.DATA_UPDATED, 200, {}) ;
  
  } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
    
  }


  exports.viewSrrAllReportSD = async (req, res) => {
    try {
      // Extract pagination params from query string
      let { page = 1, limit = 10, year } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;
  
      // Ensure `year` is provided and parse it
      let startYear = parseInt(year.split('-')[0]);
  
      // Calculate the previous and previous-to-previous year ranges
      let previousYear = `${startYear - 1}-${(startYear).toString().slice(-2)}`;
      let previousToPreviousYear = `${startYear - 2}-${(startYear - 1).toString().slice(-2)}`;
  
      console.log(previousYear, previousToPreviousYear);
  
      // Condition to fetch data for 2020-21, 2021-22, and 2022-23
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
          },
          {
            model: cropGroupModel,
            attributes: [],
          },
          {
            model: cropDataModel,
            attributes: [],
          },
        ],
        where: {
          year: { [Op.in]: [previousToPreviousYear, previousYear, year] },
          is_active: true,
        },
        order: [
          [userModel, 'name', 'ASC'],
          [cropGroupModel, 'group_name', 'ASC'],
          [cropDataModel, 'crop_name', 'ASC'],
        ],
        attributes: [
          //[sequelize.col('year'), 'year'],
          [sequelize.col('user.name'), 'user_name'],
          [sequelize.col('m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('seed_type'), 'seed_type'],
          [sequelize.col('m_crop.srr'), 'srr'],
          //[sequelize.col('acheivedSrr'), 'acheivedSrr'],
          //Corrected SUM with CASE WHEN and achievedSrr from srrModel

          [
            sequelize.fn ( "SUM",sequelize.literal(`CASE WHEN year='${previousToPreviousYear}' THEN "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
            'previousToPreviousYear',
          ],
          [
            sequelize.fn ( "SUM",sequelize.literal(`CASE WHEN year='${previousYear}' THEN  "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
            'previousYear',
          ],
          [
            sequelize.fn ( "SUM",sequelize.literal(`CASE WHEN year='${year}' THEN  "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
            'year',
          ],
        ],
        group: [
          [sequelize.col('user.name'), 'user_name'],
          [sequelize.col('m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('seed_type'), 'seed_type'],
          [sequelize.col('m_crop.srr'), 'srr'],
        ],
        limit: limit,
        offset: offset,
      };
  
      console.log(condition);
      if (req.body.crop_code) {
        condition.where.crop_code = Array.isArray(req.body.crop_code) ? { [Op.in]: req.body.crop_code } : req.body.crop_code;
      }
    
      if (req.body.user_id) {
        condition.where.user_id = Array.isArray(req.body.user_id) ? { [Op.in]: req.body.user_id } : req.body.user_id;
      }

  
      // Fetching the data
      const data = await srrModel.findAll(condition);
  
      console.log(data);
  
      // If no data is found
      if (data.length === 0) {
        return res.status(404).json({ message: "No data found" });
      }
  
      const totalRecords = await srrModel.count(condition);

      const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages
    
      return res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalRecords: totalRecords.length,
          totalPages: totalPages,
          pageSize: limit,
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  };

  //zsrmbstofs
  exports.addZsrmBsToFs = async(req, res) => {
  
    try {
      const body = req.body;
      console.log(body.loginedUserid.id);
      let crop_type="";
      let unit= "";
      let cropExist = await cropDataModel.findOne({
        where: {
          crop_code: body.crop_code,
        },
      });
      if (!cropExist) {
        return response(res, "Crop Not Found", 404, {});
      }
  
      let varietyExist = await varietyModel.findOne({
        where: {
          variety_code: body.variety_code,
        },
      });
      if (!varietyExist) {
        return response(res, "Variety Not Found", 404, {});
      }
  
      let recordExist = await zsrmbstofsModel.findOne({
        where: {
          year: body.year,
          season: body.season,
          crop_code: body.crop_code,
          variety_code: body.variety_code,
          user_id: body.loginedUserid.id,
        },
      });
      if(recordExist) {
        return response(res, "Record already exist", 409, {});
      }
     if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
     }
     else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
     }
      let state = await agencyDetailModel.findOne({
         where: {
          user_id: body.loginedUserid.id,
        },
        attributes: ['state_id']
      }
      )
      console.log("state_id:", state);

      let data = await zsrmbstofsModel.create({
        year: body.year,
        season: body.season,
        crop_type: crop_type,
        crop_code: body.crop_code,
        crop_group_code:cropExist.group_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        unit: unit,
        norms: body.norms,
        bsLiftedIcar: body.bsLiftedIcar,
        bsLiftedSau: body.bsLiftedSau,
        bsLiftedOthers: body.bsLiftedOthers,
        bsLiftedTotal: body.bsLiftedTotal,
        bsUsedIcar: body.bsUsedIcar,
        bsUsedSau: body.bsUsedSau,
        bsUsedOthers: body.bsUsedOthers,
        bsUsedTotal: body.bsUsedTotal,
        fsProdFromBs: body.fsProdFromBs,
        smrAchieved: body.smrAchieved,
        percentAchievement: body.percentAchievement,
        fsProdOutOfFs: body.fsProdOutOfFs,
        carryOverFs: body.carryOverFs,
        totalFsAvl: body.totalFsAvl,
        state_id: state.state_id,
           
      })
      console.log("data added", data);
    if (data) {
        response(res, status.DATA_SAVE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_SAVE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
    
  }


  exports.deleteZsrmBsToFs = async (req, res) => {
    try{
      const data = await zsrmbstofsModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id}});
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }
      await data.update({ is_active: false,  deletedAt: Date.now()},
       ). then(() => response(res, status.DATA_DELETED, 200, {}) )
        .catch(() => response(res, status.DATA_NOT_DELETED, 500));
    }
    catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
    
    }
    
    exports.updateZsrmBsToFs =async (req, res) => {
    
      try {
        const body = req.body;
        const recordExist = await zsrmbstofsModel.findOne({where: {id: req.params.id,is_active:true, user_id:body.loginedUserid.id}});
        if (!recordExist) {
          return response(res, status.DATA_NOT_AVAILABLE, 404);
        }
    
        await recordExist.update({ 
        norms: body.norms,
        bsLiftedIcar: body.bsLiftedIcar,
        bsLiftedSau: body.bsLiftedSau,
        bsLiftedOthers: body.bsLiftedOthers,
        bsLiftedTotal: body.bsLiftedTotal,
        bsUsedIcar: body.bsUsedIcar,
        bsUsedSau: body.bsUsedSau,
        bsUsedOthers: body.bsUsedOthers,
        bsUsedTotal: body.bsUsedTotal,
        fsProdFromBs: body.fsProdFromBs,
        smrAchieved: body.smrAchieved,
        percentAchievement: body.percentAchievement,
        fsProdOutOfFs: body.fsProdOutOfFs,
        carryOverFs: body.carryOverFs,
        totalFsAvl: body.totalFsAvl,
        updated_at: Date.now(),},
       ). then(() => response(res, status.DATA_UPDATED, 200, {}) )
        .catch(() => response(res, status.DATA_NOT_UPDATED, 500));
    
    } catch (error) {
        console.log(error);
        return response(res, status.UNEXPECTED_ERROR, 501)
      }
      
    }

    exports.viewZsrmBsToFs = async(req, res) => { 
  
      try {
       // const { search } = req.body;
        const userid = req.body.loginedUserid.id;
    
        const { page, limit } = req.query;  // Extract pagination params from query string
        console.log(page, limit);
        const offset = (page - 1) * limit;
    
         let condition = {
          include: [
            {
              model: cropDataModel,
              attributes: ['crop_name']
            },
            {
              model: varietyModel,
              attributes: ['variety_name']
            },
            {
              model:stateModel,
              attributes: ['state_name']
            },
            {
              model:userModel,
              attributes: ['name']
            }
          ],
          where: { user_id: userid, is_active: true },
          order: [ [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
          [varietyModel, 'variety_name', 'ASC'],
          [stateModel,'state_name', 'ASC'],
          [userModel,'name', 'ASC']],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_type', 'is_active' ]
          },
          limit: limit,      // Limit the number of records returned
          offset: offset, 
        }
    
        if (req.query.year) {
          condition.where.year = (req.query.year);
        }
        if (req.query.season) {
          condition.where.season = (req.query.season);
        }
        if (req.query.crop_code) {
          condition.where.crop_code = (req.query.crop_code);
        }
        if(req.query.variety_code) {
          condition.where.variety_code = (req.query.variety_code);
        }
        let data = await zsrmbstofsModel.findAll(condition);
        console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    
        const result = data.map((item)=>{return {     
          id: item.id,
          year: item.year,
          season: item.season,
          user_id: item.user_id,
          crop_code: item.crop_code,
          variety_code: item.variety_code,
          crop_name: item.m_crop.crop_name,
          variety_name: item.m_crop_variety.variety_name,
          state_name: item.m_state.state_name,
          user_name: item.user.name,
          unit: item.unit,
          norms: parseFloat(item.norms),
          bsLiftedIcar: parseFloat(item.bsLiftedIcar),
        bsLiftedSau: parseFloat(item.bsLiftedSau),
        bsLiftedOthers: parseFloat(item.bsLiftedOthers),
        bsLiftedTotal: parseFloat(item.bsLiftedTotal),
        bsUsedIcar: parseFloat(item.bsUsedIcar),
        bsUsedSau: parseFloat(item.bsUsedSau),
        bsUsedOthers: parseFloat(item.bsUsedOthers),
        bsUsedTotal: parseFloat(item.bsUsedTotal),
        fsProdFromBs: parseFloat(item.fsProdFromBs),
        smrAchieved: parseFloat(item.smrAchieved),
        percentAchievement: parseFloat(item.percentAchievement),
        fsProdOutOfFs: parseFloat(item.fsProdOutOfFs),
        carryOverFs: parseFloat(item.carryOverFs),
        totalFsAvl: parseFloat(item.totalFsAvl),
        }
      });
    
        // Get total records for pagination
        const totalRecords = await zsrmbstofsModel.count(condition);
    
        const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
    
        response(res, status.DATA_AVAILABLE, 200, {
          data: result,
          pagination: {
            currentPage: parseInt(page),
            totalRecords: totalRecords,
            totalPages: totalPages,
            pageSize: parseInt(limit),
          },
        });
        
     
      } catch (error) {
        console.log(error);
        return response(res, status.UNEXPECTED_ERROR, 501)
      }
      
    } 

   
    