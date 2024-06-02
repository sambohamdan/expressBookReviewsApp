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
    users.push({username, password, date: new Date})
    return res.status(200).json({message: "The user is successfully registerd, you can login"});
  } else {
    return res.status(300).json({message: "The username is already taken, please provide another one"});
  }
});

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    if (!isDBEmpty) {
        const asyncBooks = await getBooks();
        return res.status(200).json(asyncBooks);
    }
 
    return res.status(300).json({message: "No Books are registered yet!"});
});

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    await getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author.toLowerCase().includes(author.toLowerCase())))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    await getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase())))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
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
