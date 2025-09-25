import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart {
    cart {
      contents {
        nodes {
          key
          quantity
          total

          product {
            node {
              id
              name
              image {
                id
                uri
                title
                srcSet
                sourceUrl
              }
              # Pricing depends on concrete product type
              ... on ProductWithPricing {
                price
                regularPrice
                salePrice
                onSale
              }
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
            }
          }
        }
      }
      total
    }
  }
`;
