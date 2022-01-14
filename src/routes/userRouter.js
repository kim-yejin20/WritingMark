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
router.get('/posts', validateToken, userController.readUserWritten);
router.post('/bookmark/:postId', validateToken, userController.userBookmark);
router.get(
  '/bookmarks/test',
  validateToken,
  userController.findUserBookmarkTest
);

//원래 여기 미들웨어가 어떻게 있어야하냐면
// router.post('/register', 미들웨어자리, function (요청, 응답) {
//   응답.send('마이페이지입니다.');
// });

function 미들웨어자리(req, res, next) {
  // req = req.body;
  console.log('여기가 미들웨어다!');
  next();
}
export default router;
