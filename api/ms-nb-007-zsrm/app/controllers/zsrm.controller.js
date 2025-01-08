require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const paginateResponse = require("../_utility/generate-otp");
const { raw } = require('body-parser');
const db = require("../models");
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
      req: item.req,
      ssc: item.ssc,
      doa: item.doa,
      sau: item.sau,
      nsc: item.nsc,
      sfci: item.sfci,
      total: item.total,
      shtorsur: item.shtorsur,
      pvt: item.pvt,
      others: item.others,
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
        req: item.req,
        ssc: item.ssc,
        doa: item.doa,
        sau: item.sau,
        nsc: item.nsc,
        sfci: item.sfci,
        total: item.total,
        shtorsur: item.shtorsur,
        pvt: item.pvt,
        others: item.others,
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
      req: data.req,
      ssc: data.ssc,
      doa: data.doa,
      sau: data.sau,
      nsc: data.nsc,
      sfci: data.sfci,
      total: data.total,
      shtorsur: data.shtorsur,
      pvt: data.pvt,
      others: data.others,
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
      req: item.req,
      ssc: item.ssc,
      doa: item.doa,
      sau: item.sau,
      nsc: item.nsc,
      sfci: item.sfci,
      total: item.total,
      shtorsur: item.shtorsur,
      pvt: item.pvt,
      others: item.others,
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
      req: item.req,
      ssc: item.ssc,
      doa: item.doa,
      sau: item.sau,
      nsc: item.nsc,
      sfci: item.sfci,
      total: item.total,
      shtorsur: item.shtorsur,
      pvt: item.pvt,
      others: item.others,
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
      return response(res, "Record already exist", 404, {});
    }
    else if (recordExist && recordExist.isFinalSubmitted==false) {

      if(await zsrmreqqsdistModel.findOne({zsrmreqfs_id: recordExist.id, district_id: body.district_id })) {
        return response(res, "Record already exist for this district", 404, {});
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
         attributes: ['variety_name' , 'not_date']
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
   console.log("data found", data);
if (data.length == 0)
 //res.status(404).json({message: "No data found"})
 return response(res, status.DATA_NOT_AVAILABLE, 404)

   const result = data.map((item)=>{
    console.log(item.m_crop_variety.not_year);
    return {     
     id: item.id,
     year: item.year,
     season: item.season,
     crop_code: item.crop_code,
     variety_code: item.variety_code,
     crop_name: item.m_crop.crop_name,
     variety_name: item.m_crop_variety.variety_name,
     not_year:item.m_crop_variety.not_date.substring(0, 4),
     unit: item.unit,
     proposedAreaUnderVariety: item.proposedAreaUnderVariety,
     seedrate: item.seedrate, 
     SRRTargetbyGOI: item.m_crop.srr,
     SRRTargetbySTATE: item.SRRTargetbySTATE,
     seedRequired: item.seedRequired,
     qualityquant:item.qualityquant,
     certifiedquant: item.certifiedquant,
     doa: item.doa,
     ssfs: item.ssfs,
     saus: item.saus,
     ssc: item.ssc,
     nsc: item.nsc,
     othergovpsu: item.othergovpsu,
     coop:item.coop,
     seedhub:item.seedhub,
     pvt: item.pvt,
     others: item.others,
     total: item.total,
     shtorsur: item.shtorsur,
     SMRKeptBSToFS: item.SMRKeptBSToFS,
     SMRKeptFSToCS: item.SMRKeptFSToCS,
     FSRequiredtomeettargetsofCS:item.FSRequiredtomeettargetsofCS,
     BSRequiredBSRequiredtomeettargetsofFS:item.BSRequiredBSRequiredtomeettargetsofFS,
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
        attributes: ['variety_name' , 'not_date']
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
    not_year:item.m_crop_variety.not_date.substring(0, 4),
    unit: item.unit,
    proposedAreaUnderVariety: item.proposedAreaUnderVariety,
    seedrate: item.seedrate, 
    SRRTargetbyGOI: item.m_crop.srr,
    SRRTargetbySTATE: item.SRRTargetbySTATE,
    seedRequired: item.seedRequired,
    qualityquant:item.qualityquant,
    certifiedquant: item.certifiedquant,
    doa: item.doa,
    ssfs: item.ssfs,
    saus: item.saus,
    ssc: item.ssc,
    nsc: item.nsc,
    othergovpsu: item.othergovpsu,
    coop:item.coop,
    seedhub:item.seedhub,
    pvt: item.pvt,
    others: item.others,
    total: item.total,
    shtorsur: item.shtorsur,
    SMRKeptBSToFS: item.SMRKeptBSToFS,
    SMRKeptFSToCS: item.SMRKeptFSToCS,
    FSRequiredtomeettargetsofCS:item.FSRequiredtomeettargetsofCS,
    BSRequiredBSRequiredtomeettargetsofFS:item.BSRequiredBSRequiredtomeettargetsofFS,
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
        season: body.season,
        crop_code: body.crop_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
      },
    });
    if(!recordExist) {
    
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
   await srrModel.create({
        year: body.year,
        season: body.season,
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
        acheivedSrr: body.acheivedSrr
      });

        let startYear = parseInt(body.year.split('-')[0]);

        // Calculate the next year range
       let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;
       console.log(nextYear);

       await srrModel.create({
        year: nextYear,
        season: body.season,
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
        acheivedSrr: 0.00
       })
      return response(res, status.DATA_SAVE, 200, {});
    }
    else {
      await srrModel.update({
        areaSownUnderCropInHa:body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        update_at:Date.now(),
      },
    {where: {
      id: recordExist.id
    }});

      let startYear = parseInt(body.year.split('-')[0]);

      // Calculate the next year range
     let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;

     await srrModel.create({
      year: nextYear,
      season: recordExist.season,
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
      acheivedSrr: 0.00
     });
     response(res, status.DATA_SAVE, 200, {});
    }
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

