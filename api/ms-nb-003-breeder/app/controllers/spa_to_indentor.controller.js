const Validator = require('validatorjs');
const response = require('../_helpers/response');
const Sequelize = require('sequelize');
const status = require('../_helpers/status.conf');
const { agencyDetailModel, stateModel } = require('../models');
require('dotenv').config()
const request = require('request')
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const axios = require('axios');
var https = require('https');
const { resolve } = require('path');

class SPAToIndentor {

    static getAgencyData = async (req, res) => {
        try {
            const id = req.query.id;

            if (!id) {
                return response(res, status.REQUEST_DATA_MISSING, 400);
            }

            const condition = {
                include: [
                    {
                        model: stateModel
                    }
                ],
                attributes: ['id', 'state_id',],
                where: {
                    id: id
                }
            }

            const agency = await agencyDetailModel.findOne(condition);

            if (!agency) {
                return response(res, status.DATA_NOT_AVAILABLE, 404);
            }

            return response(res, status.DATA_AVAILABLE, 200, agency);
        }
        catch (error) {
            const returnResponse = {
                message: error.message,
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }

    static fetch = async (req, res) => {
        try {

            const stateCode = req.body.stateCode ? req.body.stateCode : null;
            const APPKEY = process.env.APPKEY;
            let GETALLSPA;
            let coockie;
            let newUrl
            if (req.body && req.body.loginedUserid && req.body.loginedUserid.username === "ind-nsc") {
                console.log("if data")
                GETALLSPA = process.env.SEED_TRACE_URL;
                newUrl = GETALLSPA + "?apiKey=" + APPKEY + "&stateCode=" + stateCode;
                // + "?appKey=" + APPKEY + "&stateCode=" + stateCode;
                // coockie = {
                //     headers:
                //     {
                //         'Cookie': 'appKey=' + APPKEY + ';'
                //     },
                // } // Include cookies in the request
            } else {
                console.log("else data")
                // const stateCode = 3
                GETALLSPA = process.env.GETALLSPA;
                newUrl = GETALLSPA + "?appKey=" + APPKEY + "&stateCode=" + stateCode
            }
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            const data = await new Promise((resolve, reject) => {
                axios({
                    url: newUrl,
                    method: 'get',
                    httpsAgent: httpsAgent,
                    ...coockie
                }).then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    }

                }).catch(function (error) {
                    console.log("Inside Error:", error)
                })
            });
            console.log('data=====', data);
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


    static update = async (req, res) => {
        try {
            const stateCode = req.body['stateCode'];
            const spaCode = req.body['spaCode'];

            const UPDATESPA = process.env.UPDATESPA
            const APPKEY = process.env.APPKEY

            const body = {
                "stateCode": stateCode,
                "appKey": APPKEY,
                "spaCode": spaCode,
                "setBy": "ADMIN"
            }

            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            const data = await new Promise((resolve, reject) => {
                axios({
                    url: UPDATESPA,
                    method: 'POST',
                    httpsAgent: httpsAgent,
                    data: body
                }).then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    }
                }).catch(function (error) {
                    console.log("Inside Error:", error)
                })
            });

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

    static remove = async (req, res) => {
        try {
            const stateCode = req.body['stateCode'];
            const spaCode = req.body['spaCode'];

            const REMOVESPA = process.env.REMOVESPA
            const APPKEY = process.env.APPKEY

            const body = {
                "stateCode": stateCode,
                "appKey": APPKEY,
                "spaCode": spaCode,
                "unSetBy": "ADMIN"
            }

            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            const data = await new Promise((resolve, reject) => {
                axios({
                    url: REMOVESPA,
                    method: 'POST',
                    httpsAgent: httpsAgent,
                    data: body
                }).then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    }

                }).catch(function (error) {
                    console.log("Inside Error:", error)
                })
            });

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

module.exports = SPAToIndentor;