module.exports = (sql, Sequelize) => {
    const dashboardData = sql.define('dashboard_data', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.STRING
        },
        crop_type: {
            type: Sequelize.STRING
        },

        indented_crop: {
            type: Sequelize.INTEGER,
        },
        indented_variety: {
            type: Sequelize.INTEGER
        },
        indented_quantity: {
            type: Sequelize.STRING
        },
        indent_done: {
            type: Sequelize.STRING,
        },
        indent_pending: {
            type: Sequelize.STRING
        },

	 seed_indented_crop: {
            type: Sequelize.INTEGER,
        },
        seed_indented_variety: {
            type: Sequelize.INTEGER
        },
        seed_indented_quantity: {
            type: Sequelize.STRING
        },
        seed_indent_done: {
            type: Sequelize.STRING,
        },
        seed_indent_pending: {
            type: Sequelize.STRING
        },

        assigned_pdpc_crop: {
            type: Sequelize.INTEGER,
        },
        assigned_pdpc_variety: {
            type: Sequelize.INTEGER
        },
        assigned_pdpc_quantity: {
            type: Sequelize.STRING
        },
        assigned_pdpc_done: {
            type: Sequelize.STRING,
        },
        assigned_pdpc_pending: {
            type: Sequelize.STRING
        },

        produced_crop: {
            type: Sequelize.INTEGER,
        },
        produced_variety: {
            type: Sequelize.INTEGER
        },
        produced_quantity: {
            type: Sequelize.STRING
        },
        produced_done: {
            type: Sequelize.STRING,
        },
        produced_pending: {
            type: Sequelize.STRING
        },

        allocation_crop: {
            type: Sequelize.INTEGER,
        },
        allocation_variety: {
            type: Sequelize.INTEGER
        },
        allocation_quantity: {
            type: Sequelize.STRING
        },
        allocation_done: {
            type: Sequelize.STRING,
        },
        allocation_pending: {
            type: Sequelize.STRING
        },

        lifted_crop: {
            type: Sequelize.INTEGER,
        },
        lifted_variety: {
            type: Sequelize.INTEGER
        },
        lifted_quantity: {
            type: Sequelize.STRING
        },
        lifted_done: {
            type: Sequelize.STRING,
        },
        lifted_pending: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.INTEGER,
        },

        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },

        {
            timestamps: false,
            // timezone: '+5:30'
        })
    return dashboardData;
};
