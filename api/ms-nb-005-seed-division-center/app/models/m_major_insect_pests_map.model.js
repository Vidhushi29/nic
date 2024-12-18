module.exports = (sql, Sequelize) => {
  
    const mMajorInsectPestsMap = sql.define('m_major_insect_pests_maps', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        insect_pests_id:{
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
    return mMajorInsectPestsMap
  }
  