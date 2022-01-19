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
    categoryValue: data.category_value,
    categoryLabel : data.category_label,
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
    categoryValue: data.category_value,
    categoryLabel : data.category_label,
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

const findPostNew = async () => {
  const result = await Post.find({})
    .populate('writer', 'nickname profileImage')
    .sort({ postId: -1 });
  return result;
};

const findPostHot = async () => {
  const result = await Post.find({})
    .populate('writer', 'nickname profileImage')
    .sort({ 'count.bookmark': -1 });
  return result;
};

const findPostsCategory = async (category) => {
  const result = await Post.find({ categoryValue: category }).populate(
    'writer',
    'nickname profileImage'
  );
  return result;
};

const checkPostId = async (postId) => {
  const result = await Post.exists({ postId: postId });
  console.log('확인결과', result);
  return result;
};

const findDetailInfo = async (postId) => {
  const result = await Post.findOne({ postId: postId }).populate(
    'writer',
    'nickname profileImage'
  );
  return result;
};

const checkPostWriter = async (postId) => {
  const result = await Post.findOne({ postId: postId }).select('writer');
  console.log('결과?', result);
  // console.log('글쓴사람?', result.writer);
  return result;
};

const removePost = async (postId) => {
  const result = await Post.findOneAndDelete({ postId: postId });
  console.log('다오에서 결과값', result);
  return result;
};

const updatePost = async (postId, data, file) => {
  const result = await Post.findOneAndUpdate({postId : postId}, {category: data.category,
    content: data.content,
    createdAt: moment.localTime,
    info_title: data.info_title,
    info_url: data.info_url,
    image: {
      info_image: file.key.replace('post/', ''),
      originalImageName: file.originalname,
    },})
  return result
}

export default {
  createPost,
  createPostWithImg,
  findPostNew,
  findPostHot,
  findPostsCategory,
  checkPostId,
  findDetailInfo,
  checkPostWriter,
  removePost,
  updatePost
};
