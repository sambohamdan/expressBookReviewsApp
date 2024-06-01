const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user = users.find(user => user.username);
    return !user ? true : false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(currentUser => currentUser.userName === username && currentUser.password === password);
    return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) return res.status(300).json({message: "Please provide username and password"});

  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
