import { gql } from '@apollo/client';

/**
 * GraphQL operations against WPGraphQL + WPGraphQL for WooCommerce.
 *
 * Schema assumptions (configured during WP setup — see SETUP-WP.md):
 *  – WPGraphQL plugin installed and active
 *  – WPGraphQL for WooCommerce installed and active
 *  – Polylang + Polylang for WooCommerce active (for translations)
 *  – (Optional Phase 2) ACF + WPGraphQL for ACF for monogram/tastingNote
 *
 * V1 wires up to vanilla WooCommerce fields — monogram + tastingNote
 * are derived in the mapper from product name + short description.
 */

/** Reusable fields on every product node we render. */
export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    databaseId
    slug
    name
    shortDescription
    description
    ... on SimpleProduct {
      price
      regularPrice
      stockStatus
    }
    ... on VariableProduct {
      price
      regularPrice
      stockStatus
    }
    featuredImage {
      node {
        sourceUrl(size: LARGE)
        altText
      }
    }
    galleryImages {
      nodes {
        sourceUrl(size: LARGE)
      }
    }
    productCategories {
      nodes {
        slug
        name
      }
    }
    productTags {
      nodes {
        slug
        name
      }
    }
  }
`;

/** Full catalog — used by /shop and homepage Featured. */
export const PRODUCTS_QUERY = gql`
  query GetProducts($first: Int = 100) {
    products(first: $first, where: { status: "publish" }) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FIELDS}
`;

/** Single product by slug — used by /shop/[slug]. */
export const PRODUCT_BY_SLUG_QUERY = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;
