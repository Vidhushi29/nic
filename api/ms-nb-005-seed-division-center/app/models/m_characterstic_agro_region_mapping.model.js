module.exports = (sql, Sequelize) => {

  const mCharactersticAgroRegionMapping = sql.define('m_characterstic_agro_region_mappings', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    variety_id: {
      type: Sequelize.INTEGER,
    },
    region_id: {
      type: Sequelize.INTEGER,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    is_checked: {
      type: Sequelize.INTEGER,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mCharactersticAgroRegionMapping
}
