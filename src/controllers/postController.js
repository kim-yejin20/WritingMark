import { postDAO } from '../models';
import { postService } from '../services';
import { errorGenerator } from '../utils';
import { s3 } from '../utils/aws';

const createPost = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    const file = req.file;
    console.log('data는?',data);
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
    const postId = req.params.postId;
    console.log('user는?', req.user);

    const checkPost = await postService.checkPostWriter(postId);
    if (!checkPost) errorGenerator('이미 삭제된 게시글입니다', 400);
    const user = req.user._id.toString();
    const writer = checkPost.writer._id.toString();

    if (req.user.role == 'user' && user != writer)
      errorGenerator('삭제 권한없음', 403);
    const result = await postService.removePost(postId);
    const info_image = result.image.info_image;

    s3.deleteObject(
      { Bucket: 'writingmark', Key: `post/${info_image}` },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log('이미지까지 삭제 완료');
      }
    );

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.user;
    const data = req.body;
    const file = req.file;

    const checkPost = await postService.checkPostWriter(postId);
    const user_id = req.user._id.toString();
    const writer_id = checkPost.writer._id.toString();

    if (req.user.role == 'user' && user_id != writer_id)
      errorGenerator('수정 권한없음', 403);
    const result = await postService.updatePost(postId, data, file);
    // result는 수정 전의 s3객체 키를 가지고 있음. 

    s3.deleteObject(
      { Bucket: 'writingmark', Key: `post/${info_image}` },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log('이미지까지 삭제 완료');
      }
    );


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

export default {
  createPost,
  findPostTab,
  findPostCategory,
  detailInfo,
  removePost,
  updatePost,
};
