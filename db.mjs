// db.mjs
import mongoose from 'mongoose';
import { config } from 'dotenv';
import passportLocalMongoose from 'passport-local-mongoose';
config();

console.log(process.env.DSN);

mongoose.connect(process.env.DSN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema } = mongoose;

// Define the Article schema
const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});



const User = new Schema({
  username: String,
  password: String
});


User.plugin(passportLocalMongoose);

const UserData = mongoose.model('userData', User, 'userData');

const Article = mongoose.model('Article', articleSchema);

export { Article, UserData };
