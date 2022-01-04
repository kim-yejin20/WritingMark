const errorGenerator = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error();
};

export default { errorGenerator };

// module.exports = (message, statusCode = 500) => {
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     throw error;
