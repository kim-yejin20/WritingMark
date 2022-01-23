import Comment from '../../schema/commentSchema';
import Post from '../../schema/postSchema';
import moment from '../utils/moment';

const createComment = async (user, postId, content) => {
  const postObj = await Post.findOneAndUpdate(
    { postId: postId },
    { $inc: { 'count.comment': 1 } },
    { new: true }
  );

  console.log('postObj???', postObj);
  const result = await new Comment({
    postId: postId,
    post_id: postObj._id,
    writer: user._id,
    content: content,
    createdAt: moment.localTime,
  }).save();

  return result;
};

const findComments = async (postId) => {
  const result = await Comment.find({ postId: postId })
    .select('_id writer content createdAt')
    .populate('writer', 'nickname profileImage')
    .sort({ createdAt: -1 });
  return result;
};

const checkWriter = async (commentId) => {
  const result = await Comment.findById({ _id: commentId }).select('writer');
  return result;
};

const checkComment = async (postId, commentId) => {
  const result = await Comment.exists({
    $and: [{ postId: postId }, { _id: commentId }],
  });
  return result;
};

const removeComment = async (postId, commentId) => {
  const result = await Comment.findByIdAndDelete({ _id: commentId });
  const decCommentCount = await Post.findOneAndUpdate(
    { postId: postId },
    { $inc: { 'count.comment': -1 } },
    { new: true }
  );
  // return 확인하기!
  return decCommentCount;
};

const updateComment = async (commentId, reqData) => {
  const result = await Comment.findByIdAndUpdate(
    { _id: commentId },
    { content: reqData.content }
  );
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
