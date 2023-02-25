const express = require('express')
const router = express.Router()
const Art = require('../models/arts')
const seed = require('../models/seed')
const User = require('../models/users.js')
const {isAuthenticated, checkUrl} = require('../utils/middleware')

// SEED DATA
router.get('/seed', (req,res) => {
    Art.create(seed, (err,data) => {
        if (err) {
            console.log(err, ': ERROR AT SEED ROUTE')
        } else {
            console.log('DATABASE SEEDED SUCCESSFULLY')
            res.redirect('/arts')
        }
    })
})

//// DROP DATA
// Art.collection.drop()
// User.collection.drop()

//// Add vote property to Art collection
// Art.updateMany({}, {$set: {votes:0}}, (err,updatedArts)=>{
//     if(err) {
//         console.log(err)
//     } else {
//         console.log(updatedArts)
//     }
// })

// INDEX ROUTE
router.get('/', checkUrl, (req,res) => {
    Art.find((err,arts) => {
        if(err) {
            console.log(err, ': ERROR IN INDEX ROUTE QUERY')
        } else {
            // res.send(arts)
            res.render('arts.ejs', {
                tabTitle: 'Collection',
                arts: arts,
                currentUser: req.session.currentUser
            })
        }
    })
})

// SHOW ROUTE
router.get('/:id', checkUrl, (req,res) => {
    Art.findById(req.params.id, (err,foundArt) => {
        if (err) {
            console.log(err, ': ERROR AT SHOW ROUTE')
        } else {
            //res.send(foundArt)
            res.render('show.ejs', {
                tabTitle: foundArt.artist,
                art: foundArt,
                currentUser: req.session.currentUser
            })
        }
    })
})

// // EDIT ROUTE
// router.get('/:id/edit', (req,res) => {
//     Art.findById(req.params.id, (err,foundArt) => {
//         if (err) {
//             console.log(err, ': ERROR AT EDIT GET ROUTE')
//         } else {
//             // res.send(foundArt)
//             res.render('edit.ejs', {
//                 tabTitle: 'Edit',
//                 art: foundArt,
//                 currentUser: req.session.currentUser
//             })
//         }
//     })
// })

// // UPDATE ROUTE
// router.put('/:id', (req,res) => {
//     Art.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,updatedArt) => {
//         if(err){
//             console.log(err, ': ERROR AT PUT ROUTE')
//           } else {
//             res.redirect(`/arts/${updatedArt._id}`)
//           }
//     })
// })

// // CREATE ROUTE
// router.post('/', (req,res) => {
//     Art.create(req.body, (err, createdArt) => {
//         if(err){
//             console.log(err, ': ERROR AT POST ROUTE')
//             //res.send(err._message)
//             res.render('new.ejs', {
//                 tabTitle: 'New',
//                 err: err._message,
//                 currentUser: req.session.currentUser
//             })
//         } else {
//             res.redirect(`/arts`)
//         }
//     })
// })

// POST ROUTE - SEARCH
router.post('/search', (req,res) => {
    const search = req.body.search
    Art.find({$or: [
        {title: {$regex: search, $options:'i'}},
        {artist: {$regex: search, $options:'i'}},
        {artistBio: {$regex: search, $options:'i'}},
        {dateCreated: {$regex: search, $options:'i'}},
        {description: {$regex: search, $options:'i'}},
        {category: {$regex: search, $options:'i'}},
        {museum: {$regex: search, $options:'i'}},
        {tags: {$regex: search, $options:'i'}}
    ]}, (err,foundArts) => {
        if(err) {
            console.log(err, ': ERROR IN SEARCH AT POST ROUTE QUERY')
        } else {
            //res.send(foundArts)
            res.render('search.ejs', {
                tabTitle: 'Collection',
                arts: foundArts,
                search: search,
                currentUser: req.session.currentUser
            })
        }
    })
})

// POST ROUTE - ADD TO USER
router.post('/:id/add', isAuthenticated, async (req,res) => {
    const foundArt = await Art.findById(req.params.id)
    User.findById(req.session.currentUser._id, (err,foundUser) =>{
        if(foundUser.arts.id(req.params.id)) {
            res.render('show.ejs', {
                message: 'The art is already included in your collection. Please add another art.',
                tabTitle: foundArt.artist,
                art: foundArt,
                currentUser: req.session.currentUser
            })
        } else {
            foundUser.arts.push(foundArt)
            foundUser.save()
            res.redirect('/users/arts')
        }
    })
})

// POST ROUTE - VOTE
router.post('/:id/vote', async (req,res) =>{
    Art.findByIdAndUpdate(req.params.id, {$inc: {votes: 1}}, {new:true}, (err,updatedArt) => {
        if(err){
            console.log(err, ': ERROR AT POST ROUTE - VOTE')
        } else {
            console.log(updatedArt)
            res.redirect(`/arts/${req.params.id}`)
        }
    })
})

// // DELETE ROUTE
// router.delete('/:id', (req,res) => {
//     Art.findByIdAndDelete(req.params.id, (err,deletedArt) => {
//         if(err){
//             console.log(err, ': ERROR AT DELETE ROUTE')
//         } else {
//             res.redirect('/arts')
//         }
//     })
// })

module.exports = router
