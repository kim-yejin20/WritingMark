import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { s3 } from '../src/utils/aws';
import { v4 } from 'uuid';
import { errorGenerator } from '../src/utils';
import { checkDuplicate } from './checkDuplicate';

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
  fileFilter: async (req, file, cb) => {
    if (file.fieldname == 'user_profile') {
      const checkTest = await checkDuplicate(req);
      if (checkTest == null) cb(null, true);
      if (req.ValidationError) return cb(null, false);
      // if (req.ValidationError) cb(null, false);
      // if (checkTest == req.ValidationError) return cb(null, false);
      // if (checkTest == req.ValidationError) cb(req.ValidationError, false);
      // else cb(new Error('중복이 있습니다'), false);
    }
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('invalid file type'), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

// export default { upload };
