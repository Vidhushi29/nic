module.exports = (sql, Sequelize) => {
  
    const User = sql.define('user', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        agency_id:{
          type: Sequelize.INTEGER
        },
        // contact_person_name:{
        //   type: Sequelize.STRING,
        // },
        designation_id:{
          type: Sequelize.INTEGER
        },
        email_id:{
          type: Sequelize.STRING,
        },
        code:{
          type: Sequelize.STRING,
        },
        mobile_number:{
          type: Sequelize.INTEGER,
        },
        name:{
          type: Sequelize.STRING,
        },
        password:{
          type: Sequelize.STRING,
        },
        user_type:{
          type: Sequelize.STRING,
        },
        username:{
          type: Sequelize.STRING,
        },
        created_by:{
          type: Sequelize.INTEGER,
        },
        updated_by:{
          type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        spa_code:{
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
        is_change_password:{
          type: Sequelize.BOOLEAN,
        },
        // deleted_at: {
        //     type: Sequelize.DATE
        // },
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        // deletedAt: {type: Sequelize.DATE, field: 'deleted_at'},
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return User
  }
  