const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const isDBEmpty = Object.entries(books).length <= 0;


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) return res.status(300).json({message: "Please provide username and password"});

  if (isValid(username)) {
    users.push({username, date: new Date})
    return res.status(200).json({message: "The user is successfully registerd, you can login"});
  } else {
    return res.status(300).json({message: "The username is already taken, please provide another one"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
if (!isDBEmpty) {
    return res.status(200).json(books);
}
  //Write your code here
  return res.status(300).json({message: "No Books are registered yet!"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

if (!isDBEmpty) {
    const foundBook = Object.keys(books).find((bookID) => bookID === isbn);
    if (foundBook)  return res.status(200).json(books[foundBook]);
    return res.status(404).json({message: "The book requisted is not found!"});
}
  return res.status(300).json({message: "No Books are registered yet!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();

    if (!isDBEmpty) {
        const foundBook = Object.values(books).find((book) => book.author.toLowerCase().includes(author));
        if (foundBook)  return res.status(200).json(foundBook);
        return res.status(404).json({message: "The book requisted is not found!"});
    }
    return res.status(300).json({message: "No Books are registered yet!"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();

    if (!isDBEmpty) {
        const foundBook = Object.values(books).find((book) => book.title.toLowerCase().includes(title));
        if (foundBook)  return res.status(200).json(foundBook);
        return res.status(404).json({message: "The book requisted is not found!"});
    }
    return res.status(300).json({message: "No Books are registered yet!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (!isDBEmpty) {
        const foundBookID = Object.keys(books).find((bookID) => bookID === isbn);
        const foundBookReviews = books[foundBookID].reviews;

        if (foundBookReviews) return res.status(200).json(foundBookReviews);
        return res.status(404).json({message: "The book requisted is not found!"});
    }
    return res.status(300).json({message: "No Books are registered yet!"});
});

module.exports.general = public_users;
