// [LOAD PACKAGES]
import express from 'express';
import cors from 'cors';
import router from './src/routes';

const app = express();

app.use(express.json());

// var corsOptions = {
//   origin: `http://localhost:8080`,
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(router);

app.all('*', (req, res, next) => {
  next(new Error('Page not found'));
});

app.use((err, req, res, next) => {
  console.log('app.js error handler\n', err);
  const { status, message } = err;
  res.status(status || 500).json(message);
});

export default app;
