import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 8) {
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

export const GET_PRODUCTS_WITH_FILTERS = gql`
  query GetProductsShop($first: Int = 12, $after: String, $search: String, $category: String) {
    products(first: $first, after: $after, where: { search: $search, category: $category }) {
      pageInfo {
        hasNextPage
        endCursor
      }
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

export const GET_POPULAR_PRODUCTS = gql`
query GetPopularProducts {
  products(first: 8, where: { orderby: { field: POPULARITY, order: DESC } }) {
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
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
      image {
        sourceUrl
      }
    }
  }
}
`;

export const GET_ARRIVALS_PRODUCTS = gql`
query GetArrivalsProducts {
  products(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
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
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
      image {
        sourceUrl
      }
    }
  }
}
`;


