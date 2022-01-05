const errorGenerator = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

export default errorGenerator;

// module.exports = (message, statusCode = 500) => {
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     throw error;
