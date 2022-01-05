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
      const result = resolve('익명' + buf.toString('hex'));
    });
  });

export default { makeRandomNickname };
