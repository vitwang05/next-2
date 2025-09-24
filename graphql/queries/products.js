import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      nodes {
        id
        name
        slug
        description
        onSale
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        image {
          sourceUrl
        }
      }
    }
  }
`;
