import { ApolloProvider } from "@apollo/client/react";
import client from "../lib/apolloClient";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import '../styles/globals.css';
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Header />
        <Component {...pageProps} />
      </CartProvider>
    </ApolloProvider>
  );
}

export default MyApp;
