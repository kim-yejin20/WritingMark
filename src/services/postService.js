import { postDAO } from '../models';

const createNewPost = async (user, data) => {
  const result = await postDAO.createPost(user, data);
  return result;
};

const createNewPostWithImg = async (user, data, file) => {
  const result = await postDAO.createPostWithImg(user, data, file);
  return result;
};

const findPostsTab = async (tab) => {
  const result = await postDAO.findPostNew(tab);
  return result;
};

export default { createNewPost, createNewPostWithImg, findPostsTab };
