module.exports = (sql, Sequelize) => {
  const generateSampleSlips = sql.define('generate_sample_slips', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    unique_code: {
      type: Sequelize.STRING,
    },
    total_processed_qnt: {
      type: Sequelize.STRING,
    },
    testing_lab: {
      type: Sequelize.STRING,
    },
    stack_no: {
      type: Sequelize.STRING,
    },
    sample_no: {
      type: Sequelize.STRING,
    },
    no_of_bags: {
      type: Sequelize.STRING,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
    godown_no: {
      type: Sequelize.INTEGER,
    },
    class_of_seed: {
      type: Sequelize.STRING,
    },
    chemical_treatment: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    tests: {
      type: Sequelize.JSON,
    },
    get_carry_over:{
      type: Sequelize.INTEGER,
    },
    lot_id:{
      type: Sequelize.INTEGER,
    },
    variety_code_line:{
      type: Sequelize.STRING,
    },
    status:{
      type: Sequelize.STRING,
    },
    testing_type:{
      type: Sequelize.STRING,
    },
    got_bspc_id:{
        type: Sequelize.INTEGER,
    },
    state_code:{
      type: Sequelize.INTEGER,
  },


  },
    {
      // tableName: 'm_variety_lines',
      timestamps: false,
      // timezone: '+5:30'
    })
  return generateSampleSlips
}
