const jwt = require('jsonwebtoken')

// Verify token middleware
module.exports = function (req, res, next) {
  const token = req.cookies.access_token
  if (!token) {
    res.sendStatus(401)
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    req.userId = data.id
    req.userRole = data.role
    return next()
  } catch {
    res.status(401).json({ msg: 'Invalid token' })
  }
}
