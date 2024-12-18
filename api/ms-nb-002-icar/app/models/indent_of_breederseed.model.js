module.exports = (sql, Sequelize) => {

  const Indenter = sql.define('indent_of_breederseeds', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER
    },
    season_id: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_id: {
      type: Sequelize.INTEGER,
    },
    variety_notification_year: {
      type: Sequelize.STRING,
    },
    indent_quantity: {
      type: Sequelize.STRING
    },
    unit: {
      type: Sequelize.STRING
    },
    is_active: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    is_freeze: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    icar_freeze: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    createdAt: {type: Sequelize.DATE, field: 'created_at', default: Date.now()},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at', default: Date.now()},
  },

    {
      freezeTableName: true
      // timezone: '+5:30'
    })

  return Indenter
}
