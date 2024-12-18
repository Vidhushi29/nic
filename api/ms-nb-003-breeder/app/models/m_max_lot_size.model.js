module.exports = (sql, Sequelize) => {

  const maxLotSize = sql.define('m_max_lot_sizes', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
    updated_by: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    crop: {
      type: Sequelize.STRING
    },
    crop_code: {
      type: Sequelize.STRING
    },
    max_lot_size: {
      type: Sequelize.STRING,
    },
    group_code:{
      type: Sequelize.STRING,
    },
    group_name:{
      type: Sequelize.STRING,
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
      timezone: '+5:30'
    })
  return maxLotSize
}
