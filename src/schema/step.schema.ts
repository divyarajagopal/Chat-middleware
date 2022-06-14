import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

import { AnswerType } from '.';

export const StepType: any = new GraphQLObjectType({
  name: 'Step',
  fields: () => ({
    stepID: { type: GraphQLID },
    text: { type: GraphQLString },
    answer: {
      type: AnswerType
    }
  })
});
