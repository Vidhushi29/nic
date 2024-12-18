module.exports = (sql, Sequelize) => {
  
    const mMajorClimateResilienceMaps = sql.define('m_major_climate_resilience_maps', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        climate_resilience_id:{
            type: Sequelize.INTEGER,
        },
        
        m_variety_characterstic_id:{
            type: Sequelize.INTEGER,
        },
    },
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    return mMajorClimateResilienceMaps
  }
  