import { postDAO, userDAO } from '../models';

const createNewPost = async (user, data) => {
  const result = await postDAO.createPost(user, data);
  return result;
};

const createNewPostWithImg = async (user, data, file) => {
  const result = await postDAO.createPostWithImg(user, data, file);
  return result;
};

const findPostsTab = async (tab) => {
  console.log('tab은?', tab);
  if (tab == 'new') {
    return await postDAO.findPostNew();
  } else if (tab == 'hot') {
    return await postDAO.findPostHot();
  }

  // const result = await postDAO.findPostNew(tab);
  // return result;
};

const findPostsCategory = async (category) => {
  const result = await postDAO.findPostsCategory(category);
  return result;
};

const checkPostId = async (postId) => {
  const result = await postDAO.checkPostId(postId);
  return result;
};

const findDetailInfo = async (postId) => {
  const result = await postDAO.findDetailInfo(postId);
  return result;
};

export default {
  createNewPost,
  createNewPostWithImg,
  findPostsTab,
  findPostsCategory,
  checkPostId,
  findDetailInfo,
};
