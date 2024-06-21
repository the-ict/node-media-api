const express = require('express')
const dotenv = require('dotenv')
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")


// import routes
const authRoute = require("./router/auth")
const userRoute = require("./router/user")
const postRoute = require('./router/post')

// configurations
dotenv.config()
const app = express()

// middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// routers
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)


// connect to mongodb
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connect to mongodb"))
    .catch(err => console.log(err))

// start express application
app.listen(process.env.PORT || 3000, () => console.log("Backend is running!"))