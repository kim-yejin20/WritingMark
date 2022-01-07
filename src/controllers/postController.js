import { postDAO } from '../models';
import { postService } from '../services';


const createPost = async (req, res) => {
  try {
  } catch (err) {
    if (!statusCode) {
      res.status(400).josn({
        status: 'fail',
        message: err.message,
      });
    }
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { createPost };
