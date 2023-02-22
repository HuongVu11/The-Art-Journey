const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer');

// USER SIGNUP
users.get('/signup', (req, res) => {
  res.render('users/signup.ejs',{
    tabTitle: 'Sign up',
    currentUser: req.session.currentUser
  })
})

users.post('/', (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err, 'error at post route- create new user')
    } else {
      console.log('user is created', createdUser)
      res.redirect('/sessions/new')
    }
  })
})

// INDEX ROUTE - USER'S COLLECTIONS
users.get('/arts', (req,res) => {
  User.findById(req.session.currentUser._id, (err,user) => {
    if(err) {
      console.log(err, ': ERROR IN INDEX ROUTE QUERY')
    } else {
      //res.send(user.arts)
      console.log(user.arts)
      res.render('users/arts.ejs', {
          tabTitle: 'Collection',
          arts: user.arts,
          currentUser: req.session.currentUser
      })
    }
  })
})

// SHOW ROUTE
users.get('/arts/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (err,user) => {
    if (err) {
      console.log(err, ': ERROR AT SHOW ROUTE')
    } else {
      const foundArt = user.arts.id(req.params.id)
      //res.send(foundArt)
      res.render('users/show.ejs', {
        tabTitle: 'Collection',
        art: foundArt,
        currentUser: req.session.currentUser
      })
    }
  })
})

// EDIT ROUTE
users.get('/arts/:id/edit', (req,res) => {
  User.findById(req.session.currentUser._id, (err,user) => {
    if (err) {
        console.log(err, ': ERROR AT SHOW ROUTE')
    } else {
      const foundArt = user.arts.id(req.params.id)
      //res.send(foundArt)
      res.render('users/edit.ejs', {
        tabTitle: 'Edit',
        art: foundArt,
        currentUser: req.session.currentUser
      })
    }
  })
})

// NEW ROUTE -ADD NEW ART
users.get('/new', (req,res) => {
  res.render('users/new-art.ejs', {
    tabTitle: 'New Art',
    currentUser: req.session.currentUser
  })
})

// POST ROUTE - CREATE A NEW ART
users.post('/arts', upload.single('img'), async (req,res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {public_id:"art_journey"})
    req.body.img = result.secure_url
    const user = await User.findById(req.session.currentUser._id)
    user.arts.push(req.body)
    await user.save()
    res.redirect(`/users/arts`)
  } catch(err) {
    console.log(err, ': ERROR AT POST ROUTE - CREATE NEW ART')
  }
})


// UPDATE ROUTE
users.put('/arts/:id', upload.single('img'), async (req,res) => {
  try {
    const user = await User.findById(req.session.currentUser._id)
    const art = user.arts.id(req.params.id)
    // check if there is an uploaded file
    if(typeof req.file === 'undefined') {
      req.body.img = art.img
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {public_id:"art_journey"})
      req.body.img = result.secure_url
    }
    art.set(req.body)
    await user.save()
    res.redirect(`/users/arts`)
  } catch(err) {
      console.log(err, ': ERROR AT POST ROUTE - UPDATED ART')
  }
})

// DELETE ROUTE
users.delete('/arts/:id', async (req,res) => {
  try {
    const user = await User.findById(req.session.currentUser._id)
    user.arts.id(req.params.id).remove()
    await user.save()
    res.redirect('/users/arts')
  } catch (err) {
    console.log(err, ': ERROR AT DELETE ROUTE')
  }
})

module.exports = users
