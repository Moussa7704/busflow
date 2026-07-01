const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,
    {
        customSiteTitle: `Gestion Bus`,
        customCss: `
        .swagger-ui .topbar {
            display: none;
        }
    `
    }
));

const authRoutes = require("./routes/auth")
const compagnyRoutes = require("./routes/compagny")
const agencyRoutes = require("./routes/agency")
const userRoutes = require("./routes/user")
const roleRoutes = require("./routes/roles")


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/compagnies', compagnyRoutes)
app.use('/api/v1/roles', roleRoutes)
app.use('/api/v1/agences', agencyRoutes)


module.exports = app