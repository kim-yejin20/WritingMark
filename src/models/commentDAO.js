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
  console.log(postObj._id);
  const post_id = postObj._id;

  const addComment = await new Comment({
    postId: postId,
    post_id: post_id,
    writer: user._id,
    content: content,
    createdAt: moment.localTime,
  }).save();

  console.log('addComment?', addComment);

  const result = await Comment.findById({ _id: addComment._id }).populate(
    'writer',
    'nickname profileImage'
  );
  console.log(result);
  return result;
};

const findComments = async (postId) => {
  const result = await Comment.find({ postId: postId })
    .select('_id writer content createdAt')
    .populate('writer', 'nickname profileImage')
    .sort({ _id: -1 });
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
    { content: reqData.content },
    { new: true }
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
