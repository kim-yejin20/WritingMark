import crypto from 'crypto';
import { promisify } from 'util';

// function getKey(size) {
//   return randomBytesAsync(size);
// }

// getKey(2).then((key) => console.log(key));

// const makeRandomNickname = () => {
//   const randomName = 'hi' + crypto.randomBytes(2).toString('hex');
//   return randomName;
// };

const makeRandomNickname = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(2, (err, buf) => {
      if (err) reject(err);
      resolve('익명' + buf.toString('hex'));
    });
  });

// function makeRandomNickname() {
//   console.log('여기 유틸임');
//   const result = 'hi' + crypto.randomBytes(2).toString('hex');
//   console.log(result);
//   return result;
//   // console.log('여기 유틸임');
//   // const randomName = 'hi' + crypto.randomBytes(2).toString('hex');
//   // return result;
//   // return result;
// }

export default { makeRandomNickname };
