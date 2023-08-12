
import asyncHandler from 'express-async-handler'
import { verifyJwtToken } from './verifyTocken.js';
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
    return res.status(401).json({
      status: false,
      message: "Token not found"
    });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = await verifyJwtToken(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp > currentTime) {
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      req.user = user; 
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Token Expired"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
});

