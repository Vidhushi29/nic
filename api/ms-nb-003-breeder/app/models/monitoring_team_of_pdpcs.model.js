module.exports = (sql, Sequelize) => {

  const monitoringTeamOfPdpcs = sql.define('monitoring_team_of_pdpcs', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    state_code: {
      type: Sequelize.INTEGER,
    },
    user_id: {
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
      // timestamps: false,
      timezone: '+5:30'
    }
  )
  return monitoringTeamOfPdpcs
}
