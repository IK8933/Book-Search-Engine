import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';

// 🚩 Import ApolloServer and Middleware
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './utils/auth.js';

// 🚩 Import GraphQL Playground
import { renderPlaygroundPage } from 'graphql-playground-html';

// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

// Fix for ES module: Define __dirname manually
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, //  Allows schema inspection
});

const app = express();

const startApolloServer = async () => {
  try {
    await server.start();
    await db;

    db.on('error', (err) => {
      console.error(' MongoDB connection error:', err);
      process.exit(1);
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      '/graphql',
      expressMiddleware(server as any, {
        context: authenticateToken as any,
      })
    );

    //  Manually Add GraphQL Playground
    app.get('/graphql', (_req: Request, res: Response) => {
      res.send(renderPlaygroundPage({ endpoint: '/graphql' }));
    });

    if (process.env.NODE_ENV === 'production') {
          app.use(express.static(path.join(__dirname, '../client/dist')));
      
          app.get('*', (_req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
          });
        }

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start the server
startApolloServer();




















// import express from 'express';
// import path from 'node:path';
// import type { Request, Response } from 'express';

// // Import the ApolloServer class
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { authenticateToken } from './utils/auth.js';

// // Import the two parts of a GraphQL schema
// import { typeDefs, resolvers } from './schemas/index.js';
// import db from './config/connection.js';

// // Fix for ES module: Define __dirname manually
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const PORT = process.env.PORT || 3001;
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
// });

// const app = express();

// const startApolloServer = async () => {
//   try {
//     await server.start();
//     await db;

//     db.on('error', (err) => {
//       console.error(' MongoDB connection error:', err);
//       process.exit(1);
//     });

//     app.use(express.urlencoded({ extended: true }));
//     app.use(express.json());

//     app.use(
//       '/graphql',
//       expressMiddleware(server as any, {
//         context: authenticateToken as any,
//       })
//     );

//     if (process.env.NODE_ENV === 'production') {
//       const clientPath = path.join(__dirname, '../client/dist');
//       app.use(express.static(clientPath));

//       app.get('*', (_req: Request, res: Response) => {
//         res.sendFile(path.join(clientPath, 'index.html'));
//       });
//     }

//     app.listen(PORT, () => {
//       console.log(`API server running on port ${PORT}!`);
//       console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
//     });
//   } catch (error) {
//     console.error('Error starting server:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startApolloServer();


// import express from 'express';
// import path from 'node:path';
// import type { Request, Response } from 'express';

// // Import the ApolloServer class
// import {ApolloServer} from '@apollo/server';
// import {expressMiddleware} from '@apollo/server/express4';
// import { authenticateToken } from './utils/auth.js';

// // Import the two parts of a GraphQL schema
// import { typeDefs, resolvers } from './schemas/index.js';
// import db from './config/connection.js';

// const PORT = process.env.PORT || 3001;
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
  
// });

// const app = express();

// // Create a new instance of an Apollo server with the GraphQL schema
// const startApolloServer = async () => {
//   await server.start();
//   await db;

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   app.use('/graphql', expressMiddleware(server as any,
//     {
//       context: authenticateToken as any
//     }
//   ));

//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));

//     app.get('*', (_req: Request, res: Response) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }
//   db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });

// };

// // Call the async function to start the server
// startApolloServer();
