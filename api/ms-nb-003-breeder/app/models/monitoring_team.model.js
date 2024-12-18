module.exports = (sql, Sequelize) => {
    const MonitoringTeam = sql.define('monitoring_team', {
        address: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.INTEGER
        },
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        institute_name: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        mobile_number: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        user_mapping_id: {
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
    return MonitoringTeam;
};