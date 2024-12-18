module.exports = (sql, Sequelize) => {
    const allocationToIndentorSeed = sql.define('allocation_to_indentor_for_lifting_seeds', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        is_freeze: {
            type: Sequelize.INTEGER
        },
        isdraft: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.STRING
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
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        indentquantity: {
            type: Sequelize.STRING
        },
        producedquantity: {
            type: Sequelize.STRING
        },
        is_variety_submitted: {
            type: Sequelize.INTEGER
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
    return allocationToIndentorSeed;
};