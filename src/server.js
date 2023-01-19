const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const bcrypt = require('bcrypt');


const port = process.env.PORT || 3000;
const router = express.Router();


app.use(cors());
app.use(express.json());

//get
router.get('/signup', (req, res) => {
    res.render('signup');
});
app.use('/', router);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

//post 

router.post('/signup', (req, res) => {
  // Get the email and password from the request body
  const { email, password } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          return res.status(500).json({ error: 'Error while hashing the password' });
      }

      // Store the email and hashed password
      const user = new User({ email, password: hashedPassword });
      user.save((error) => {
          if (error) {
              return res.status(500).json({ error });
          }
          return res.status(200).json({ message: 'User created successfully' });
      });
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate the email and password
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the user exist in the database
  User.findOne({ email }, (err, user) => {
      if (err || !user) {
          return res.status(401).json({ error: 'User not found' });
      }
      // Compare password with the hashed password in the database
      bcrypt.compare(password, user.password, (error, result) => {
          if (error || !result) {
              return res.status(401).json({ error: 'Invalid email or password' });
          }
          // Generate JSON web token and return
          const token = jwt.sign({ email }, process.env.JWT_SECRET);
          
          //store token in localStorage
          localStorage.setItem('token', token);
          // redirect to dashboad
          res.redirect('/dashboard');
      });
  });
});



app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});