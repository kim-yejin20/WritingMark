import { postDAO } from '../models';
import { postService } from '../services';
import { errorGenerator } from '../utils';

const createPost = async (req, res) => {
  try {
    if (req.user == null) errorGenerator('로그인후 가능합니다', 403);
    const user = req.user;
    const data = req.body;
    const file = req.file;

    const result = await postService.createNewPost(user, data, file);
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { createPost };
