import * as graphql from 'graphql';
import { AnswerType, ConnectorType } from '.';
import * as _ from 'lodash';

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

export const QuestionType: any = new GraphQLObjectType({
  name: 'Question',
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    connectorQuestion: { type: GraphQLString },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve(parent) {
        return parent.answers;
      }
    },
    connectors: {
      type: new GraphQLList(ConnectorType),
      resolve(parent) {
        return parent.connectors;
      }
    }
  })
});
