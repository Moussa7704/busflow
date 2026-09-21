const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger')

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
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
const busRoutes = require("./routes/bus")
const tripRoutes = require("./routes/trip")
const tripRouteRoutes = require("./routes/tripRoute")
const bookingRoutes = require("./routes/booking")
const passengerRoutes = require("./routes/passenger")
const ticketRoutes = require("./routes/tickets")
const courrierRoutes = require("./routes/courrier")
const dashboardRoutes = require("./routes/dashboard")


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/compagnies', compagnyRoutes)
app.use('/api/v1/roles', roleRoutes)
app.use('/api/v1/agences', agencyRoutes)
app.use('/api/v1/buses', busRoutes)
app.use('/api/v1/trips', tripRoutes)
app.use('/api/v1/trip-routes', tripRouteRoutes)
app.use('/api/v1/bookings', bookingRoutes)
app.use('/api/v1/passengers', passengerRoutes)
app.use('/api/v1/tickets', ticketRoutes)
app.use('/api/v1/courriers', courrierRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)



module.exports = app