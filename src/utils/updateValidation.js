
import validator from "validator";

const validateUpdateFields = (req)=>{

    const {firstName , lastName, age, photoUrl, skills , about} = req.body;

    
    if(age && (isNaN(age) || age <=18)){
        throw new Error("Age must be a number and at least 18");
    }
    if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error("Invalid Photo URL");
    }
    if(about && about.length > 500){
        throw new Error("About section cannot exceed 500 characters");
    }
    if(skills &&  skills.length>10){
        throw new Error("Skills cannot have more than 10 entries");
    }

    return true
}

export default validateUpdateFields;