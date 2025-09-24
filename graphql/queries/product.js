import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query Product($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      averageRating
      slug
      description
      image {
        id
        uri
        title
        srcSet
        sourceUrl
      }
      name
      productCategories {
        nodes {
          id
          name
          slug
        }
      }

      ... on SimpleProduct {
        id
        stockQuantity
        price
        regularPrice
        salePrice
        onSale
      }

      ... on VariableProduct {
        id
        price
        regularPrice
        salePrice
        onSale
        allPaColor {
          nodes {
            name
          }
        }
        allPaSize {
          nodes {
            name
          }
        }
        variations(first: 50) {   # 👈 thêm first: 50 (hoặc hơn nếu nhiều)
          nodes {
            id
            databaseId
            name
            stockStatus
            stockQuantity
            purchasable
            onSale
            salePrice
            regularPrice
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }

      ... on ExternalProduct {
        id
        price
        externalUrl
      }

      ... on GroupProduct {
        products {
          nodes {
            ... on SimpleProduct {
              id
            }
          }
        }
        id
      }
    }
  }
`;