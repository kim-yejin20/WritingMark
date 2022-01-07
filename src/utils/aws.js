import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const AWS_SECRETKEY = process.env.AWS_SECRETKEY;
const AWS_ACCESSKEY = proces.env.AWS_ACCESSKEY;

const s3 = new aws.S3({
  secretAccessKey: AWS_SECRETKEY,
  accessKeyId: AWS_ACCESSKEY,
});

export default { s3 };
