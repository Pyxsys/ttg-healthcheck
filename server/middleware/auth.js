const jwt = require('jsonwebtoken')

// Verify token middleware
module.exports = function (req, res, next) {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json({ message: 'No token' })
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    req.userId = data.id
    return next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
