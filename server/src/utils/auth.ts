import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret';  

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop()?.trim();
  }

  console.log("🔎 Extracted Token:", token);

  if (!token) {
    console.log(" No token found in request.");
    return { user: null };  
  }

  try {
    const { data }: any = jwt.verify(token, SECRET_KEY, { maxAge: "2h" });
    console.log(" Token successfully verified. Decoded Data:", data);
    return { user: data };
  } catch (err) {
    console.log(" Invalid token:", (err as Error).message);  
    return { user: null };
  }
};


export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, SECRET_KEY, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};


