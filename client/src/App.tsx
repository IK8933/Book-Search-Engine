import './App.css';
import { ApolloProvider } from '@apollo/client';  
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import client from './ApolloClient';  

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
