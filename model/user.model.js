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
        default:'user',
    },
    probleSolved:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "problem",
        }],
        unique:true,
    },
    password:
    {
        type:String,
        required:true,
    }
} , {timestamps:true} )


// post function {ye jb chale ga jb sare chal jaye ge}
userSchema.post('findOneAndDelete' , async function (userInfo){ // ye fucn. tab chalge ga jab hum findOneAndDelete call kre ge
    if(userInfo) // userInfo => jb hum eek user ko delete kre ge to use ki info ko return karate h ki ye user delete ho gay h to vo info userInfo ke ander store h
    {
        await mongoose.model('submission').deleteMany({userId: userInfo._id});
    }
});

// creat the model
const User = model('user' , userSchema)

module.exports = User; 