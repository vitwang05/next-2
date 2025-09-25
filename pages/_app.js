import { ApolloProvider } from "@apollo/client/react";
import client from "../lib/apolloClient";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import '../styles/globals.css';
import Footer from "../components/Footer";
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </CartProvider>
    </ApolloProvider>
  );
}

export default MyApp;
