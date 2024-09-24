// auth/src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from 'express';


const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next:NextFunction
  
) => {
  console.error(err);

  const errorResponse = {
    errors: err.message || 'Something went wrong',
  };

  return res.status(500).json({
    success: false,
    data: errorResponse,
    message: errorResponse.errors,
    status: 500,
  });
};

export default errorHandler;