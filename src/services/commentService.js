import { commentDAO } from '../models';

const createComment = async (user, postId, content) => {
  const result = await commentDAO.createComment(user, postId, content);
  return result;
};

const findComments = async (postId) => {
  const result = await commentDAO.findComments(postId);
  return result;
};

const checkWriter = async (commentId) => {
  const result = await commentDAO.checkWriter(commentId);
  return result;
};

const checkComment = async (postId, commentId) => {
  const result = await commentDAO.checkComment(postId, commentId);
  return result;
};

const removeComment = async (postId, commentId) => {
  const result = await commentDAO.removeComment(postId, commentId);
  return result;
};

const updateComment = async (commentId, reqData) => {
  const result = await commentDAO.updateComment(commentId, reqData);
  return result;
};

export default {
  createComment,
  findComments,
  checkWriter,
  checkComment,
  removeComment,
  updateComment,
};
