import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

require('dotenv').config();

app.listen(process.env.PORT, (err) => {
  if (!err) {
    console.log(`Server is running on ${process.enc.PORT}`);
  } else {
    console.log('Server error : ', err);
  }
});
