const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.cropModel = require("./crop.model.js")(sequelize, Sequelize);
db.userModel = require("./user.model.js")(sequelize, Sequelize);
db.varietyModel = require("./variety.model.js")(sequelize, Sequelize);
module.exports = (sql, Sequelize) => {

    const ZsrmFsToCs = sql.define('zsrm_fs_to_cs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      season: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_group_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      variety_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
       },
      norms: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedDao: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedSsc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedSau: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedCoop: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedOthers: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsLiftedTotal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedDao: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedSsc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedSau: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedCoop: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedOthers: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsUsedTotal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      csProdFromfs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      smrAchieved: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      percentAchievement: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      csProdOutOfCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      carryOverCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      totalCsAvl: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null}
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

   //ZsrmFsToCs.sync({ alter: true });
    return ZsrmFsToCs;
  };
  