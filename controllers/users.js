const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
//const User = require('../models/users.js')
const {User, UserArt} = require('../models/users.js')

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
      console.log(err)
    } else {
      console.log('user is created', createdUser)
      res.redirect('/sessions/new')
    }
  })
})

// INDEX ROUTE - USER'S COLLECTIONS
// users.get('/arts', (req,res) => {
//   const user = req.session.currentUser
//   //res.send(user)
//   res.render('users/arts.ejs', {
//     tabTitle: 'Collection',
//     arts: user.arts,
//     currentUser: req.session.currentUser
//   })
// })
users.get('/arts', (req,res) => {
const user = req.session.currentUser
User.findById(user._id, (err,user) => {
  if(err) {
      console.log(err, ': ERROR IN INDEX ROUTE QUERY')
  } else {
      //res.send(user.arts)
      res.render('arts.ejs', {
          tabTitle: 'Collection',
          arts: user.arts,
          currentUser: req.session.currentUser
      })
  }
})
})


// SHOW ROUTE
// users.get('/arts/:id', (req,res) => {
//   const user = req.session.currentUser
//   res.render('users/show.ejs', {
//     tabTitle: user.username +'collection',
//     id:req.params.id,
//     art: user.arts[req.params.id],
//     currentUser: req.session.currentUser
//   })
// })
users.get('/arts/:id', (req,res) => {
  const user = req.session.currentUser
  User.findById(user._id, (err,user) => {
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
// users.get('/arts/:id/edit', (req,res) => {
//   const user = req.session.currentUser
//     res.render('users/edit.ejs', {
//       tabTitle: 'Edit',
//       id: req.params.id,
//       art: user.arts[req.params.id],
//       currentUser: req.session.currentUser
//     })
//   }
// )
users.get('/arts/:id/edit', (req,res) => {
  const user = req.session.currentUser
  User.findById(user._id, (err,user) => {
    if (err) {
        console.log(err, ': ERROR AT SHOW ROUTE')
    } else {
      const foundArt = user.arts.id(req.params.id)
      // res.send(foundArt)
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
users.post('/arts', (req,res) => {
  const user = req.session.currentUser
  user.arts.push(req.body)
  User.findByIdAndUpdate(user._id, user, (err, createdArt) => {
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

// UPDATE ROUTE
// users.put('/arts/:id', (req,res) => {
//   const user = req.session.currentUser
//   user.arts[req.params.id] = req.body
//   User.findByIdAndUpdate(user._id, user, {new:true}, (err,user) =>{
//     if(err) {
//       console.log(err, ': ERROR AT UPDATE ROUTE')
//     } else{
//       res.redirect('/users/arts')
//     }
//   })
// })

users.put('/arts/:id', async (req,res) => {
  const user = req.session.currentUser
  User.findById(user._id, (err,user) => {
      if(err){
          console.log(err, ': ERROR AT PUT ROUTE')
      } else {
        const art = user.arts.id(req.params.id)
        art.set(req.body)
        user.save((err) => {
          if(err) {
            console.log(err)
          }
        })
        res.redirect('/users/arts')
      }
  })
})

// DELETE ROUTE
// users.delete('/arts/:id', (req,res) => {
//   const user = req.session.currentUser
//   user.arts.id(req.params.id).remove()
//   User.findByIdAndUpdate(user._id, user, {new:true}, (err,user) =>{
//     if(err) {
//       console.log(err, ': ERROR AT DELETE ROUTE')
//     } else{
//       res.redirect('/users/arts')
//     }
//   })
// })

users.delete('/arts/:id', (req,res) => {
const user = req.session.currentUser
User.findById(user._id, (err,user) => {
    if(err){
        console.log(err, ': ERROR AT PUT ROUTE')
    } else {
      user.arts.id(req.params.id).remove()
      user.save((err) => {
        if(err) {
          console.log(err)
        }
      })
      res.redirect('/users/arts')
    }
})
})

module.exports = users
