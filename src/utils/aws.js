import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const AWS_SECRETKEY = process.env.AWS_SECRETKEY;
const AWS_ACCESSKEY = process.env.AWS_ACCESSKEY;

export const s3 = new aws.S3({
  secretAccessKey: AWS_SECRETKEY,
  accessKeyId: AWS_ACCESSKEY,
});

// export default { s3 };
