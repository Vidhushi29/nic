module.exports = (sql, Sequelize) => {

    const breederCrop = sql.define('breeder_crop', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING,
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        production_center_id: {
            type: Sequelize.INTEGER,
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },

        createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },


    },
        {
            timestamps: false,
        })

    return breederCrop
}
