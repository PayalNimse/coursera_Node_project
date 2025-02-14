const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is valid (not already taken)
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the records
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Look up the book in the books database
  
  if (book) {
    res.send(JSON.stringify(book, null, 4)); // Send the book details as a formatted JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Respond with an error if the book isn't found
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve the author name from request parameters
  const bookList = Object.values(books); // Convert the books object into an array of book details
  
  // Filter books by the provided author
  const booksByAuthor = bookList.filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4)); // Send matching books as a formatted JSON response
  } else {
    res.status(404).json({ message: "No books found by this author" }); // Respond with an error if no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 
  const title = req.params.title; // Retrieve the title from the request parameters
  const bookList = Object.values(books); // Convert the books object into an array of book

  const booksByTitle = bookList.filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4)); // Send matching books as a formatted JSON response
  } else {
    res.status(404).json({ message: "No books found with this title" }); // Respond with an error if no books are found
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    const reviews = books[isbn].reviews; // Get the reviews for the specified book
    res.send(JSON.stringify(reviews, null, 4)); // Send the reviews as a formatted JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Respond with an error if the book is not found
  }
});



async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/'); // Replace with your actual API URL
    return response.data.books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error; // Propagate error for handling in route
  }
}


function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/books/${isbn}`)
    .then(response => response.data) // Return book details if successful
    .catch(error => {
      console.error("Error fetching book by ISBN:", error);
      throw error;
    });
}





function getBooksByAuthor(author) {
  return axios.get(`http://localhost:5000/books?author=${author}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching books by author:", error);
      throw error;
    });
}


function getBookByTitle(title) {
  return axios.get(`http://localhost:5000/books?title=${title}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching books by title:", error);
      throw error;
    });
}



console.log("Getting All books");
getBooks();
console.log("Getting books by ISBN");
getBookByISBN('3');  
console.log("Getting books by Title");
getBookByTitle('One Thousand and One Nights'); 
console.log("Getting books by Author");
getBooksByAuthor('amuel Beckett');
















module.exports.general = public_users;
