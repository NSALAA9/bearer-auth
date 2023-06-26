'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Secret key for JWT
const secretKey = process.env.SECRET_KEY;

// Example user data (replace with your own user data and database connection)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Store the user in the database (if you have a database)
  // For this example, we'll just add the user to the users array
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  
  res.status(201).json({ user });
});

// Signin endpoint
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username (you can modify this based on your database implementation)
  const user = users.find(u => u.username === username);
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  // Check if the password is valid
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  res.json({ user, token });
});

// Protected route
app.get('/protected', (req, res) => {
  const { authorization } = req.headers;
  
  // Check if the authorization header is present
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Invalid authorization header' });
    return;
  }

  // Extract the token from the authorization header
  const token = authorization.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    
    // Get the user ID from the decoded token and find the corresponding user
    const userId = decoded.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      res.status(401).json({ message: 'Invalid user' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
