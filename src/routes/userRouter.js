import express from 'express';
import { registerLoginValidator } from '../../middlewares/validation';
import { changeInfoValidator } from '../../middlewares/validation';
import { changePwValidator } from '../../middlewares/validation';
import { validateToken } from '../../middlewares/validateToken';
import { userController } from '../controllers';
import { upload } from '../../middlewares/upload';
import passport from 'passport';

const router = express.Router();

router.get('', validateToken, userController.user);
router.post('/register', [registerLoginValidator], userController.register); //회원가입
router.post('/login', [registerLoginValidator], userController.login);

//카카오 소셜로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  'kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/kakao' }),
  (req, res) => {
    res.redirect(`/${req.user.user_id}`);
  }
);

router.get('/info/edit', validateToken, userController.userInfo);
router.patch(
  '/info/edit',
  validateToken,
  [changeInfoValidator],
  upload.single('user_profile'),
  userController.changeUserInfo
);
router.patch(
  '/info/password',
  [changePwValidator],
  validateToken,
  userController.changeUserPassword
);
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

// 회원탈퇴 로직 다시 작성필요
router.post('/withdrawal', validateToken, userController.removeUserInfo);

export default router;
