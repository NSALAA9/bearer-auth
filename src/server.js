'use strict'

// require('dotenv').config()

const express = require('express');
const cors = require('cors');
// const PORT = process.env.PORT
const app = express();
app.use(cors());
app.use(express.json())


const PageNotFound = require('./middleware/404')
const serverError = require('./middleware/500')
const userRouter = require('./auth/router')



app.get('/', (req, res) => {
    res.status(200).json({
        code: 200,
        message: 'WELCOME!!!!'
    })
})

app.use(userRouter)


app.use(serverError)
app.use('*', PageNotFound)



function start(port) {
    app.listen(port, () => console.log(`Up & running on port: ${port}`))
}


module.exports = {
    start,
    app
}