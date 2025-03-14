import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret';  // ✅ Added fallback value

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop()?.trim();
  }

  console.log("🔎 Extracted Token:", token);

  if (!token) {
    console.log("❌ No token found in request.");
    return { user: null };  
  }

  try {
    const { data }: any = jwt.verify(token, SECRET_KEY, { maxAge: "2h" });
    console.log("✅ Token successfully verified. Decoded Data:", data);
    return { user: data };
  } catch (err) {
    console.log("❌ Invalid token:", (err as Error).message);  // ✅ TypeScript-safe error handling
    return { user: null };
  }
};

// export const authenticateToken = ({ req }: any) => {
//   let token = req.body.token || req.query.token || req.headers.authorization;

//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   if (!token) {
//     return { user: null };  // ✅ Ensure context.user is always set
//   }

//   try {
//     const { data }: any = jwt.verify(token, SECRET_KEY, { maxAge: '2h' });
//     return { user: data };  // ✅ Now returning the user object correctly
//   } catch (err) {
//     console.log('❌ Invalid token');
//     return { user: null };  // ✅ Ensure app doesn't crash if token is invalid
//   }
// };

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


// import jwt from 'jsonwebtoken';
// import { GraphQLError } from 'graphql';
// import dotenv from 'dotenv';
// dotenv.config();


// export const authenticateToken = ({ req }: any) => {
//   // Allows token to be sent via req.body, req.query, or headers
//   let token = req.body.token || req.query.token || req.headers.authorization;

//   // If the token is sent in the authorization header, extract the token from the header
//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   // If no token is provided, return the request object as is
//   if (!token) {
//     return req;
//   }

//   // Try to verify the token
//   try {
//     const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
//     // If the token is valid, attach the user data to the request object
//     req.user = data;
//   } catch (err) {
//     // If the token is invalid, log an error message
//     console.log('Invalid token');
//   }

//   // Return the request object
//   return req;
// };

// // export const signToken = (username: string, email: string, _id: unknown) => {
// //   // Create a payload with the user information
// //   const payload = { username, email, _id };
// //   const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables

// //   // Sign the token with the payload and secret key, and set it to expire in 2 hours
// //   return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
// // };
// export const signToken = (username: string, email: string, _id: unknown) => {
//   const payload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY || 'default_secret';

//   const token = jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });

//   console.log("✅ Generated Token:", token);  // <-- ADD THIS LINE

//   return token;
// };

// export class AuthenticationError extends GraphQLError {
//   constructor(message: string) {
//     super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
//     Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
//   }
// };
