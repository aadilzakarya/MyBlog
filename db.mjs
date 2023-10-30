// db.mjs
import mongoose from 'mongoose';
import {config} from 'dotenv';

// Uncomment the following line to debug the value of the database connection string.

config();

console.log(process.env.DSN);

// Define your Mongoose schema for the reviews
const reviewSchema = new mongoose.Schema({
  courseNumber: { type: String, required: true },
  courseName: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  professor: { type: String, required: true },
  review: { type: String, required: true },
});

// Create a Mongoose model using the schema
const Review = mongoose.model('Review', reviewSchema);

// Define any Mongoose connection options here.
const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// // Connect to the MongoDB database using the DSN from your .env file.
mongoose
  .connect(process.env.DSN, mongooseOpts)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

// Export the Mongoose instance and the Review model for use in other parts of your application.
export { mongoose, Review };
