require('dotenv').config()
const request = require('request')

const sendSms = (smsData) => {

    // const sms = "Hi, please verify your Mobile Number via OTP "+smsData.otp+" at InsurePays to ensure your details are secured. Validity of OTP is for next 5 minutes only - Aaj ki shanti. Kal ki Prashanti only via InsurePays."

    console.log("smsDatasmsData", smsData)
request.post({url:'https://mkisan.gov.in/ksewa/otpsms.aspx', form: {
                                                                    txtMsg:smsData.sms,
                                                                    Mobileno:smsData.mobileNumber,
                                                                    SMSMode:`${process.env.SMSMODE}`,
                                                                    UserId:`${process.env.SMSUSERID}`,
                                                                    authcode:`${process.env.SMSAUTHCODE}`,
                                                                    }
                       }, 
                       function(err,httpResponse,body){ console.log("resp" ,body);})
}


module.exports = sendSms;
