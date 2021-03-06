import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const totalCountSchema = new Schema({
  id: { type: String },
  postTotal: {
    type: Number,
    default: 1,
  },
  commentTotal: {
    type: Number,
    default: 1,
  },
});

const TotalCount = mongoose.model('TotalCount', totalCountSchema);

// 문서 생성
// const doc = new TotalCount({
//   id: 'UNIQUE COUNT DOCUMENT IDENTIFIER',
// }).save();

export default TotalCount;
