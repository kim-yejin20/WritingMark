import { commentService } from '../services';
import { errorGenerator } from '../utils';

const createComment = async (req, res) => {
  try {
    console.log('here!');
    const postId = req.params.postId;
    console.log(postId);
    console.log(req.body);
    const result = await commentService.createComment(
      req.user,
      postId,
      req.body.content
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

const findComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await commentService.findComments(postId);
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

const removeComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const checkComment = await commentService.checkComment(postId, commentId);
    if (checkComment == false) errorGenerator('이미 삭제된 댓글입니다.', 401);

    const checkWriter = await commentService.checkWriter(commentId);
    const user = req.user._id.toString();
    const writer = checkWriter.writer._id.toString();
    if (user != writer) errorGenerator('삭제 권한 없음', 403);

    const result = await commentService.removeComment(postId, commentId);

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

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const reqData = req.body;

    const checkWriter = await commentService.checkWriter(commentId);
    const user = req.user._id.toString();
    const writer = checkWriter.writer._id.toString();
    if (user != writer) errorGenerator('수정 권한 없음', 403);

    const result = await commentService.updateComment(commentId, reqData);
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

export default { createComment, findComments, removeComment, updateComment };
