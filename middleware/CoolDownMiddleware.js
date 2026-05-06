const redisClient = require('../config/redis')

const SubmitCodeRareLimiter = async (req  ,res , next) => {
    const userId = req.result._id;

    const redisKey = `submit_cooldown:${userId}`;

    try {
        // check if user has a recent submission
        const exist = await redisClient.exists(redisKey);
        if(exist)
        {
            return res.status(429).json({succ:false , mess:"Please wait 10 sec. before submission again"})
        }
         
        // Set cool_down period
        await redisClient.set(redisKey , 'cooldown_active',{
            EX: 10, // Expire after 10 seconds
            NX: true // only set if not exists{auger vo exsist krta h to set krne ki jarurta nhi h}
        })

        next();
    } catch (error) {
        console.log("Rate limiter error: ",error);
        return res.status(500).json({succ:false , mess:error.message})
    }
}

module.exports = SubmitCodeRareLimiter;