import validator from 'validator';

const isValidSignup =(req)=>{

    const {firstName ,lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email ID");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

    return true;

}

export default isValidSignup;