import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useMemo } from "react";

const httpLink = (token) =>
  new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const wsLink = (token) =>
  new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_WS_GRAPHQL_API,
    options: {
      reconnect: true,
      timeout: 30000,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });

const link = (token) => {
  return process.browser
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink(token),
        httpLink(token)
      )
    : httpLink(token);
};

let apolloClient;
let savedToken;

const createApolloClient = (token) => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: link(token),
    cache: new InMemoryCache(),
  });
};

export function initializeApollo(token, initialState = null) {
  // eslint-disable-next-line no-underscore-dangle
  let _apolloClient;
  if (!savedToken && token) _apolloClient = createApolloClient(token);
  else if (!apolloClient) _apolloClient = createApolloClient(token);
  else _apolloClient = apolloClient;

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  savedToken = token;
  return _apolloClient;
}

export function useApollo(token, initialState) {
  const store = useMemo(() => {
    if (token) return initializeApollo(token, initialState);
    return null;
  }, [initialState, token]);
  return store;
}
