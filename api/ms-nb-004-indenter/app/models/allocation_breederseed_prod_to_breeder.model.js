module.exports = (sql, Sequelize) => {

    const allocationBreederSeed = sql.define('allocation_breederseed_prod_to_breeder', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        breeder_id: {
            type: Sequelize.INTEGER
        },
        available_nucleus_seed: {
            type: Sequelize.STRING,
        },
        crop_code: {
            type: Sequelize.STRING,
        },
       
        variety_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        agency_id: {
            type: Sequelize.INTEGER,
        },
        allocate_nucleus_seed: {
            type: Sequelize.INTEGER,
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() }
    },
        {
            timestamps: true,
            freezeTableName: true
        })

    return allocationBreederSeed
}
