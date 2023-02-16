const express = require('express')
const router = express.Router()
const Art = require('../models/arts')
const seed = require('../models/seed')

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

// DROP DATA
//Art.collection.drop()

// INDEX ROUTE
router.get('/', (req,res) => {
    Art.find((err,arts) => {
        if(err) {
            console.log(err, ': ERROR IN INDEX ROUTE QUERY')
        } else {
            // res.send(arts)
            res.render('arts.ejs', {
                tabTitle: 'Collection',
                arts: arts
            })
        }
    })
})

// NEW ROUTE
router.get('/new', (req,res) => {
    res.render('new.ejs', {
        tabTitle: 'New'
    })
})

// SHOW ROUTE
router.get('/:id', (req,res) => {
    Art.findById(req.params.id, (err,foundArt) => {
        if (err) {
            console.log(err, ': ERROR AT SHOW ROUTE')
        } else {
            //res.send(foundArt)
            res.render('show.ejs', {
                tabTitle: foundArt.artist,
                art: foundArt
            })
        }
    })
})

// EDIT ROUTE
router.get('/:id/edit', (req,res) => {
    Art.findById(req.params.id, (err,foundArt) => {
        if (err) {
            console.log(err, ': ERROR AT EDIT GET ROUTE')
        } else {
            // res.send(foundArt)
            res.render('edit.ejs', {
                tabTitle: 'Edit',
                art: foundArt
            })
        }
    })
})

// UPDATE ROUTE
router.put('/:id', (req,res) => {
    Art.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,updatedArt) => {
        if(err){
            console.log(err, ': ERROR AT PUT ROUTE')
          } else {
            res.redirect(`/arts/${updatedArt._id}`)
          }
    })
})

// CREATE ROUTE
router.post('/', (req,res) => {
    Art.create(req.body, (err, createdArt) => {
        if(err){
            console.log(err, ': ERROR AT POSTT ROUTE')
        } else {
            res.redirect(`/arts`)
        }
    })
})

// DELETE ROUTE
router.delete('/:id', (req,res) => {
    Art.findByIdAndDelete(req.params.id, (err,deletedArt) => {
        if(err){
            console.log(err, ': ERROR AT DELETE ROUTE')
        } else {
            res.redirect('/arts')
        }
    })
})


module.exports = router
