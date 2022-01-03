import bcrypt from 'bcrypt';

const encryptPassword = async (password, salt) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
