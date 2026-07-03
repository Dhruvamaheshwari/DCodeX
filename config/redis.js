
const {createClient} = require('redis')
require('dotenv').config()

const redisClient = createClient({
    username: 'default',
    password: process.env.Redis_Password,
    socket: {
        host: 'redis-19684.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 19684
    }
});

module.exports = redisClient

