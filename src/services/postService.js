import { postDAO, userDAO } from '../models';
import { s3 } from '../utils/aws';

const createNewPost = async (user, data) => {
  const result = await postDAO.createPost(user, data);
  return result;
};

const createNewPostWithImg = async (user, data, file) => {
  const result = await postDAO.createPostWithImg(user, data, file);
  return result;
};

const findPostsTab = async (tab, lastId, user) => {
  if (tab == 'new') {
    return await postDAO.findPostNew(lastId, user);
  } else if (tab == 'hot') {
    return await postDAO.findPostHot(lastId, user);
  }
};

const countPost = async (category) => {
  const result = await postDAO.countPost(category);
  return result;
};

const findPostsCategory = async (category, lastId, user) => {
  const result = await postDAO.findPostsCategory(category, lastId, user);
  return result;
};

const checkPostId = async (postId) => {
  const result = await postDAO.checkPostId(postId);
  return result;
};

const findDetailInfo = async (postId, user) => {
  const result = await postDAO.findDetailInfo(postId, user);
  return result;
};

const checkPostWriter = async (postId) => {
  const result = await postDAO.checkPostWriter(postId);
  return result;
};

const removePost = async (postId) => {
  const result = await postDAO.removePost(postId);
  return result;
};

const updatePostWithImage = async (postId, data, file) => {
  const checkPostImg = await postDAO.checkPostImg(postId);

  if (checkPostImg.image.info_image == undefined) {
    // 이미지 추가
    const result = await postDAO.updatePostWithImg(postId, data, file);
    console.log('수정전 이미지 없음 // 이미지 추가 완료');
    return result;
  }

  // 이미지 변경
  const result = await postDAO.updatePostWithImg(postId, data, file);
  const info_image = result.image.info_image;
  s3.deleteObject(
    {
      Bucket: 'writingmark',
      Key: `post/${info_image}`,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('이미지 변경 요청 // 수정 전 이미지 삭제완료 ');
    }
  );
  return result;
};

const updatePost = async (postId, data) => {
  const checkPostImg = await postDAO.checkPostImg(postId);

  if (data.info_image == checkPostImg.image.info_image) {
    // 이미지 변경 없음
    const result = await postDAO.updatePostKeep(postId, data);
    return result;
  }

  // 이미지 삭제
  const result = await postDAO.updatePostRemove(postId, data);
  const info_image = result.image.info_image;
  s3.deleteObject(
    {
      Bucket: 'writingmark',
      Key: `post/${info_image}`,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('이미지 삭제 요청 // 이미지 삭제완료 ');
    }
  );
  return result;
};

export default {
  createNewPost,
  createNewPostWithImg,
  findPostsTab,
  countPost,
  findPostsCategory,
  checkPostId,
  findDetailInfo,
  checkPostWriter,
  removePost,
  updatePostWithImage,
  updatePost,
};
