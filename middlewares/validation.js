import { check, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

export const registerLoginValidator = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('이메일은 필수 항목입니다.')
    .bail()
    .isEmail()
    .withMessage('이메일형식이 아닙니다.'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('비밀번호는 필수 항목입니다.')
    .bail()
    .isLength({ min: 7 })
    .withMessage('비밀번호는 최소 7글자 이상이어야합니다.'),

  validate,
];

export const changeInfoValidator = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('이메일은 필수 항목입니다.')
    .bail()
    .isEmail()
    .withMessage('이메일형식이 아닙니다.'),
  check('nickname')
    .not()
    .isEmpty()
    .withMessage('닉네임은 필수 항목입니다')
    .bail()
    .isLength({ max: 7 })
    .withMessage('닉네임은 최대 7글자입니다'),

  validate,
];

export const changePwValidator = [
  check('password').not().isEmpty().withMessage('비밀번호는 필수 항목입니다.'),
  check('newPassword')
    .not()
    .isEmpty()
    .withMessage('새로운 비밀번호는 필수 항목입니다')
    .isLength({ min: 7 })
    .withMessage('비밀번호는 최소 7글자 이상이어야합니다.'),
  check('checkPassword')
    .not()
    .isEmpty()
    .withMessage('비밀번호 확인은 필수 항목입니다')
    .isLength({ min: 7 })
    .withMessage('비밀번호는 최소 7글자 이상이어야합니다.'),

  validate,
];
