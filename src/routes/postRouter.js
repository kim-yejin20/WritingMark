import express from 'express';
import { postController } from '../controllers';
import { upload } from '../../middlewares/upload';
import { validateToken } from '../../middlewares/validateToken';

const router = express.Router();

router.post(
  '',
  validateToken,
  upload.single('info_image'),
  postController.createPost
);

router.get('', validateToken, postController.findPostTab);

export default router;
