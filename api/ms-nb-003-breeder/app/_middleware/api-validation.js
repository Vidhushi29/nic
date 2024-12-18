const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
require('dotenv').config()

const apiValidation = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const key =  process.env.API_SECRET_KEY
        if(key == token) {
            next()
        }else{
            return response(res, status.EXPIRE_TOKEN, 401)
        }

    }catch(error){

        response(res, status.INVALID_TOKEN, 401)
    }
}

module.exports = apiValidation;
