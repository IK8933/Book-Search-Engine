// src/App.tsx
import './App.css';
import { ApolloProvider } from '@apollo/client';  // Import ApolloProvider
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import client from './ApolloClient';  // Import the Apollo Client

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
