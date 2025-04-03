const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = (sql, Sequelize) => {

    const SRPForm = sql.define('seedrollingplan', {
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
      crop_group_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_code: {
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
       proposedAreaUnderVariety: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedrate: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      SRRTargetbySTATE: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedRequired: {
        type: Sequelize.DECIMAL,
      },
      doa: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      ssfs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      ssc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      nsc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      saus: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      othergovpsu: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      coop: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pvt: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedhub: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      others: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      shtorsur: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      qualityquant: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      certifiedquant: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      SMRKeptBSToFS: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      SMRKeptFSToCS: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      FSRequiredtomeettargetsofCS: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      BSRequiredtomeettargetsofFS: {
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
      is_finalised: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null},
      finalisedAt: { type: Sequelize.DATE, field: 'finalised_at', default: null}
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

      //SRPForm.sync({ alter: true });
    return SRPForm;
  };
  