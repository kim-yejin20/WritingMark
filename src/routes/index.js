import express from 'express';
import userRouter from './userRouter';
// 각 라우터들 이 밑으로 불러오기

const router = express.Router();

router.use('/user', userRouter);

export default router;
