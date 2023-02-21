const mongoose = require('mongoose')
const artSchema = new mongoose.Schema({
    title: {type: String, required: true},
    img: String,
    artist: String,
    artistBio: String,
    dateCreated: String,
    description: String,
    category: String,
    museum: String,
    tags: [String]   
})
const Art = mongoose.model('Art', artSchema)
module.exports = Art
