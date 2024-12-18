const Validator = require('validatorjs');
const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const { stateModel, agencyDetailModel, userModel, cropModel, varietyModel } = require('../models');
const Sequelize = require('sequelize');
require('dotenv').config()
const axios = require('axios');
var https = require('https');
const { resolve } = require('path');

class SPALiftingController {
    static fetch = async (req, res) => {
        try {
            const condition = {
                attributes: ['id', 'state_name', 'state_code', 'state_short_name'],
                order: [['state_name', 'ASC']]

            };

            const data = await stateModel.findAll(condition);

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

    static getSPAData = async (req, res) => {
        try {
            const state_id = req.query.state_id;

            const condition = {
                where: {
                    state_id: state_id
                },

                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('agency_details.user_id')), 'user_id']
                ],

                include: [
                    {
                        model: userModel,
                        attributes: ['id', 'name', 'user_type', 'agency_id', 'spa_code'],
                        where: {
                            user_type: 'SPA'
                        },
                        raw: true,
                        left: true
                    },
                ],
                raw: true
            };

            let data = await agencyDetailModel.findAll(condition);

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

    static getCropData = async (req, res) => {
        try {

            const condition = {
                attributes: ['id', 'crop_code', 'crop_name'],
                order: [['crop_name', 'ASC']]

            };

            const data = await cropModel.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);
        } catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static getVarietyData = async (req, res) => {
        try {

            const crop_code = req.query.crop_code;

            const condition = {
                where: {
                    crop_code: crop_code
                },
                attributes: ['id', 'crop_code', 'variety_code', 'variety_name'],
                order: [['variety_name', 'ASC']]

            };

            const data = await varietyModel.findAll(condition);

            if (!data) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, data);
        } catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }


    static create = async (req, res) => {
        try {
            let body = req.body;

            if (!body) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const CREATESPALIFTING = process.env.CREATESPALIFTING;
            const APPKEY = process.env.APPKEY;
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            body['appKey'] = APPKEY;

            let promise_data = new Promise((resolve, reject) => {
                axios({
                    url: CREATESPALIFTING,
                    method: 'POST',
                    httpsAgent: httpsAgent,
                    data: body
                }).then(async function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    }

                }).catch(function (error) {
                    console.log("Inside Error:", error)
                    return error

                })
            });

            if (promise_data) {
                promise_data.then((data) => {
                    console.log("==>", data)
                    return response(res, status.DATA_SAVE, 200, data);
                });
            } else {
                return response(res, status.DATA_NOT_SAVE, 404);

            }

        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
};

module.exports = SPALiftingController;