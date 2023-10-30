// db.mjs
import mongoose from 'mongoose';

// Ensure that you have previously completed the configuration steps
// (i.e., you have a .env file, config.mjs, and the appropriate import statements).

// Uncomment the following line to debug the value of the database connection string.
// console.log(process.env.DSN);

// Define any Mongoose connection options here.
const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the MongoDB database using the DSN from your .env file.
mongoose.connect(process.env.DSN, mongooseOpts, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Export the Mongoose instance for use in other parts of your application.
export default mongoose;
