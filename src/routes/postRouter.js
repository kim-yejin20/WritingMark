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
router.get('/category', validateToken, postController.findPostCategory);
router.get('/:postId', validateToken, postController.detailInfo);
router.delete('/:postId', validateToken, postController.removePost);
router.patch(
  '/:postId',
  validateToken,
  upload.single('info_image'),
  postController.updatePost
);

export default router;
