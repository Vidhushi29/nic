const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.indenterModel = require("./indent_of_breederseed.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize);
db.allocationBreederProdModel = require("./allocation_breederseed_prod_to_breeder.model.js")(sequelize, Sequelize);
db.bsp1Model  = require("./bsp1.model")(sequelize, Sequelize);
db.bsp5bModel = require("./bsp5b.model")(sequelize, Sequelize);
db.allocationToIndentor = require("./allocation_to_indentor.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.indentOfSpa = require('./indent_of_spa.model.js')(sequelize, Sequelize);
db.stateModel = require("./state.model")(sequelize, Sequelize);
db.seasonModel = require('./season.model.js')(sequelize, Sequelize);
db.districtModel = require('./district.model.js')(sequelize, Sequelize);
db.allocationToSPAProductionCenterSeed = require("./allocation_to_spa_for_lifting_seed_production_cnter.model.js")(sequelize, Sequelize);
db.allocationToIndentorSeed = require("./allocation_to_indentor_for_lifting_seeds.model")(sequelize, Sequelize);
db.allocationToIndentorProductionCenterSeed = require("./allocation_to_indentor_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.indentOfSpaLinesModel = require('./indent_of_spa_lines.model.js')(sequelize, Sequelize);
db.indentOfBrseedLines = require('./indent_of_brseed_lines.model.js')(sequelize, Sequelize);
db.varietLineModel = require('./variety_line.model.js')(sequelize, Sequelize);

module.exports = db;

db.cropModel.hasMany(db.indenterModel, {
    foreignKey: 'crop_code',
    onDelete: 'cascade'
});

db.indenterModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.varietyModel.hasMany(db.indenterModel, {
    foreignKey: 'variety_id',
    onDelete: 'cascade'
});

db.indenterModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});


db.indenterModel.hasMany(db.agencyDetailModel, {
//    foreignKey: 'created_by',
foreignKey: 'user_id',
    onDelete: 'cascade',
    sourceKey: 'user_id'
});

db.agencyDetailModel.belongsTo(db.indenterModel, {
//    foreignKey: 'created_by',
    foreignKey: 'user_id',
    targetKey: 'user_id'
});

db.indenterModel.belongsTo(db.userModel, {
    // foreignKey: 'id',
    // onDelete: 'cascade',
   foreignKey: 'user_id'
});
db.indenterModel.belongsTo(db.bsp5bModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indenterModel.belongsTo(db.allocationToIndentor, {
    foreignKey: 'id',
    targetKey: 'indent_of_breeder_id'
});
db.allocationToIndentor.belongsTo(db.indenterModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'id'
});

db.userModel.hasMany(db.indenterModel, {
    foreignKey: 'user_id'
});
//indent of spa and variety==========
db.indentOfSpa.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey:'variety_id' 
});
db.varietyModel.hasMany(db.indentOfSpa, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
    // targetKey:'id'
});
//============================
//indent of spa and cropmodel
db.indentOfSpa.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.belongsTo(db.indentOfSpa, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
    // targetKey:'id'
});
//============================
//indent of spa and state
db.indentOfSpa.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});
db.stateModel.hasMany(db.indentOfSpa, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
    // targetKey:'id'
});
//============================

//indent of spa and seasn

db.indentOfSpa.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.hasMany(db.indentOfSpa, {
    foreignKey: 'season',
    targetKey: 'season'

});
//============================
//indent of spa and users

db.indentOfSpa.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});
db.userModel.hasMany(db.indentOfSpa, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});
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
db.indentOfSpa.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
// db.indentOfSpa.belongsTo(db.allocationToSPAProductionCenterSeed,{
//     foreignKey: 'spa_code',
//     targetKey: 'spa_code'
// })
db.allocationToSPAProductionCenterSeed.belongsTo(db.userModel,{
    foreignKey: 'production_center_id',
    targetKey: 'id'
})
// ------------- reletion beetween allocation_to_indentor_for_lifting_seed/-allocationToIndentorProductionCenterSeed-----------------------
db.allocationToIndentorSeed.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.allocationToIndentorSeed, {
    targetKey: 'id',
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
});
db.indentOfSpa.belongsTo(db.indentOfSpaLinesModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_spa_id',
});
db.indenterModel.belongsTo(db.indentOfBrseedLines, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indentOfSpaLinesModel.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code'
});

// db.indenterModel.hasMany(db.indentOfSpa, {
//     foreignKey: 'indente_breederseed_id',
//     sourceKey: 'id',
//     // as: 'monitoringTeams1'
// });

db.indentOfSpa.belongsTo(db.indenterModel, {
    foreignKey: 'indente_breederseed_id',
    targetKey: 'id',
});