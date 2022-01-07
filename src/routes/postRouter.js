import express from 'express';

const router = express.Router();

router.post('', postController.createPost);

export default router;
