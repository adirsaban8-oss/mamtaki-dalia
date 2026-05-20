'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

/**
 * Apollo Client factory — points at the WordPress / WPGraphQL endpoint.
 *
 *   NEXT_PUBLIC_WP_GRAPHQL_URL=http://mamtaki-dalia.local/graphql  (Local by Flywheel)
 *   NEXT_PUBLIC_WP_GRAPHQL_URL=https://admin.mamtaki-dalia.co.il/graphql  (prod)
 *
 * If the env var is unset, queries will fail silently and the data-
 * source hook falls back to the local Zustand catalog. That makes
 * `npm run dev` work the same whether or not WordPress is running.
 */

let apolloSingleton: ApolloClient | null = null;

export function getApolloClient(): ApolloClient {
  if (apolloSingleton) return apolloSingleton;

  const uri = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ?? 'http://localhost/graphql';

  apolloSingleton = new ApolloClient({
    link: new HttpLink({
      uri,
      credentials: 'omit',
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Product: { keyFields: ['databaseId'] },
        SimpleProduct: { keyFields: ['databaseId'] },
        VariableProduct: { keyFields: ['databaseId'] },
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
      query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    },
  });

  return apolloSingleton;
}

/** Returns `true` when a WordPress endpoint is configured. */
export function isWordPressMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DATA_SOURCE === 'wordpress' &&
    !!process.env.NEXT_PUBLIC_WP_GRAPHQL_URL
  );
}
