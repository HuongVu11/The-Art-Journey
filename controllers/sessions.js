const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
//const {User} = require('../models/users.js')
const User = require('../models/users.js')
// render a form for the user be able to log in
sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        tabTitle: 'Log in',
        currentUser: req.session.currentUser
    })
})

// post route to create a new session (log the user in)
sessions.post('/', (req, res) => {
    User.findOne({username: req.body.username }, (err, foundUser) => {
        if (err) {
            console.log(err)
            res.send('Sorry, please try again.')
        } else if(!foundUser) {
            res.send('Sorry, please try again.')
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser
                //res.redirect('/')
                const redirectLink = req.session.redirect
                if (typeof redirectLink === 'undefined') {
                    res.redirect('/')
                } else {
                    //delete req.session.redirect
                    res.redirect(redirectLink)
                }
            } else {
                res.send('Sorry, please try again.') 
            }
        }
    })
})

// destroy a session
sessions.delete('/', (req, res) => {
    req.session.destroy(() => { 
        res.redirect('/')
    })
})
  
module.exports = sessions