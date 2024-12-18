module.exports = (sql, Sequelize) => {
  
    const characteristicsState = sql.define('characterstics_state', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
       
        state_code:{
          type: Sequelize.STRING,
        },
        state_name:{
          type: Sequelize.STRING
        },
        state_data: {
            type: Sequelize.JSON,
        
        },
        // created_at: {
        //     type: Sequelize.DATE,
        //     default: Date.now()
        // },
        // updated_at: {
        //     type: Sequelize.DATE,
        //     default: Date.now()
        // },
        // createdAt: {type: Sequelize.DATE, field: 'created_at'},
        // updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return characteristicsState
  }
  