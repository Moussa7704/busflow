require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    })
}

const generateResetToken = (payload) => {
  return jwt.sign(payload, process.env.RESET_SECRET, {
    expiresIn: process.env.JWT_RESET_EXPIRES_IN || '1h',
  });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_SECRET)
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_SECRET)
}
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateResetToken
}