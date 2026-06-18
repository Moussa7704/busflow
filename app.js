const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const authRoutes = require("./routes/auth")
const compagnyRoutes = require("./routes/compagny")

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/compagnies', compagnyRoutes)

module.exports = app