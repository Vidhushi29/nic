module.exports = (sql, Sequelize) => {
  
    const season_value = sql.define('season', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        season_id:{
            type: Sequelize.INTEGER,
        },
        
        crop_id:{
            type: Sequelize.INTEGER,
        },
        seasons:{
            type: Sequelize.JSON,
        }
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return season_value
  }
  