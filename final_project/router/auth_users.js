const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      return userswithsamename.length <= 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let user = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });

      return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) return res.status(404).json({message: "Please provide username and password"});

  
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const currentSessionUser = req.session.authorization.username;

  if (currentSessionUser) {
    const isEmptyReviews = Object.values(books[isbn]?.reviews).length <= 0;

    if (isEmptyReviews) {
        return res.status(500).json("No Reviews were added yet to the book");
    } else {
        delete books[isbn].reviews[currentSessionUser];
        return res.status(200).json("Review is deleted!");
    }
  } else {
    return res.status(300).json("User session is finished");
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const userReview = req.body.review;
    const currentSessionUser = req.session.authorization.username;
  
    if (currentSessionUser) {
      const isEmptyReviews = Object.values(books[isbn]?.reviews).length <= 0;
  
      if (isEmptyReviews) {
          Object.assign(books[isbn].reviews, {[currentSessionUser]: {review: userReview}})
      } else {
          books[isbn].reviews[currentSessionUser].review = userReview
      }
  
      return res.status(200).json("User Review added / updated");
    } else {
      return res.status(300).json("User session is finished");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
