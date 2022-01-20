import express from 'express';
import { registerLoginValidator } from '../../middlewares/validation';
import { validateToken } from '../../middlewares/validateToken';
import { userController } from '../controllers';

const router = express.Router();

router.get('', validateToken, userController.user);
router.post('/register', [registerLoginValidator], userController.register); //회원가입
router.post('/login', [registerLoginValidator], userController.login);
// router.get('/info', validateToken, userController.userInfo);
router.get('/info/edit', validateToken, userController.userInfo);
router.patch('/info/edit', validateToken, userController.changeUserInfo);
router.get('/posts', validateToken, userController.findUserPost);
router.post(
  '/bookmark/:postId',
  validateToken,
  userController.createUserBookmark
);

router.delete(
  '/bookmark/:postId',
  validateToken,
  userController.removeUserBookmark
);
router.get('/bookmarks', validateToken, userController.findUserBookmark);

router.post('/withdrawal', validateToken, userController.removeUserInfo);

export default router;
