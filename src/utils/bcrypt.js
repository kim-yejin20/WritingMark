import bcrypt from 'bcrypt';

const encryptPassword = async (password, salt) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
const comparePassword = async (inputPassword, dbPassword) => {
  const validPassword = await bcrypt.compare(inputPassword, dbPassword);
  return validPassword;
};

export default { encryptPassword, comparePassword };
