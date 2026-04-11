

const validator = require('validator')

const validate = (data) => {
    const mandratoryField = ["firstName" , "lastName" , "emailId" , "password"]

    const isAllowed = mandratoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed)
    {
        throw new Error("field missing")
    }

    if(!validator.isEmail(data.emailId))
    {
        throw new Error("invalid email");
    }

    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("week password");
    }

} 

module.exports = validate