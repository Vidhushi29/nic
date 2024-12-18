module.exports = (sql, Sequelize) => {

    const mCategoryOfOragnizations = sql.define('m_category_of_oragnizations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      category_code: {
        type: Sequelize.STRING,
      },
      category_name: {
        type: Sequelize.STRING,
      },
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
    return mCategoryOfOragnizations
  }