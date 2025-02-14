const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find(user => user.username === username);
  return !user; // Return true if the username is not found (valid), false otherwise
};

const authenticatedUser = (username, password) => {
  // Find the user in the records
  const user = users.find(user => user.username === username && user.password === password);
  
  // Return true if the user exists, false otherwise
  return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists in records (you can replace this logic with your user database)
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  // Generate JWT access token
  const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });

  // Store the token in session
  req.session.authorization = { accessToken };

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from the request parameters
  const review = req.body.review; // Get the review from the request body
  const username = session.username; // Get the username from the session

  // Check if the ISBN exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Add or update the review for the user
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});



regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;           // Get the ISBN from the request parameters
  const username = req.headers.username;  // Get the username from the session

  // Check if the user is logged in
  if (!username) {
      return res.status(401).json({ message: "Please log in first." });
  }

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
  }

  // Check if the review exists for the logged-in user
  if (books[isbn].reviews && books[isbn].reviews[username]) {
      // Delete the review for the logged-in user
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
  } else {
      return res.status(404).json({ message: "Review not found for this user." });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
