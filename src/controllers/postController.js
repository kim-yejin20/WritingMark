import { postDAO } from '../models';
import { postService } from '../services';
import { errorGenerator } from '../utils';

const createPost = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    const file = req.file;
    if (req.user == null) errorGenerator('로그인후 가능합니다', 403);
    if (file !== undefined) {
      const result = await postService.createNewPostWithImg(user, data, file);
      return res.status(201).json({
        status: 'success',
        result,
      });
    }
    const result = await postService.createNewPost(user, data);
    res.status(201).json({
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

const findPostTab = async (req, res) => {
  try {
    console.log('req.query.tab이름은' + req.query.tab + '이다');
    const tab = req.query.tab;

    if (tab == undefined) errorGenerator('잘못된 접근입니다', 400);
    const result = await postService.findPostsTab(tab);

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

export default { createPost, findPostTab };
