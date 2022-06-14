import { QuestionType } from '.';
import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

export const ConnectorType: any = new GraphQLObjectType({
  name: 'Connector',
  fields: () => ({
    connectorID: { type: GraphQLID },
    defaultClickText: { type: GraphQLString },
    displayRank: { type: GraphQLString },
    question: {
      type: QuestionType
    }
  })
});
