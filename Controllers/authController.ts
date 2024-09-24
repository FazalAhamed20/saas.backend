import { NextFunction, Request, Response } from "express";
import { generateOTP } from "../Utils/otp/generateOtp";
import {Otp} from "../Models/otpModel";
import { sendOTP } from "../Utils/otp/sendOTP";
import { hashPassword } from "../Utils/bcrypt/hashPassword";
import User from "../Models/userModel";
import { comparePassword } from "../Utils/bcrypt/comparePassword";
import { generateAccessToken } from "../Utils/jwt/generateAccessToken";
import { generateRefreshToken } from "../Utils/jwt/generateRefreshToken";
import jwt from 'jsonwebtoken';




export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   const {email}=req.body

    const credentials = {
        email: email,
        otp: await generateOTP(),
      };
      const existUser = await Otp.findOne({ email });
      
      if (existUser) {
        throw new Error('User Already Exist');
      }
      await sendOTP(credentials.email,credentials.otp)
      const newUser = await Otp.create(credentials);
      console.log(newUser);
    
      if (!newUser) {
        throw new Error('OTP creation failed');
      }
      setTimeout(async () => {
        try {
          await Otp.findByIdAndDelete(newUser._id);
          console.log(`User with id ${newUser._id} deleted after 1 minute.`);
        } catch (error: any) {
          console.error(
            `Failed to delete user with id ${newUser._id}: ${error?.message}`,
          );
        }
      }, 60000);
      res.status(201).json({
        success: true,
        message: "Otp created successfully",
       
      });
    
  
  } catch (error) {
    next(error);
  }
};





export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);

    const { email, otp, password, username } = req.body;
    const findUser = await Otp.findOne({ email });

    if (!findUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return
    }

    if (findUser.otp == otp) {
    
      const hashedPassword = await hashPassword(password);

    
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const data={
        name:newUser.username,
        isAdmin:newUser.isAdmin
      }
      const accessToken = generateAccessToken({
        _id: String(newUser._id),
        email: String(newUser.email),
      });
  
      const refreshToken = generateRefreshToken({
        _id: String(newUser._id),
        email: String(newUser.email),
      });
  
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure:true,     
        sameSite: 'none',    
        maxAge: 7200000,    
      });
  
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

     res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: data, 
      });
      return 
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
      return
    }
  } catch (error) {
    next(error); 
  }
};


export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {email,password}=req.body
      const findUser=await User.findOne({email:email})

      if (!findUser) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return
      }
      const match = await comparePassword(password, String(findUser.password));
      if (!match) {
        res
          .status(401)
          .json({ success: false, message: "Password is incorrect" });
        return;
      }

      const data={
        name:findUser.username,
        isAdmin:findUser.isAdmin
      }

      const accessToken = generateAccessToken({
        _id: String(findUser._id),
        email: String(findUser.email),
      });
  
      const refreshToken = generateRefreshToken({
        _id: String(findUser._id),
        email: String(findUser.email),
      });
  
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure:true,     
        sameSite: 'none',    
        maxAge: 7200000,    
      });
  
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
  
      
    
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user:data
   
      });
    } catch (error) {
      next(error); 
    }
  };
  
  export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Log the access token before clearing the cookies
      console.log("Before clearing cookies:", req.cookies.access_token);
      
      res.cookie("access_token", "", {
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("refresh_token", "", {
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
  
      console.log("Cookies cleared");
  
     
  
      res.status(201).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  

  export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies.access_token;
  
      console.log("token",token);
      if (!token) {
        res.json({ isAuthenticated: false });
        return;
      }
  
      try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        res.json({ isAuthenticated: true });
      } catch (error) {
        res.json({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };