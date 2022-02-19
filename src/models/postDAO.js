import Bookmark from '../../schema/bookmarkSchema';
import Post from '../../schema/postSchema';
import TotalCount from '../../schema/totalcountSchema';
import moment from 'moment';

const createPost = async (user, data) => {
  const getCount = await TotalCount.findOne({
    id: 'UNIQUE COUNT DOCUMENT IDENTIFIER',
  });

  const result = await new Post({
    postId: getCount.postTotal,
    writer: user._id,
    categoryValue: data.category_value,
    categoryLabel: data.category_label,
    content: data.content,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
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
    categoryLabel: data.category_label,
    content: data.content,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
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

const findPostNew = async (lastId, user) => {
  const result = await Post.find(lastId ? { _id: { $lt: lastId } } : {})
    .populate('writer', 'nickname profileImage')
    .sort({ _id: -1 })
    .limit(5)
    .lean();

  for (let i in result) {
    if (user != null) {
      const state = await Bookmark.exists({
        $and: [{ post_id: result[i]._id }, { user_id: user._id }],
      });
      result[i].bookmarkState = state;
    } else {
      result[i].bookmarkState = false;
    }
  }

  return result;
};

const findPostHot = async (lastId, user) => {
  let lastObjId;
  if (lastId) {
    lastObjId = await Post.findById({ _id: lastId });
  }

  const result = await Post.find(
    // 첫번째 count.bookmark $lte, 두번째 _id $gt일때 16,15,14,13,12 / 14,12,2,1,6 / 6,5,4,17,7
    // 첫번째 count.bookmark $lt, 두번째 count.bookmark : x, _id : $lt -> 다 불러오는듯
    lastId
      ? {
          $or: [
            { 'count.bookmark': { $lt: lastObjId.count.bookmark } },
            {
              'count.bookmark': lastObjId.count.bookmark,
              _id: { $lt: lastObjId },
            },
          ],
        }
      : {}
  )
    .sort({ 'count.bookmark': -1, _id: -1 })
    .populate('writer', 'nickname profileImage')
    .limit(5)
    .lean();

  for (let i in result) {
    if (user != null) {
      const state = await Bookmark.exists({
        $and: [{ post_id: result[i]._id }, { user_id: user._id }],
      });
      result[i].bookmarkState = state;
    } else {
      result[i].bookmarkState = false;
    }
  }

  return result;
};

const countPost = async (category) => {
  const result = await Post.find(
    category ? { categoryValue: category } : {}
  ).count();
  return result;
};

const findPostsCategory = async (category, lastId, user) => {
  const result = await Post.find(
    lastId
      ? { $and: [{ _id: { $lt: lastId } }, { categoryValue: category }] }
      : { categoryValue: category }
  )
    .sort({ _id: -1 })
    .populate('writer', 'nickname profileImage')
    .limit(5)
    .lean();

  for (let i in result) {
    if (user != null) {
      const state = await Bookmark.exists({
        $and: [{ post_id: result[i]._id }, { user_id: user._id }],
      });
      result[i].bookmarkState = state;
    } else {
      result[i].bookmarkState = false;
    }
  }

  return result;
};

const checkPostId = async (postId) => {
  const result = await Post.exists({ postId: postId });
  return result;
};

const findDetailInfo = async (postId, user) => {
  const result = await Post.findOne({ postId: postId })
    .populate('writer', 'nickname profileImage')
    .lean();

  if (user != null) {
    const state = await Bookmark.exists({
      $and: [{ postId: postId }, { user_id: user._id }],
    });
    result.bookmarkState = state;
  } else {
    result.bookmarkState = false;
  }

  return result;
};

const checkPostWriter = async (postId) => {
  const result = await Post.findOne({ postId: postId }).select('writer');
  return result;
};

const removePost = async (postId) => {
  const result = await Post.findOneAndDelete({ postId: postId });
  const removeBookmark = await Bookmark.deleteMany({ post_id: result._id });
  return result;
};

const checkPostImg = async (postId) => {
  const result = await Post.findOne({ postId: postId }).select('image');
  return result;
};

const updatePostWithImg = async (postId, data, file) => {
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      categoryValue: data.category_value,
      categoryLabel: data.category_label,
      content: data.content,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      info_title: data.info_title,
      info_url: data.info_url,
      image: {
        info_image: file.key.replace('post/', ''),
        originalImageName: file.originalname,
      },
    }
  );
  return result;
};

const updatePostKeep = async (postId, data) => {
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      categoryValue: data.category_value,
      categoryLabel: data.category_label,
      content: data.content,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      info_title: data.info_title,
      info_url: data.info_url,
    }
  );
  return result;
};

const updatePostRemove = async (postId, data) => {
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      categoryValue: data.category_value,
      categoryLabel: data.category_label,
      content: data.content,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      info_title: data.info_title,
      info_url: data.info_url,
      $unset: { image: '' },
    }
  );
  return result;
};

export default {
  createPost,
  createPostWithImg,
  findPostNew,
  findPostHot,
  countPost,
  findPostsCategory,
  checkPostId,
  findDetailInfo,
  checkPostWriter,
  removePost,
  checkPostImg,
  updatePostWithImg,
  updatePostKeep,
  updatePostRemove,
};
