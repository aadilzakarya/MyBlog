// app.mjs
import './config.mjs';
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



app.set('view engine', 'hbs'); 
app.set('views', path.join(__dirname, 'views'));

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
  // res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
  //  and your session expires in ${req.session.cookie.maxAge} 
  //  milliseconds.<br><br>
  //  <a href="/logout">Log Out</a><br><br>
  //  <a href="/secret">Members Only</a>`);
   const articles = await Article.find().sort({ createdAt: 'desc' });
   const username = req.user.username;

   let readingTimes = articles.map(article => {
    const wordCount = article.content.split(' ').length;
    const readingTime = Math.ceil(wordCount / 50); // Assuming 50 words per minute (obviously wrong)
    console.log(readingTime);
    return `${readingTime} min read`;
    });





   
   res.render('blogs', {articles, username, readingTimes})
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
      else{
        UserData.register({ username: username, active: false }, password);
        console.log(UserData);
        res.render('login',);
      }

      
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
  // let currrentUser = req.user.username; 
	res.redirect('/dashboard');
});

app.get('/blogs', async (req, res) => {
  try {
    // Retrieve all articles from the database
    const articles = await Article.find().sort({ createdAt: 'desc' });
    console.log(articles);

    const transformedArticles = articles.map(article => ({
      ...article.toObject(),
      content: articleTransformationPipeline(article.content)
    }));





    res.render('home', { transformedArticles  });
  } catch (error) {
    console.error('Error handling articles:', error);
    res.status(500).send('Internal server error');
  }
});



app.get('/add-blog', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // Assuming the user object contains a username field
  const username = req.user.username; 
  res.render('blog-form', { username: username });
});


app.get('/contact-us', connectEnsureLogin.ensureLoggedIn(), (req, res) => {


  res.render('contact-us');
});


app.post('/contact-us', (req, res) => {
  // Extracting form data from the request body
  const { name, email, subject, message } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email is in the correct format
    if (!emailRegex.test(email)) {
        return res.send('Invalid email format.');
    }

  // Log the form data to the console (for demonstration purposes)
  console.log('Contact form submission:', name, email, subject, message);

  // Placeholder for processing the data
  // Example: Save the data to a database
  // Database.saveContactForm({ name, email, subject, message });

  // Example: Send an email
  // EmailService.sendEmail({ to: 'your@email.com', subject, text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` });

  // Send a response back to the client
  // You can render a success page, or redirect to a thank you page, etc.
  // For now, we will just send a simple text response.
  res.send('Thank you for your message! We will get back to you soon.');
});


app.post('/add-blog', async (req, res) => {
  try {
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
    res.redirect('/dashboard');

      // Rest of the form handling logic
  } catch (error) {
    console.error('Error adding a blog:', error);
    res.status(500).json({ error: 'Internal server error' });
      // Error handling
  }
});

app.get('/my-profile', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
      // Assuming 'author' field in 'Article' model is the username
      const articles = await Article.find({ author: req.user.username }).sort({ createdAt: -1 });
      res.render('my-profile', { articles: articles });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching articles');
  }
});



app.get('/dashboard/search', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const username = req.user.username;
  try {
      let articles = await Article.find(); // Fetch all articles
      if (searchTerm) {
          articles = articles.filter(article =>
              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.author.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }
      res.render('blogs', { searchResults: articles, username: username });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while searching');
  }
});





app.listen(process.env.PORT, () => {
  console.log('Server is running on port 8080');
});



export default app;





















































