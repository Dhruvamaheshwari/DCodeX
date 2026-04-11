
const User = require('../model/user.model')
const validate = require('../utils/validate')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// register
const register = async(req , res) => {
    try {
        
        // check all data is correct or not using the zod validator
        validate(req.body);

        const {firstName , lastName , emailId , password } = req.body;

        // first checkt that all field are filled or not
        if(!firstName || !lastName || !emailId || !password)
        {
            return res.status(401).json({succ:false , mess:"all Field are required"})
        }

        // check ki this email id is not exist in my Database
        const isEmailPrest = await User.findOne({emailId})
        // OR  // const isEmailPresnt = await User.exists({emailId})
        if(isEmailPrest)
        {
            return res.status(402).json({succ:false , mess:"this email allready exiest"})
        }

        // hash password
        const hashPassword = await bcrypt.hash(password , 10);

        // user create
        const user =  await User.create({firstName , lastName , emailId , password:hashPassword})


        // create the token
        const token = jwt.sign({emailId:emailId , _id:user._id} ,process.env.JWT_KEY, {expiresIn:60*60})

        // iss token ko cookies me set krlo
        res.cookie('token' , token , {maxAge: 60*60*1000});

        return res.status(200).json({succ:true , mess:"user created successfully"})

    } catch (error) { 
        return res.status(400).json({succ:false , mess:error.message})
    }
}

// login 
const login = async(req ,res) => {
    try {
        
        // login via a email and pass
        const {emailId , password} = req.body

        // check all field are valid or not
        if(!emailId || !password)
        {
            return res.status(401).json({succ:true , mess:"Invalid Credentials"})
        }

        // to check that email and password are present in the database or not
        const userPresent = await User.findOne({emailId});
        
        if(!userPresent)
        {
            return res.status(401).json({succ:false , mess:"Please login first"})
        }

        // check password correct or not 
        const passwordIsMatch = bcrypt.compare(password , userPresent.password)

        if(!passwordIsMatch)
        {
            return res.status(401).json({succ:false , mess:"Invalid Credentials"})
        }

        // jwt token ko create kr ke return krva sakte h

        // create the token
        const token = jwt.sign({emailId:emailId , _id:userPresent._id} ,process.env.JWT_KEY, {expiresIn:60*60})
        
        // iss token ko cookies me set krlo
        res.cookie('token' , token , {maxAge: 60*60*1000});

        return res.status(200).json({succ:true , mess:'logged In Successfullu'})

    } catch (error) {
        return res.status(401).json({succ:false , mess:error.message})
    }
}

// logout

const logout = async(req ,res) => {
    try {
        
    } catch (error) {
        
    }
}

// getprofile
