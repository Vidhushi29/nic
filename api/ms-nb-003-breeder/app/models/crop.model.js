module.exports = (sql, Sequelize) => {

  const Crop = sql.define('m_crops', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    botanic_name: {
      type: Sequelize.STRING
    },
    // breeder_production_center:{
    //   type: Sequelize.STRING
    // },
    crop_code: {
      type: Sequelize.STRING,
    },
    crop_group: {
      type: Sequelize.STRING
    },
    crop_name: {
      type: Sequelize.STRING,
    },
    group_code: {
      type: Sequelize.STRING,
    },
    season: {
      type: Sequelize.STRING,
    },
    srr: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    user_id: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    breeder_id: {
      type: Sequelize.INTEGER,
    },
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

  },


    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return Crop
};