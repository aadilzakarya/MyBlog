// app.mjs
import express from 'express';

import bodyParser from 'body-parser'; // parser middleware
import session from 'express-session'; // session middleware
import passport from 'passport'; // authentication
import LocalStrategy from 'passport-local';

import connectEnsureLogin from 'connect-ensure-login'; // authorization


import { Article, UserData } from './db.mjs';


const app = express();

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(UserData.createStrategy());

// To use with sessions
passport.serializeUser(UserData.serializeUser());
passport.deserializeUser(UserData.deserializeUser());


import url from 'url';
import path from 'path';
app.use(express.urlencoded({ extended: false }));



const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse form data



app.set('view engine', 'hbs'); // You can use any template engine you prefer
app.set('views', path.join(__dirname, 'views'));

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
  // res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
  //  and your session expires in ${req.session.cookie.maxAge} 
  //  milliseconds.<br><br>
  //  <a href="/logout">Log Out</a><br><br>
  //  <a href="/secret">Members Only</a>`);
   const articles = await Article.find().sort({ createdAt: 'desc' });

   res.render('blogs', {articles})
});

app.get('/logout', function(req, res) {
  req.logout(function(err) {
      if (err) {
          // handle error
          console.log(err);
          res.redirect('/some-error-page'); // Redirect to an error handling page or route
      }
      res.redirect('/login'); // Redirect to login or another page on successful logout
  });
});


app.get('/register', function(req,res){
  res.render('register',);
})

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if the passwords match
  if (password !== confirmPassword) {
      res.render('register', { errorMessage: 'Passwords do not match.' });
      return;
  }

  try {
      // Check if the user already exists
      const existingUser = await UserData.findOne({ username });
      if (existingUser) {
          res.render('register', { errorMessage: 'Username already exists.' });
          return;
      }

      UserData.register({ username: username, active: false }, password);
      console.log(UserData);

      // If user doesn't exist, create a new user
      // const newUser = new UserData({ username, password });
      // await newUser.save(); // Make sure to hash the password if you're not doing it in your user model
      // console.log(newUser.username);
      // Redirect to login or another page upon successful registration
      res.redirect('/login');
  } catch (error) {
      console.error('Registration error:', error);
      res.render('register', { errorMessage: 'Error during registration.' });
  }
});




app.get('/login', function(req, res) {
  res.render('login', ); 
});


app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),  function(req, res) {
	console.log(req.user)
	res.redirect('/dashboard');
});

app.get('/blogs', async (req, res) => {
  try {
    // Retrieve all articles from the database
    const articles = await Article.find().sort({ createdAt: 'desc' });
    console.log(articles);
    res.render('home', { articles });
  } catch (error) {
    console.error('Error handling articles:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/add-blog', (req, res) => {
  res.render('blog-form'); // Assuming you have a view named 'blog-form'
});

// POST route to handle form submission
app.post('/add-blog', async (req, res) => {
  try {
    console.log("TRIAL HERE: ", req.body);
    // Extract data from the form submission
    const { title, content, author } = req.body || {};
    const createdAt = new Date();

    // Create a new Article instance with the form data
    const newArticle = new Article({
      title,
      content,
      author,
      createdAt,
    });

    // Save the new article to the database
    await newArticle.save();

    // Redirect to the home page or wherever you want to go after submission
    res.redirect('/');
  } catch (error) {
    console.error('Error adding a blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen( 8080, () => {
  console.log('Server is running on port 8080');
});
























































// import './config.mjs';

// import express from 'express';
// import session from 'express-session';
// const app = express();

// import './db.mjs';

// import mongoose from 'mongoose';
// const Review = mongoose.model('Review');

// // set up express static

// import url from 'url';
// import path from 'path';
// const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// app.use(express.static(path.join(__dirname, 'public')));

// // configure templating to hbs
// app.set('view engine', 'hbs');

// // body parser (req.body)
// app.use(express.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: 'your-secret-key', // Change this to a  random secret
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Middleware to track page visits
// app.use((req, res, next) => {
//   req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
//   res.locals.visitCount = req.session.visitCount;
//   console.log("COUNT: ", res.locals.visitCount);
//   app.locals.count = res.locals.visitCount; 
//   next();
// });


// app.use((req, res, next) => {
  
//   if(!req.session.userReview){
//     req.session.userReview = [];
//   }
//   res.locals.userReview = req.session.userReview;
//   next();
// });




// app.get('/', async (req, res) => {
//   try {
//     // Get filtering criteria from query string
//     const { author, title, content  } = req.query;

//     // Build a query object based on form input
//     const query = {};

//     if (semester) {
//       query.author = author;
//     }
//     if (year) {
//       query.title = title;
//     }
//     if (professor) {
//       query.content = content;
//     }

//     // Use Review.find() with the query object to filter reviews or retrieve all reviews
//     const reviews = await Blog.find(query);

//     // Render the reviews in the template
//     res.render('reviews', { reviews });
//   } catch (error) {
//     console.error('Error handling reviews:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // // GET handler for showing the form
// // app.get('/reviews/add', (req, res) => {
// //   res.render('add-review'); // Render the form template
// // });

// // // POST handler for processing form submissions
// // app.post('/reviews/add', async (req, res) => {
// //   try {
// //     // Extract review data from req.body
// //     const { courseNumber, courseName, semester, year, professor, review } = req.body;

// //     // Create a new review document based on the data
// //     const newReview = new Review({
// //       courseNumber,
// //       courseName,
// //       semester,
// //       year,
// //       professor,
// //       review,
// //     });

// //     // Save the new review to the database
// //     await newReview.save();
// //     const userReviews = req.session.userReviews || [];

// //   // Add the new review to the user's reviews
// //   userReviews.push(newReview);

// //   // Update the user's reviews in the session
// //   req.session.userReviews = userReviews;

// //     // Redirect back to the page that displays all reviews
// //     // need to add the review to the list 
// //     res.redirect('/');
// //   } catch (error) {
// //     console.error('Error adding a review:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });


// // app.get('/reviews/mine', (req, res) => {
// //   // Retrieve reviews added by the user during their session
// //   const userReviews = req.session.userReviews || [];
// //   console.log(req.session.userReviews);
// //   //console.log("MEOW: ", userReviews);
  
// //   // Render the reviews added by the user in the template
// //   res.render('my-reviews', { userReviews });
// // });




// app.listen(process.env.PORT || 3000);
