module.exports = (sql, Sequelize) => {

    const agencyDetail = sql.define('agency_details', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        agency_name: {
            type: Sequelize.STRING,
        },
        category: {
            type: Sequelize.STRING,
        },
        state_id: {
            type: Sequelize.INTEGER,
        },
        district_id: {
            type: Sequelize.INTEGER
        },
        short_name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        contact_person_name: {
            type: Sequelize.STRING
        },
        contact_person_mobile: {
            type: Sequelize.INTEGER
        },
        contact_person_designation_id: {
            type: Sequelize.INTEGER
        },
        mobile_number: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        fax_no: {
            type: Sequelize.STRING
        },
        latitude: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.STRING
        },
        bank_name: {
            type: Sequelize.STRING
        },
        bank_branch_name: {
            type: Sequelize.STRING
        },
        bank_account_number: {
            type: Sequelize.STRING
        },
        bank_ifsc_code: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        block_id: {
            type: Sequelize.INTEGER
        },

        user_id: {
            type: Sequelize.INTEGER
        }

    },
        {
            timestamps: false,
        })

    return agencyDetail
}
