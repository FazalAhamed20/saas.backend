import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../Utils/jwt/generateAccessToken'; 
import { Request, Response, NextFunction } from "express";
import { log } from 'console';

interface UserPayload {
    _id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        
        
        const { access_token, refresh_token } = req.cookies;

        if (!access_token && !refresh_token) {
           
            return res.status(401).json({ message: "No access or refresh token provided" });
        }

        let user: UserPayload | null = null;

      
        if (access_token) {
            try {
                user = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET!) as UserPayload;
            } catch (error:any) {
                console.warn("Access token expired or invalid:", error.message);
            }
        }

      
        if (!user && refresh_token) {
            try {
                user = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!) as UserPayload;
              
                

               
                if (user) {
                    const newAccessToken = generateAccessToken({
                        _id: String(user._id),
                        email: String(user.email),
                    });
                   
                    
                    res.cookie("access_token", newAccessToken, {
                        httpOnly: true,
                        secure:true,     
                        sameSite: 'none',    
                        maxAge: 7200000,    
                      });
                }
            } catch (error:any) {
               
                console.warn("Refresh token expired or invalid:", error.message);
                return res.status(401).json({ message: "Invalid refresh token" });
            }
        }


      
        if (!user) {
            return res.status(401).json({ message: "Invalid or missing token" });
        }

        
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in JWT middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};