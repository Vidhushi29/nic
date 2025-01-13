const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = (sql, Sequelize) => {

    const SRRForm = sql.define('seedrepalcementrate', {
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
      crop_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_group_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seed_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
       },
       plannedAreaUnderCropInHa: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedRateInQtPerHt: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      plannedSeedQuanDis: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      plannedSrr: {
        type: Sequelize.DECIMAL,
      },

      areaSownUnderCropInHa: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedRateAcheived: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedQuanDis: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      acheivedSrr: {
        type: Sequelize.DECIMAL,
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

      prevYearId:{
        type: Sequelize.INTEGER,

      },
      
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null}
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

//SRRForm.sync({ alter: true });
    return SRRForm;
  };
  