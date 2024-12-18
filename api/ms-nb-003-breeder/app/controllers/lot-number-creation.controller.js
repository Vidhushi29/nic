const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { lotNumberModel } = require('../models');
const Sequelize = require('sequelize');
require('dotenv').config()

class LotNumberController {
    static fetch = async (req, res) => {
        try {
            const { year, month, bspc_code, spp_code } = req.body;

            const condition = {
                where: {
                    current_year: year,
                    current_month: month,
                    bspc_code: bspc_code,
                    spp_code: spp_code
                },
                attributes: ['running_number'],
                raw: true,
                order: [['running_number', 'DESC']]
            };

            const data = await lotNumberModel.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

};

module.exports = LotNumberController;