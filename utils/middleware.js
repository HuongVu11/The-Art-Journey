// middleware always has req, res, next
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
    // redirect to login page 
      res.redirect('/sessions/new')
    }
  }

  // export to use somewhere else, then import it to where we use like fruits.js
  module.exports = isAuthenticated