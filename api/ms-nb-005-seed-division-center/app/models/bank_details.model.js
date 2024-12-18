module.exports = (sql, Sequelize) => {

    const bankDetails = sql.define('m_bank_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bank_name: {
        type: Sequelize.STRING
      },
      ifsc_code: {
        type: Sequelize.STRING
      },
      micr:{
        type: Sequelize.STRING
      },
      branch_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      state:{
        type: Sequelize.STRING
      },
      dbt_state_code:{
        type: Sequelize.STRING
      },
      dbt_district_code: {
        type: Sequelize.STRING
      },
     
      
     

  
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return bankDetails
  }
  