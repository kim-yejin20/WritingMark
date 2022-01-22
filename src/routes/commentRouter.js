import express from 'express';
import { commentController } from '../controllers';
import { validateToken } from '../../middlewares/validateToken';

const router = express.Router();

router.post('/:postId/comment', validateToken, commentController.createComment);
router.get('/:postId/comments', commentController.findComments);
router.delete(
  '/:postId/comment/:commentId',
  validateToken,
  commentController.removeComment
);
export default router;
