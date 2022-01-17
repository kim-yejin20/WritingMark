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

router.get('', postController.findPostTab);
router.get('/category/:category', postController.findPostCategory);
router.get('/:postId', postController.detailInfo);
export default router;
