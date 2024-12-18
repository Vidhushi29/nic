const Buffer = require('buffer').Buffer;
const Minio = require("minio");
const path = require('path');
const fs = require('fs');
const { BlobServiceClient } = require("@azure/storage-blob");

class FileUpload {
    static uplaod = async (base64str, folder, type) => {
        let buf = Buffer.from(base64str, 'base64');
        // const filename =  `${newDate.getTime()}.${type}`
        // console.log("filenamefilenamefilename", `${folder}${newDate.getTime()}.${type}`)
        // return `dsdsad${filename}`
        return fs.writeFile(path.join('assets/images/' + folder), buf, async (error, folder) => {
            if (error) {
                throw error;
            } else {
                console.log('File created from base64 string!');
                return folder;
            }
        });
    }

    static uploadToAzureBucket = async (base64str, imagePath) => {
        let containerName = 'insureereceipts';

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = await blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(imagePath);
        const buffer = new Buffer.from(base64str, 'base64');
        const file = blockBlobClient.upload(buffer, buffer.byteLength);

        return file
    }

    static minioClientSetUp = async () => {
        return new Minio.Client({
            endPoint: 'play.min.io',
            port: 9000,
            useSSL: true,
            accessKey: 'Q3AM3UQ867SPQQA43P2F',
            secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
        });
    }

    static download = async ({ name, extension }) => {
        console.log('name', name);
        const fileExtension = this.allowedFile({ extension });
        const minioClient = await this.minioClientSetUp();
        const filename = path.join(__dirname, `../temp/${name}`);
        console.log('filename', filename);
        await minioClient.fGetObject('seeds', name, filename);
        const image = this.base64_encode(filename);
        await fs.unlinkSync(filename);
        return image;
    }

    static base64_encode = (file) => {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return Buffer(bitmap).toString('base64');
    }

    static allowedFile = ({ extension = "" }) => {
        const allowedFiles = ['jpg', 'png', 'gif', 'jpeg', 'pdf'];
        if (!(extension && allowedFiles.includes(extension))) {
            throw new Error('File type not allowed');
        }
        return extension;
    }

    static uploadImage = async ({ upload }) => {
        const fileExtension = this.allowedFile({ extension: upload.extension });
        const imageName = `${new Date().getTime()}.${fileExtension}`;
        const minioClient = await this.minioClientSetUp();
        console.log('minioClient', minioClient);
        const isExist = await minioClient.bucketExists("seeds");
        if (!isExist) {
            await minioClient.makeBucket('seeds', 'us-east-1');
        }
        const buf = Buffer.from(upload.photo.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const uploadFile = await minioClient.putObject('seeds', imageName, buf);
        return imageName;
    }
}
module.exports = FileUpload
