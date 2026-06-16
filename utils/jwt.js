require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

const generateRefreshToken = (payload) =>{
    return jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn:process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    })
}

module.exports ={
    generateAccessToken,
    generateRefreshToken
}