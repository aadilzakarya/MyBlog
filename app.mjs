import './config.mjs';

import express from 'express';
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




app.listen(process.env.PORT || 3000);
