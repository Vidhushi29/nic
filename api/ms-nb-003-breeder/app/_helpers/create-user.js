require('dotenv').config()
const request = require('request')
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const axios = require('axios');
var https = require('https');

class SeedUserManagement {

    static createUser = async (userData, type = null) => {
        // const {msg, mobile} = smsData
        const USER_API_URL = process.env.USER_API_URL
        const SPA_USER_API_URL = process.env.SPA_USER_API_URL

        const ENVIRONMENT = process.env.ENVIRONMENT

        console.log("USER_API_URL", USER_API_URL)
        console.log("ENVIRONMENT", ENVIRONMENT)
        console.log("userData", userData)
        if (ENVIRONMENT == 'AEOLOGIC') {
            return true;
        }

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        return new Promise((resolve, reject) => {
            axios({
                url: type == 'SPA' ? SPA_USER_API_URL : USER_API_URL,
                method: 'post',
                httpsAgent: httpsAgent,
                data: userData
            }).then(function (response) {
                console.log("response.stateCode == 200", response.status)
                // console.log("aaaaaaaresponseresponse", response)
                if (response.status == 200) {
                    //console.log("responseresponseDDDDDDDDDDDDDD", response.data)

                    if (response.data == "user created succesfully.") {
                        // resolve("done")
                        resolve(response.data)

                    }
                    resolve(response.data)
                } else {
                    resolve(response.data)
                }
                //    resolve("done")

            }).catch(function (error) {
                // handle error
                console.log("eroror", error);
            })
        });


        // let xhr = new XMLHttpRequest();

        // xhr.open("POST", USER_API_URL, true);
        // xhr.onreadystatechange = function(){
        // if (xhr.readyState == 4 && xhr.status == 200) {
        //     console.log('success');
        // }
        // };
        // // xhr.send();
        // let stringData = JSON.stringify(userData)
        // console.log("stringData", stringData)
        // xhr.send(stringData);
    }

    static createUser1 = async (userData) => {
        // const {msg, mobile} = smsData
        const USER_API_URL = process.env.USER_API_URL
        const ENVIRONMENT = process.env.ENVIRONMENT

        console.log("USER_API_URL", USER_API_URL)
        console.log("ENVIRONMENT", ENVIRONMENT)
        console.log("userData", userData)
        if(ENVIRONMENT == 'AEOLOGIC1'){
            return true;
        }
        let xhr = new XMLHttpRequest();

        xhr.open("POST", USER_API_URL, true);
        xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success');
        }
        };
        // xhr.send();
        let stringData = JSON.stringify(userData)
        console.log("stringData", stringData)
        xhr.send(stringData);
    }

    static inactiveUser = async (userData) => {

        const DEACTIVATEUSERAPI = process.env.DEACTIVATEUSERAPI;

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
     console.log("DEACTIVATEUSERAPI", DEACTIVATEUSERAPI)
        return new Promise((resolve, reject) => {
            axios({
                url: DEACTIVATEUSERAPI,
                method: 'POST',
                httpsAgent: httpsAgent,
                data: userData
            }).then(function (response) {
                if (response.status == 200) {
                    resolve(response.data)
                }

            }).catch(function (error) {
                console.log("Inside Error:", error)
            })
        });
    }

}
module.exports = SeedUserManagement;
