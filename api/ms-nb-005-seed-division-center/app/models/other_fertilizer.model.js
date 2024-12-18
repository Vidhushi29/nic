module.exports = (sql, Sequelize) => {

    const otherFertilizer = sql.define('other_fertilizers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      other_fertilizer_name: {
        type: Sequelize.STRING,
      },
      other_fertilizer_value: {
        type: Sequelize.STRING,
      },
      characterstics_id: {
        type: Sequelize.INTEGER,
      },
              created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      }
      )
    return otherFertilizer
  }