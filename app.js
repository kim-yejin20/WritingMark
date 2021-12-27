// [LOAD PACKAGES]
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();

// [CONFIGURE APP TO USE bodyParser]
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var corsOptions = {
  origin: `http://localhost:8080`,
  credentials: true,
};

app.use(cors(corsOptions));
//app.use(cors());
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
