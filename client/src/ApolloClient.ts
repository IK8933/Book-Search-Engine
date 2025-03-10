// src/ApolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create an Apollo Client instance
const client = new ApolloClient({
    link: new HttpLink({
    uri: 'http://localhost:3001/graphql',  // GraphQL endpoint
}),
  cache: new InMemoryCache(),  // Caching responses for performance
});

export default client;
