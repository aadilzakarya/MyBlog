import './config.mjs';

import express from 'express';
import session from 'express-session';
const app = express();

import './db.mjs';

import mongoose from 'mongoose';
const Review = mongoose.model('Review')

// set up express static

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'your-secret-key', // Change this to a  random secret
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to track page visits
app.use((req, res, next) => {
  req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
  res.locals.visitCount = req.session.visitCount;
  console.log("COUNT: ", res.locals.visitCount)
  app.locals.count = res.locals.visitCount; 

  next();
});





app.get('/', async (req, res) => {
  try {
    // Get filtering criteria from query string
    const { semester, year, professor } = req.query;

    // Build a query object based on form input
    const query = {};

    if (semester) {
      query.semester = semester;
    }
    if (year) {
      query.year = parseInt(year);
    }
    if (professor) {
      query.professor = professor;
    }

    // Use Review.find() with the query object to filter reviews or retrieve all reviews
    const reviews = await Review.find(query);

    // Render the reviews in the template
    res.render('reviews', { reviews });
  } catch (error) {
    console.error('Error handling reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET handler for showing the form
app.get('/reviews/add', (req, res) => {
  res.render('add-review'); // Render the form template
});

// POST handler for processing form submissions
app.post('/reviews/add', async (req, res) => {
  try {
    // Extract review data from req.body
    const { courseNumber, courseName, semester, year, professor, review } = req.body;

    // Create a new review document based on the data
    const newReview = new Review({
      courseNumber,
      courseName,
      semester,
      year,
      professor,
      review,
    });

    // Save the new review to the database
    await newReview.save();

    // Redirect back to the page that displays all reviews
    res.redirect('/');
  } catch (error) {
    console.error('Error adding a review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.listen(process.env.PORT || 3000);
