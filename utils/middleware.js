// middleware always has req, res, next
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
    // redirect to login page 
      res.redirect('/sessions/new')
    }
  }

const checkUrl = (req,res,next) =>{
  if (req.session.currentUser) {
    return next()
  } else {
    req.session.redirect = req.originalUrl
    next()
  }
}

  // export to use somewhere else, then import it to where we use
//module.exports = isAuthenticated

module.exports = {
  isAuthenticated,
  checkUrl
}