'use strict'

require('dotenv').config()

const { start } = require('./src/server')
const { DB } = require('./src/auth/models/index')
const PORT = process.env.PORT;

DB.sync().then(() => {
    start(PORT);
}).catch(err => console.log(err))
