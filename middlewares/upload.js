import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { s3 } from '../src/utils/aws';
import { v4 } from 'uuid';

const storage = multerS3({
  s3,
  bucket: 'writingmark',
  key: (req, file, cb) => {
    if (file.fieldname == 'info_image') {
      cb(null, `post/${Date.now()}.${file.originalname.split('.').pop()}`);
    }
    if (file.fieldname == 'user_profile') {
      cb(null, `user/${Date.now()}.${file.originalname.split('.').pop()}`);
    }
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('invalid file type'), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

// export default { upload };
