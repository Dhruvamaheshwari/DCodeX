
const {createClient} = require('redis')
require('dotenv').config()

const redisClient = createClient({
    username: 'default',
    password: process.env.Redis_Password,
    socket: {
        host: 'redis-19625.c283.us-east-1-4.ec2.cloud.redislabs.com',
        port: 19625
    }
});

module.exports = redisClient

