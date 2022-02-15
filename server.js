import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const port = process.env.PORT || 8080;

dotenv.config();

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    // app.listen(process.env.PORT, () =>
    //   console.log(`Server is running on ${process.env.PORT}`)
    // );
    app.listen(port, '0.0.0.0', () =>
      // console.log(`Server is running on ${process.env.PORT}`)
      console.log(`Server is running on ${port}`)
    );
  } catch (err) {
    console.log('Failed to connect MongoDB', err);
  }
};

connectDB();
