import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on ${process.env.PORT}`)
    );
  } catch (err) {
    console.log('Failed to connect MongoDB', err);
  }
};

connectDB();
