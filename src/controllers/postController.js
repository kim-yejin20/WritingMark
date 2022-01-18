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
    const tab = req.query.tab;

    const tabArray = ['new', 'hot'];
    const ArrReturn = tabArray.includes(tab);
    if (ArrReturn == false) errorGenerator('페이지를 찾을 수 없습니다', 400);

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

const findPostCategory = async (req, res) => {
  try {
    console.log('controller');
    const category = req.params.category;

    const cateArray = [
      'web-content',
      'essay',
      'novel',
      'poetry',
      'knowledge',
      'etc',
    ];
    const ArrReturn = cateArray.includes(category);
    if (ArrReturn == false) errorGenerator('페이지를 찾을 수 없습니다', 400);

    const result = await postService.findPostsCategory(category);
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

const detailInfo = async (req, res) => {
  try {
    const postId = req.params.postId;

    const checkPostId = await postService.checkPostId(postId);
    if (checkPostId == false)
      errorGenerator('잘못된 주소이거나, 비공개 또는 삭제된 글입니다', 400);
    const result = await postService.findDetailInfo(postId);
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

const removePost = async (req, res) => {
  try {
    console.log('req.user는?', req.user);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default {
  createPost,
  findPostTab,
  findPostCategory,
  detailInfo,
  removePost,
};
