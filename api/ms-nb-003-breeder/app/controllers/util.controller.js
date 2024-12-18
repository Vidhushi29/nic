const AWS = require('aws-sdk');
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const uuid = require("uuid").v4;

const response = require('../_helpers/response');
const status = require('../_helpers/status.conf');
const crypto = require('crypto');
const axios = require('axios');
const AES = require('../_helpers/AES')
const {
  designationModel,
  insitutionModel,
  sequelize
} = require('../models');

class UtilController {
  static getInstitute = async (req, res) => {
    const data = await insitutionModel.findAll({ order: [['insitution_name', 'ASC']], raw: true });

    if (!(data && data.length)) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    return response(res, status.DATA_AVAILABLE, 200, data);
  }

  static getDesignation = async (req, res) => {
    let  data = await designationModel.findAll({ order: [['name', 'ASC']], 
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('m_designations.name')), 'name'],
      '*'
      // 'table_id'
      // [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'agency_name'],     
      // 'id'
    ],
    raw: true });
    // data= data.filter((arr, index, self) =>
    // index === self.findIndex((t) => (t.name === arr.name )))


    if (!(data && data.length)) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    return response(res, status.DATA_AVAILABLE, 200, data);
  }

  static upload = async (req, res) => {
    try {
      let data = {
                "ETag": "\"da9243de7acd30af0622738bd9622e8d\"",
               "name": "upload/39cc211c-0137-41bb-9ebb-f22e1fc16bf4-Indenter_list (13).pdf"
            }
        
           return res.json({ status: "success", "results":data});
        
      /*
      const { folderName = "" } = req.body;
      const allowedFile = ['pdf', 'png', 'jpg', 'jpeg'];
      if (!(allowedFile.includes(file.mimetype.split('/')[1]))) {
        return response(res, status.ALLOWED_IMAGE, 404);
      }

      if (file.size > 2000000) {
        return response(res, status.IMAGE_SIZE, 404);
      }
      const results = await this.s3Uploadv3(file, folderName);
      return res.json({ status: "success", results });*/
    } catch (err) {
      console.log("error: ",err);
      return res.json({ status: "error", err });
    }
  }

  // static getFile = async (req, res) => {
  //   const s3client = new S3Client({ region: process.env.AWS_REGION });

  //   const bucketParams = {
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: req.query.file,
  //   };

  //   const getObjectCommand = new GetObjectCommand(bucketParams);
  //   const url = await getSignedUrl(s3client, getObjectCommand, { expiresIn: 3600 });
  //   console.log('url: ' + url);
  //   return response(res, status.DATA_AVAILABLE, 200, url);
  // }

  static getFile = async (req, res) => {

  var params = {  Bucket: process.env.AWS_BUCKET_NAME,  Key: req.query.file,};
  console.log(params,"params data");
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.END_POINT,
      s3ForcePathStyle: true, // needed with NIC Object Storage?
      signatureVersion: 'v4',
      Bucket: process.env.AWS_BUCKET_NAME
    });

    s3.getObject(params, function (err, data) {
        try {
            if (data != null) {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.write(data.Body);
                res.end();
            } else {
                console.log("Data Not found");
            }
        } catch (err) {
            console.log(err);
        }
    });
}

  // static getFile = async (req, res) => {
  //   AWS.config = new AWS.Config({
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     region: process.env.AWS_REGION,
  //   });
  //   const s3 = new AWS.S3({ region: process.env.AWS_REGION });
  //   const params = {
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: req.query.file
  //   }

  //   const preSignUrl = s3.getSignedUrl("getObject", params);
  //   console.log('url: ' + preSignUrl);
  //   return response(res, status.DATA_AVAILABLE, 200, preSignUrl);
  // }

  // static s3Uploadv3 = async (file, folderName) => {
  //   const s3client = new S3Client({ region: process.env.AWS_REGION });
  //   const folder = folderName ? folderName : "upload";
  //   const params = {
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: `${folder}/${uuid()}-${file.name}`,
  //     Body: file.data,
  //     ACL: 'public-read'
  //   };
    

  //   const command = await s3client.send(new PutObjectCommand(params));
  //   return { ...command, name: params.Key };
  // };

  static s3Uploadv3 = async (file) => {
    console.log("process.env.AWS_BUCKET_NAME", process.env.AWS_BUCKET_NAME)
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.END_POINT,
      s3ForcePathStyle: true, // needed with NIC Object Storage?
      signatureVersion: 'v4',
      Bucket: process.env.AWS_BUCKET_NAME
    });
    console.log("s3", s3)
    // const s3 = new AWS.S3({ params: { Bucket: process.env.AWS_BUCKET_NAME } });

    const params = {
      Key: `upload/${uuid()}-${file.name}`,
      Body: file.data,
      // ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'public-read',
    };
    console.log(params);
    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const returnData =  { ...data, name: params.Key };
          resolve(returnData);
          console.log('>>>>>>>>>>>>', returnData);
        }
      });
    });
    // const command = await s3client.send(new PutObjectCommand(params));
    // return { ...command, name: params.Key };
  };

    static makeHttpRequest = async(req, res)=> {
      try {
        let { encryptedParameter } = req.body
        console.log("process.env.VAHAN_STATUS_API", process.env.VAHAN_STATUS_API)
        const url = `${process.env.VAHAN_STATUS_API}${encryptedParameter}`;
        console.log("url", url)
        const headers = {
          'Content-Type': 'application/json',
        };

        const response = await axios.post(url, null, { headers });
        console.log("response.data", response.data, response)
        return res.send(
          {
            status_code: 200,
            data: response.data
          }          
        );
      } catch (error) {
        console.error('HTTP Request Error:', error.message);
        // return null;
        return res.send(
          {
            status_code: 500,
            data: []
          }          
        );
      }
    }

    static encryptData = async(req, res)=> {
      try {
        let { param } = req.body
        let strToEncrypt = param
        let secret = process.env.VAHAN_SECRET_KEY;
        const cipherTransformation = 'aes-128-ecb'; // AES with ECB mode
        const characterEncoding = 'utf-8';
        console.log("data for encryption", strToEncrypt)

        const sha = crypto.createHash('sha1');
        sha.update(secret, characterEncoding);
        const key = sha.digest().slice(0, 16);
        const cipher = crypto.createCipheriv(cipherTransformation, key, '');
        let encrypted = cipher.update(strToEncrypt, characterEncoding, 'base64');
        encrypted += cipher.final('base64');
        console.log("encrypted data", encrypted)
        return res.send(
              {
                status_code: 200,
                data: encrypted
              }          
          );
      } catch (e) {
        console.error('Error while encrypting:', e.toString());
      }
    }

    static decryptData = async(req, res)=> {
      try {
        let secret = process.env.VAHAN_SECRET_KEY; 
        let { strToDecrypt } = req.body
        const cipherTransformation = 'aes-128-ecb'; // AES with ECB mode
        const characterEncoding = 'utf-8';
        const sha = crypto.createHash('sha1');
        sha.update(secret, characterEncoding);
        const key = sha.digest().slice(0, 16);
        const cipher = crypto.createDecipheriv(cipherTransformation, key, '');
        let decrypted = cipher.update(strToDecrypt, 'base64', characterEncoding);
        decrypted += cipher.final(characterEncoding);
        console.log("decrypted", decrypted)
        return res.send(
            {
              status_code: 200,
              data: JSON.parse(decrypted)
            }          
        );

      } catch (e) {
        console.error('Error while decrypting:', e.toString());
      }
    }

    static encryptVahan = async(req, res) =>{
      const { param } = req.body
      console.log("param" ,  param)
      const data = AES.cscEncryption(param.trim())
      res.send(
        {
          status_code: 200,
          data: data
        }
      );
    }


    static decryptVahan = async(req, res) =>{
      const { param } = req.body
      console.log("param", param)
      const data = AES.cscDecryption(param)
      // console.log(AES.cscDecryption('aHhHWU0M6qU0GI+ZfGNjJ/VGjEUABjTWMe6HOePFrA6LfvTNbmzXpJher54LUsikBw43ifiUqbdQemPIZaGCzg=='))
      res.send(
        {
          status_code: 200,
          data: data
        }
      );
    }
      

    static encryptStatusData = async(req, res)=> {
      try {
        const cipherTransformation = 'aes-128-ecb'; // AES with ECB mode
        const characterEncoding = 'utf-8';
        //const {strToEncrypt} =  req.body 
        const {param} =  req.body 
        let strToEncrypt= param

        let secret = process.env.VAHAN_SECRET_KEY; 
        const sha = crypto.createHash('sha1');       

        let key = Buffer.from(secret, characterEncoding);
        key = sha.update(key).digest().slice(0, 16);
        key = Buffer.from(key);
        console.log("encrypted---")

        const cipher = crypto.createCipheriv(cipherTransformation, key, null);
        let encrypted = cipher.update(strToEncrypt, characterEncoding, 'base64');
        encrypted += cipher.final('base64');
        console.log("encrypted", encrypted)
        // return encrypted;
        return res.send(
          {
            status_code: 200,
            data: encrypted
          }          
      );
      } catch (error) {
        console.error('Error while encrypting:', error.toString());
      }
      return null;    
    }

    static decryptStatusData = async(req, res)=> {
      try {
        const {strToDecrypt} =  req.body 
	//const {param} =  req.body 
	//let strToDecrypt = param

        const secret = process.env.VAHAN_SECRET_KEY;
        const cipherTransformation = 'aes-128-ecb'; // AES with ECB mode
        const characterEncoding = 'utf-8';
        // let key = Buffer.from(myKey, characterEncoding);
        const sha = crypto.createHash('sha1');       

        let key = Buffer.from(secret, characterEncoding);
        key = sha.update(key).digest().slice(0, 16);
        const secretKey = Buffer.from(key);

        const decipher = crypto.createDecipheriv(cipherTransformation, secretKey, null);
        let decrypted = decipher.update(strToDecrypt, 'base64', characterEncoding);
        decrypted += decipher.final(characterEncoding);
        console.log("decrypted", decrypted)
        // return decrypted;
        return res.send(
          {
            status_code: 200,
            data: decrypted
          })
      } catch (error) {
        console.error('Error while decrypting:', error.toString());
      }
      return null;    
    }


}


module.exports = UtilController;