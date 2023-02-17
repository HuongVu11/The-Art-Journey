const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')
const isAuthenticated= require('../utils/middleware')

// USER SIGNUP
users.get('/signup', (req, res) => {
  res.render('users/signup.ejs',{
    tabTitle: 'Sign up',
    currentUser: req.session.currentUser
  })
})

// INDEX ROUTE - USER'S COLLECTIONS
users.get('/arts', (req,res) => {
  User.findById(req.session.currentUser, (err, user) => {
    if(err) {
      console.log(err, ': ERROR IN INDEX ROUTE QUERY')
    } else {
      //res.send(user)
      res.render('users/arts.ejs', {
        tabTitle: user.name + 'collection',
        arts: user.arts,
        currentUser: req.session.currentUser
      })
    }
  })
})

// NEW ROUTE -ADD NEW ART
users.get('/new', isAuthenticated, (req,res) => {
  res.render('users/new-art.ejs', {
    tabTitle: 'New Art',
    currentUser: req.session.currentUser
  })
})


// POST ROUTE - CREATE A NEW ART
users.post('/arts', (req,res) => {
  User.findByIdAndUpdate(req.session.currentUser._id, {$push: {arts: req.body}}, (err, createdArt) => {
    if(err){
      console.log(err, ': ERROR AT POST ROUTE')
      //res.send(err._message)
      res.render('new-art.ejs', {
        tabTitle: 'New',
        err: err._message,
        currentUser: req.session.currentUser
      })
    } else {
      res.redirect(`/users/arts`)
    }
  })
})

users.post('/', (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log('user is created', createdUser)
      res.redirect('/sessions/new')
    }
  })
})

module.exports = users
