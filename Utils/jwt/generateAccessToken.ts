import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateAccessToken = (payload: {
  _id: string;
  email: string;
  
}): string => {
  const accessToken = jwt.sign(
    payload,
    String(process.env.ACCESS_TOKEN_SECRET),
   
  );

  return accessToken;
};