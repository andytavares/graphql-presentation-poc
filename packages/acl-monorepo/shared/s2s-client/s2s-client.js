import { ApolloClient, InMemoryCache } from '@apollo/client';

const createClient = (clientUrl) => {
  return new ApolloClient({
    uri: clientUrl,
    cache: new InMemoryCache(),
  });
};

export default createClient;
