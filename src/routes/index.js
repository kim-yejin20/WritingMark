import express from 'express';
import userRouter from './userRouter';
import postRouter from './postRouter';
import commentRouter from './commentRouter';
// 각 라우터들 이 밑으로 불러오기

const router = express.Router();

router.use('/user', userRouter);
router.use('/posts', postRouter);
router.use('/post', commentRouter);

export default router;
