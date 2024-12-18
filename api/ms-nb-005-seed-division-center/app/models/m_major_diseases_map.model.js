module.exports = (sql, Sequelize) => {
  
    const mMajorDiseasesMap = sql.define('m_major_diseases_maps', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        diseases_id:{
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
    
  
    return mMajorDiseasesMap
  }
  