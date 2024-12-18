// const Minio = require("minio");
// const Multer = require("multer");
// const path = require('path');


// class UploadController {
//     static clientSetUp = async () => {
//         return new Minio.Client({
//             endPoint: 'play.min.io',
//             port: 9000,
//             useSSL: true,
//             accessKey: 'Q3AM3UQ867SPQQA43P2F',
//             secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
//         });
//     }

//     static upload = async (req, res) => {
//         console.log('hiiiiiiiii');
//         console.log('req.body', req);
//         const minioClient = await this.clientSetUp();
//         const isExist = await minioClient.bucketExists("seeds");
//         if (!isExist) {
//             const createBucket = await minioClient.makeBucket('seeds', 'us-east-1');
//             console.log('Bucket created successfully in "us-east-1".')
//             console.log('createBucket', createBucket);
//         }
//         console.log('isExist', isExist);

//         const uploadFile = await minioClient.putObject('seeds', req.file.originalname, req.file.buffer);
//         console.log('upload', uploadFile);
//         if (!uploadFile) {
//             return console.log(uploadFile)
//         }

//         console.log('File uploaded successfully.');
//         res.json({
//             message: 'File uploaded successfully.',
//             status: 200,
//         });
//     }
//     static download = async (req, res) => {
//         const { filename = "" } = req.query;
//         console.log('filename', filename);
//         const minioClient = await this.clientSetUp();
//         const file = await minioClient.getObject('seeds', filename);
//         return file.pipe(res);
//     }

// }

// module.exports = UploadController;