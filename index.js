const express = require('express');
const cors = require('cors')

const app = express();

const userRouter = require('./route/user');
const dbConnect = require('./config/dbConnection');
const dotenv = require("dotenv").config();

dbConnect();

app.use(express.json());
app.use(cors({
    Credential: true,
    origin: process.env.CLIENT_URL
}))
app.use('/auth', userRouter.router)

app.listen(5000, () => {
    console.log('Listening to port 5000')
})