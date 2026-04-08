const mongoose = require('mongoose')
require('dotenv').config()

async function dbconnect() {
    await mongoose.connect(process.env.DB_CONNECT_STRING)

}

module.exports = dbconnect