import * as graphql from 'graphql';
import { QuestionType, StepType } from '.';
import * as _ from 'lodash';

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

export const AnswerType: any = new GraphQLObjectType({
  name: 'Answer',
  fields: () => ({
    id: { type: GraphQLID },
    answerID: { type: GraphQLID },
    text: { type: GraphQLString },
    webSearchUrl: { type: GraphQLString },
    question: {
      type: QuestionType
    },
    steps: {
      type: new GraphQLList(StepType),
      resolve(parent) {
        return parent.steps;
      }
    }
  })
});
