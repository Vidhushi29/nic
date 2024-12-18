const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stateModel = require("./state.model")(sequelize, Sequelize);
db.allocationBreederProdModel = require("./allocation_breederseed_prod_to_breeder.model")(sequelize, Sequelize);
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.indentOfBreederseedModel = require("./indent_of_breederseed.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);

db.cropModel.hasMany(db.allocationBreederProdModel, {
    foreignKey: 'crop_code',
    onDelete: 'cascade'
});

db.allocationBreederProdModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.cropModel.hasMany(db.varietyModel, {
    foreignKey: 'crop_code',
    onDelete: 'cascade'
});

db.varietyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.varietyModel.hasMany(db.allocationBreederProdModel, {
    foreignKey: 'variety_id',
    onDelete: 'cascade'
});

db.allocationBreederProdModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.agencyDetailModel.hasMany(db.allocationBreederProdModel, {
    foreignKey: 'agency_id',
    onDelete: 'cascade'
});

db.allocationBreederProdModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});

//allocation breeder seed prod  and userModel reletion
db.userModel.hasMany(db.allocationBreederProdModel, {
    foreignKey: 'user_id',
});

db.allocationBreederProdModel.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});
db.breederCropModel.belongsTo(db.userModel, {
    foreignKey:'user_id',
    targetKey: 'id'
});
// finish

db.cropModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'crop_code',
    onDelete: 'cascade'
});

db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropGroupModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'group_code',
    onDelete: 'cascade'
});

db.indentOfBreederseedModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.userModel.hasMany(db.cropModel, {
    foreignKey: 'breeder_id',
    targetKey: 'breeder_id'
});
db.cropModel.belongsTo(db.userModel, {
    foreignKey: 'breeder_id',
    // targetKey: 'indent_of_breederseed_id'

})
db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'agency_id'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});
module.exports = db;

