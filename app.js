// [LOAD PACKAGES]
import express from 'express';
import cors from 'cors';
import router from './src/routes';
import morgan from 'morgan';

const app = express();

// app.use(express.json()); //body-parser대신
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// var corsOptions = {
//   origin: `http://localhost:8080`,
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(router);
app.use(morgan('dev'));

app.all('*', (req, res, next) => {
  next(new Error('Page not found'));
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  const status = statusCode || 500;
  err.statusCode = statusCode || 500;
  console.log('app.js error handler\n', err);
  res.status(status).json({ status: 'fail', message });
});

export default app;
