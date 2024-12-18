require('dotenv').config()
const request = require('request')
const axios = require('axios');
var https = require('https');
const sendSms = (smsData) => {
        const SMS_URL = process.env.SMS_URL ? process.env.SMS_URL : 'https://hydgw.sms.gov.in/failsafe/MLink';
        const USERNAME = process.env.USERNAME?process.env.USERNAME:'kisaan.sms'
        const SIGNATURE = process.env.SIGNATURE?process.env.SIGNATURE:'KISAAN'
        const DLT_ENTITY_ID = process.env.DLT_ENTITY_ID?process.env.DLT_ENTITY_ID:'1301157485792044671'
        const PIN = process.env.PIN?process.env.PIN:'Y5&cB8@yB8'

        const headers = {
        'Accept': 'application/json',
        // 'Content-Type': 'text/plain',
         'Content-Type': 'application/x-www-form-urlencoded', 
        };

        const data = {
            username: USERNAME,
            pin: PIN,
            mnumber: smsData.mnumber ? smsData.mnumber : '9456927350',
            message: smsData.message ? smsData.message :'Your one time password for Sathi is 123456',
            signature: SIGNATURE,
            dlt_entity_id: DLT_ENTITY_ID,
            dlt_template_id: smsData.dlt_template_id? smsData.dlt_template_id:'1507167040737689031',
        };
        
        console.log("data", data)
        console.log("data", JSON.stringify(data))

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        axios({
            url: SMS_URL,
            data: data,
            method: 'POST',
            httpsAgent: httpsAgent,
            headers: headers
        }).then(response => {
            console.log("success",response.data);
        })
        .catch(error => {
            console.error("error",error);
        });
            
}
module.exports = sendSms;
