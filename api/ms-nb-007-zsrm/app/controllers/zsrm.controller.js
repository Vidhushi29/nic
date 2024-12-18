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

exports.saveZsrmReqFs = async(req, res) => {
  
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
    console.log(
       body.crop_id)
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
        crop_id: body.crop_id,
        variety_id: body.variety_id,
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
      crop_id: body.crop_id,
      variety_id: body.variety_id,
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
      remarks: body.remarks},
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

exports.deleteZsrmReqFsById = async (req, res) => {
  try {

    const data = await zsemreqfsModel.findOne({ where: { id: req.params.id, is_active:true, user_id:body.loginedUserid.id}});

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


exports.viewZsrmReqFsAll = async(req, res) => { 
  
  try {
    const body = req.body;

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
      year: body.year,
      season: body.season,
      user_id: body.loginedUserid.id,
      is_active: true
    },

    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel,'state_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_id', 'variety_id', 'crop_type', 'is_active' ]
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
        year: body.year,
        season: body.season,
        user_id: body.loginedUserid.id,
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

exports.viewZsrmReqFsCrop = async(req, res) => {
  
  try {
    const body = req.body;
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
        id: body.crop_id,
      },
    });
    console.log(
       body.crop_id)
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
      year: body.year,
      season: body.season,
      crop_id: body.crop_id,
      user_id: body.loginedUserid.id,
      is_active: true
    },
    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],


    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_id', 'variety_id', 'crop_type', 'is_active' ]
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
        year: body.year,
        season: body.season,
        user_id: body.loginedUserid.id,
        crop_id: body.crop_id,
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
exports.viewZsrmReqFsCropVariety = async(req, res) => {
  
  try {
    const body = req.body;

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
        id: body.crop_id,
      },
    });
    console.log(
       body.crop_id)
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
      year: body.year,
      season: body.season,
      crop_id: body.crop_id,
      variety_id: body.variety_id,
      user_id: body.loginedUserid.id,
      is_active: true
    },

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_id', 'variety_id', 'crop_type', 'is_active' ]
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

exports.viewZsrmReqFsAllSD= async(req, res) => { 
  
  try {
    const body = req.body;

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
      year: body.year,
      season: body.season,
      is_active: true
    },

    order: [
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [userModel,'name', 'ASC']
  ],

    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_id', 'variety_id', 'crop_type', 'is_active', 'user_id', 'year', 'season' ]
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
        year: body.year,
        season: body.season,
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

exports.viewZsrmReqFsAllSDCropWiseReport =async (req,res) => {
  try {
    const body = req.body;

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
        year: body.year,
        season: body.season,
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
     [sequelize.col('m_crop.id'), 'crop_id'],
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
      group: ['user_id', 'crop_id'], // We are grouping by user_id and crop_id.
      where: {
        year: body.year,
        season: body.season,
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


exports.viewZsrmReqFsAllUpdated = async(req, res) => { 
  
  try {
    const { search } = req.body;
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
        exclude: ['createdAt', 'updatedAt', 'deletedAt','crop_id', 'variety_id', 'crop_type', 'is_active' ]
      },
      limit: limit,      // Limit the number of records returned
      offset: offset, 
    };
    if (req.body.search) {
      if (req.body.search.year) {
        condition.where.year = (req.body.search.year);
      }
      if (req.body.search.season) {
        condition.where.season = (req.body.search.season);
      }
      if (req.body.search.crop_id) {
        condition.where.crop_id = (req.body.search.crop_id);
      }
      if(req.body.search.variety_id) {
        condition.where.variety_id = (req.body.search.variety_id);
      }
    } 

    let data = await db.zsrmReqFs.findAll(condition);
    console.log("data found", data);
if (data.length == 0)
  return response(res, status.DATA_NOT_AVAILABLE, 404)

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