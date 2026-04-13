const {Schema , model} = require('mongoose')

// create the new schema
const ProblemSchema = new Schema ({
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy' , 'medium' , 'hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linklist','graph','dp'],
        required:true,
    },
    vidibleTestCases:[
        {
            input:
            {
                type:String,
                required:true,
            },
            output:
            {
                type:String,
                required:true,
            },
            explanation:
            {
                type:String,
                required:true,
            }
        }
    ],
    hiddenTestCases:[
        {
            input:
            {
                type:String,
                required:true,
            },
            output:
            {
                type:String,
                required:true,
            },
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true,
            }
        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
},{timestamps:true})

const problem = model('problem' , ProblemSchema)

module.exports = problem