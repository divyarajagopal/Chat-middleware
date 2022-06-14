import { Router } from 'express';
import { RootSchema } from '../schema';
import graphqlHTTP from 'express-graphql';

const HandleGraphQL = (router: Router) => {
  router.use(
    '/graphql',
    graphqlHTTP({
      schema: RootSchema,
      graphiql: true
    })
  );
};

export default HandleGraphQL;
