import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';


const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
  process.exit(1);
}


export const Authenticate = (req: Request, res: Response, next: NextFunction) : void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'No token provided',
      message: 'Please provide valid authentication'
    });
    return;
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    (req as any).user = decode;
    next();
  } catch (error: VerifyErrors | any) {
    res.status(401).json({
      error: 'Invalid token',
      message: error.message
    });
    return;
  }
}
