import multer from 'multer';
import multers3 from 'multer-s3';
import aws from 'aws-sdk';
import s3 from '../src/utils';

const storage = multers3({
  s3: s3,
  bucket: '버켓이름',
  key: (req, file, cb) => {
    cb(null, Date.now() + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({
  multers3,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('invalid file type'), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
