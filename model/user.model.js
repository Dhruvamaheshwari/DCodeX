const {Schema , model} = require('mongoose')

// create the Schema 

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        min:10,
        max:80,
    },
    role:{
        type:String,
        enum:['user' , 'admin'],
        default:user,
    },
    probleSolved:{
        type:[string],
    },
    password:
    {
        type:string,
        required:true,
    }
} , {timestamps:true} )


// creat the model
const User = model('user' , userSchema)

module.exports = User;