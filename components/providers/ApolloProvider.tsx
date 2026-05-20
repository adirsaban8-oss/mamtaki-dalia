'use client';

import { ApolloProvider as ApolloProviderBase } from '@apollo/client/react';
import { getApolloClient } from '@/lib/graphql/client';

/**
 * Client-side Apollo provider. Mounted from the root layout so any
 * client component can call useQuery. When WordPress isn't configured
 * (NEXT_PUBLIC_DATA_SOURCE != 'wordpress'), the provider is still
 * present but nothing actually fetches — useProducts skips Apollo.
 */
export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProviderBase client={getApolloClient()}>{children}</ApolloProviderBase>;
}
