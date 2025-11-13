import express from "express";
import isValidSignup from "../utils/validation.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import userAuth from "../middleware/userAuth.js";
import validateUpdateFields from "../utils/updateValidation.js";
const authRouter = express.Router();

const app = express();

app.use(express.json());

// Define your auth routes here

authRouter.post("/signup", async (req, res) => {
  try {
    //validate the user data
    const validation = isValidSignup(req);
    console.log("validation ", validation);
    if (!validation) {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }

    //encrypt password
    const { password, firstName, lastName, emailId, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const isUserExists = await User.findOne({ emailId });
    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists with " + emailId + " email",
      });
    }
    if (age < 18) {
      return res.status(400).json({
        message: "User must be at least 18 years old to sign up",
      });
    }
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
      age: req.body.age,
      gender: req.body.gender,
      skills: req.body.skills,
      about: req.body.about,
      photoUrl: req.body.photoUrl,
    });

    const signedUpUser = await user.save();

    res.json({
      message: "User signed up successfully!!",
      data: signedUpUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while signing up the user",
      error: err.message,
    });
  }
});

authRouter.patch("/update", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //allowed fields to update
    const allowedUpdates = [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];

    //check if the fields are valid
    const isValidField = Object.keys(req.body).every((k) =>
      allowedUpdates.includes(k)
    );

    if (!isValidField) {
      return res.status(400).json({
        message: "Invalid updates! Allowed fields ",
      });
    }

    //validate the fields
    const validation = validateUpdateFields(req);
    if (!validation) {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }

    const updatedField = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      photoUrl: req.body.photoUrl,
      about: req.body.about,
      skills: req.body.skills,
    };

    //update the fields
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedField);
    console.log("updated User ", updatedUser);
    res.json({
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while updating the profile",
      error: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Email ID and Password are required for login");
    }
    const user = await User.findOne({ emailId });
    console.log("user ", user);

    if (!user) {
      throw new Error("User does not exist with " + emailId + " email");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid login credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });
    const requiredField = ["firstName" , "lastName" , "photoUrl" , "age" , "about" ,"skills" ,"gender"]
    const safeUser = {};
for (const key of requiredField) {
  if (user[key] !== undefined) {
    safeUser[key] = user[key];
  }
}
      console.log("safe" , safeUser)
    res.json({
      message: "User Logged in successfully!",
      data: safeUser,
    });
  } catch (err) {
    res.status(400).json({
      message: " Invlaid login credentials",
      error: err.message,
    });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "User logged out successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error while logging out the user",
      error: err.message,
    });
  }
});

export default authRouter;
