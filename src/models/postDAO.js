import Post from '../../schema/postSchema';
import TotalCount from '../../schema/totalcountSchema';
import moment from '../utils/moment';

const createPost = async (user, data) => {
  const getCount = await TotalCount.findOne({
    id: 'UNIQUE COUNT DOCUMENT IDENTIFIER',
  });

  const result = await new Post({
    postId: getCount.postTotal,
    writer: user._id,
    category: data.category,
    content: data.content,
    createdAt: moment.localTime,
    info_title: data.info_title,
    info_url: data.info_url,
  }).save();
  const incPostCount = await TotalCount.updateOne({ $inc: { postTotal: 1 } });
  return result;
};

const createPostWithImg = async (user, data, file) => {
  const getCount = await TotalCount.findOne({
    id: 'UNIQUE COUNT DOCUMENT IDENTIFIER',
  });

  const result = await new Post({
    postId: getCount.postTotal,
    writer: user._id,
    category: data.category,
    content: data.content,
    createdAt: moment.localTime,
    info_title: data.info_title,
    info_url: data.info_url,
    image: {
      info_image: file.key.replace('post/', ''),
      originalImageName: file.originalname,
    },
  }).save();
  const incPostCount = await TotalCount.updateOne({ $inc: { postTotal: 1 } });
  return result;
};

const findPostNew = async (tab) => {
  const result = await Post.find({}).sort({ postId: -1 });
  return result;
};
export default { createPost, createPostWithImg, findPostNew };
