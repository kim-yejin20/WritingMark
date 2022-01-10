import { postDAO } from '../models';

const createNewPost = async (user, data, file) => {
  const result = await postDAO.createPost(user, data, file);
  return result;
};

export default { createNewPost };
