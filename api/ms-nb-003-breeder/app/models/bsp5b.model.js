module.exports = (sql, Sequelize) => {
    const Bsp5b = sql.define('bsp_5_bs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        lifting_quantity: {
            type: Sequelize.INTEGER
        },
        unlifting_quantity: {
            type: Sequelize.TEXT
        },
        breeder_seed_balance: {
            type: Sequelize.INTEGER
        },
        label_number: {
            type: Sequelize.STRING
        },
        lot_id: {
            type: Sequelize.INTEGER
        },
        reason: {
            type: Sequelize.STRING
        },
        lifting_date: {
            type: Sequelize.STRING
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        is_freeze: {
            type: Sequelize.INTEGER
        },
        isdraft: {
            type: Sequelize.INTEGER,
            default: 0
        },
        bsp_5_a_id: {
            type: Sequelize.INTEGER
        },
        indent_of_breederseed_id: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        season: {
            type: Sequelize.TEXT
        },
        created_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },
        updated_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },
        updatedAt: { field: 'updated_at', type: Sequelize.DATE },
        createdAt: { field: 'created_at', type: Sequelize.DATE },
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return Bsp5b;
};