const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.cropCharactersticsModel = require("./crop_characteristics.model")(sequelize, Sequelize);
db.stateModel = require("./state.model")(sequelize, Sequelize);
db.seasonModel = require('./season.model.js')(sequelize, Sequelize);
db.districtModel = require('./district.model.js')(sequelize, Sequelize);
db.varietLineModel = require('./variety_line.model.js')(sequelize, Sequelize);
db.zsrmReqFs = require('./zsrmreqfs.model.js')(sequelize, Sequelize);
db.zsrmReqQs = require('./zsrmreqqs.model.js')(sequelize, Sequelize);
db.zsrmReqQsDistWise = require('./zsrmreqqsdistwise.model.js')(sequelize, Sequelize);
db.srrModel = require('./srr.model.js')(sequelize,Sequelize);

module.exports = db;

//============================

//m_crom of spa and cropGroup

db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.hasMany(db.cropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});

/*db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'id',
    targetKey: 'agency_id'
});*/
//============================


// --------------- user model -----------------
db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'agency_id'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});
db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});


//zsrm

db.cropModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.zsrmReqFs.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.userModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmReqFs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.zsrmReqFs.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.stateModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.zsrmReqFs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});


//---ZSRMQService--------------------------------

db.cropModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'crop_id',
    targetKey: 'id'

});

db.zsrmReqQs.belongsTo(db.cropModel, {
     foreignKey: 'crop_id',
    targetKey: 'id'

});

db.userModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmReqQs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.zsrmReqQs.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
     targetKey: 'id'
});

db.stateModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.zsrmReqQs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

//---ZSRMQServiceDistWise--------------------------------
db.zsrmReqQs.hasMany(db.zsrmReqQsDistWise, {

    foreignKey: 'zsrmreqfs_id',
    targetKey: 'id'
});

db.zsrmReqQsDistWise.belongsTo(db.zsrmReqQs, {
    foreignKey: 'zsrmreqfs_id',
    targetKey: 'id'
});

// db.districtModel.hasMany(db.zsrmReqQsDistWise, {
//     foreignKey: 'district_id',
//     targetKey: 'district_code'
// });

// db.zsrmReqQsDistWise.belongsTo(db.districtModel, {
//     foreignKey: 'district_id',
//     targetKey: 'district_code'
// });


db.cropCharactersticsModel.hasOne(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'

});
db.varietyModel.belongsTo(db.cropCharactersticsModel, {
     foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

//srr
db.cropModel.hasMany(db.srrModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.srrModel.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.userModel.hasMany(db.srrModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.srrModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.srrModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.srrModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.stateModel.hasMany(db.srrModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.srrModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});
