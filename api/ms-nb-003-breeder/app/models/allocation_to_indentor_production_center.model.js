module.exports = (sql, Sequelize) => {
    const allocationToIndentorProductionCenter = sql.define('allocation_to_indentor_for_lifting_breederseed_production_cnters', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        breeder_seed_quantity_left: {
            type: Sequelize.INTEGER
        },
        allocation_to_indentor_for_lifting_breederseed_id: {
            type: Sequelize.INTEGER
        },
        production_center_id: {
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
    return allocationToIndentorProductionCenter;
};