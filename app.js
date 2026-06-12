const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const testroutes = require('./routes/test')

app.use('/api/v1', testroutes)

module.exports = app