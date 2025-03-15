import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = new HttpLink({
  uri: '/graphql',  
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;



// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// // Set up GraphQL endpoint (uses Vite proxy to avoid CORS issues)
// const httpLink = new HttpLink({
//   uri: '/graphql',  // ✅ Fix: Uses relative path to work with Vite proxy
// });

// // Attach JWT token to every request
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// // Create Apollo Client instance with authentication
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// export default client;



// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// // Set up GraphQL endpoint
// const httpLink = new HttpLink({
//   uri: 'http://localhost:3001/graphql',  // Adjust this when deploying
// });

// // Attach JWT token to every request
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// // Create Apollo Client instance with authentication
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// export default client;


// // src/ApolloClient.ts
// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// // Create an Apollo Client instance
// const client = new ApolloClient({
//     link: new HttpLink({
//     uri: 'http://localhost:3001/graphql',  // GraphQL endpoint
// }),
//   cache: new InMemoryCache(),  // Caching responses for performance
// });

// export default client;
