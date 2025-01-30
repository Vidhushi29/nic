const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.cropModel = require("./crop.model.js")(sequelize, Sequelize);
db.userModel = require("./user.model.js")(sequelize, Sequelize);
db.varietyModel = require("./variety.model.js")(sequelize, Sequelize);
module.exports = (sql, Sequelize) => {

    const ZsrmBsToFs = sql.define('zsrm_bs_to_fs', {
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
      bsLiftedIcar: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsLiftedSau: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsLiftedOthers: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsLiftedTotal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsUsedIcar: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsUsedSau: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsUsedOthers: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bsUsedTotal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      fsProdFromBs: {
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
      fsProdOutOfFs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      carryOverFs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      totalFsAvl: {
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

   // ZsrmBsToFs.sync({ alter: true });
    return ZsrmBsToFs;
  };
  