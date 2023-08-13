import User from "../models/userModel.js";
import Password from "../models/savePassword.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';


export const userSignup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
      }
  
      const userExistsByEmail = await User.findOne({ email });
  
      if (userExistsByEmail) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: true,
      });
  
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        token: generateAuthToken(user._id),
      });
    } catch (error) {
      console.error("Error during user signup:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  




  export const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect email" });
    }
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }
  
    
  
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: generateAuthToken(user._id),
    });
  });
  
  
  export const saveData = async (req, res) => {
    try {
      const { userId } = req.params;
      const { password, name } = req.body;
      if (!password || !name ) {
        return res.status(400).json({ error: "Please provide all required fields" });
      }

      const userpassword = await Password.findOne({ password });
      const username = await Password.findOne({ name });
  
      if (userpassword) {
        console.log("User with this email already exists");
        return res.status(400).json({ error: " this password already exists" });
      }
  
      if (username) {
        console.log("phone number already used");
        return res.status(400).json({ error: " this name already exists" });
  
      }


      const newPassword = new Password({
        userId,
        name,
        password,
      });
  
      await newPassword.save();
  

          const response = await Password.create({ password, name });
      
          res.status(200).json({ message: "Password saved successfully", data: response });
        } catch (error) {
          console.log(error);
          if (error.code === 11000) {
            res.status(400).json({ error: "Duplicate key error: Password already exists" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      };
      



  export const dataInfo = asyncHandler(async (req, res) => {
  
    const userIdString = req.params.userId;
    const userId =new mongoose.Types.ObjectId(userIdString); 
  
    try {
      const saveData = await Password.find({userId});
  
      if (!saveData) {
        return res.status(404).json({ message: "Data not found" });
      }
  
      res.status(200).json(saveData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });




export const deleteData = async (req, res) => {

  try {
    const Id = req.params.id;
    await Password.findByIdAndDelete(Id);
    res.json({ message: ' deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  

  const generateAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
  };
  export default userLogin;
    