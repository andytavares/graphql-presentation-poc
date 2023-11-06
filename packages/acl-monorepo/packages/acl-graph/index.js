import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [{ name: 'products', url: 'http://localhost:4005/' }],
  }),
});

const server = new ApolloServer({
  gateway,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`Server running at: ${url}`);
