const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true },
//   password: String,
//   arts: [{
//     title: {type: String, required: true},
//     img: String,
//     artist: String,
//     artistBio: String,
//     dateCreated: String,
//     description: String,
//     category: String,
//     museum: String,
//     tags: [String]    
//   }]
// })

// const User = mongoose.model('User', userSchema)

// module.exports = User

const userArtSchema = new mongoose.Schema({
  title: {type: String, required: true},
  img: {type: String, default: 'https://icon-library.com/icon/no-picture-available-icon-1.html.html'},
  artist: {type: String, default: 'N/A'},
  artistBio: {type: String, default: 'N/A'},
  dateCreated: {type: String, default: 'N/A'},
  description: {type: String, default: 'N/A'},
  category: {type: String, default: 'N/A'},
  museum: {type: String, default: 'N/A'},
  tags: [String]
})

const Schema = mongoose.Schema
const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  arts:[userArtSchema]
},{ timestamps: true })

const User = mongoose.model('User', userSchema)
const UserArt = mongoose.model('UserArt', userArtSchema)

module.exports = {User, UserArt}