import express from 'express';
import { registerValidator } from '../../middlewares/validation';
import { userController } from '../controllers'; // userController 완성하면 여기에 임포트
// import middlewares from //여기에 미들웨어넣기

const router = express.Router();

router.post('/register', [registerValidator], userController.register); //회원가입
router.post('/login', userController.login);
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
