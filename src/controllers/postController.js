import { postDAO } from '../models';
import { postService } from '../services';

const createPost = async (req, res) => {
  try {
    if (req.user == null) {
      res.status(400).json({
        status: 'fail',
        message: '게시글 작성 권한없음',
      });
    }
    console.log('유저:', req.user);
    console.log('파일:', req.file);
    console.log('오리지널파일:', req.file.originalname);
    console.log('controll!');
    const test = req.file.originalname;
    console.log(test);
    res.status(200).json({
      status: 'success',
      test,
    });
  } catch (err) {
    // if (!statusCode) {
    //   res.status(400).josn({
    //     status: 'fail',
    //     message: err.message,
    //   });
    // }
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { createPost };
