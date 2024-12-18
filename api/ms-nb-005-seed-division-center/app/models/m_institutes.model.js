module.exports = (sql, Sequelize) => {
  
    const mInstitutes = sql.define('m_institutes', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        institute_name:{
            type: Sequelize.STRING,
        },
    },
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    return mInstitutes
  }
  