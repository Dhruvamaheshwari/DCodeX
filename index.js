const express = require('express')
const app = express();
require('dotenv').config()
Port = process.env.PORT || 4000;
const route = require('./Routes/userAuth.route')

// import the cooki
const cookieParser = require('cookie-parser')

// middleware
app.use(express.json());
app.use(cookieParser());

app.use( '/user', route);

const dbconnect = require('./config/db.connect')
const redisClient = require('./config/redis')

const InitializeConnection = async() => {
    try {
        await Promise.all([dbconnect() , redisClient.connect()])
        console.log('DB Connected')

          app.listen(Port  , () => console.log(`server is started at port ${Port}`));
    } catch (error) {
        console.log(error)
    }
}

InitializeConnection()

// dbconnect()
// .then(async () => {
//     app.listen(Port  , () => console.log(`server is started at port ${Port}`));
// })
// .catch(err => console.log(err.message));

