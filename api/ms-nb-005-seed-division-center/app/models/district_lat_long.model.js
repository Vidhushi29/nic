module.exports = (sql, Sequelize) => {
  
    const districtLatLong = sql.define('district_lat_long', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
       
        state_code:{
          type: Sequelize.STRING,
        },
        district_code:{
          type: Sequelize.STRING
        },
        district_code_LG: {
            type: Sequelize.STRING,
           
        },
        district_name:{
            type: Sequelize.STRING,
          },
          min_longitude:{
            type: Sequelize.STRING
          },
          max_longitude: {
              type: Sequelize.STRING,
             
          },
        //   ---//
        min_latitude: {
            type: Sequelize.STRING,
           
        },
        max_latitude:{
            type: Sequelize.STRING,
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
    
  
    return districtLatLong
  }
  