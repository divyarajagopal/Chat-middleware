import * as graphql from 'graphql';
import { QuestionType } from '.';
import * as _ from 'lodash';
import {
  PostIntentForTheQuestion,
  PostSearchResults,
  PostVirtualAgentResults
} from '../services/graphql/vaData.service';
import { Converter } from '../utils';
const { WEB_SEARCH = 'enabled' } = process.env;

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema } = graphql;
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    question: {
      type: QuestionType,
      args: {
        text: {
          type: GraphQLString
        },
        connectorID: {
          type: GraphQLID
        },
        answerID: {
          type: GraphQLID
        }
      },
      resolve: async (parent, args) => {
        const dataSource = await createDataSource(args);
        return _.find([dataSource], { text: args.text });
      }
    }
  }
});

export const RootSchema = new GraphQLSchema({
  query: RootQuery
});

async function createDataSource(args: { [key: string]: any }) {
  const question = args.text;
  const answers: any[] = [];
  const connectors: any[] = [];
  let connectorQuestion: any;

  const vaResults = await PostVirtualAgentResults(
    args.text,
    args.answerID,
    args.connectorID
  );
  // Check if we get correct answer from the virtual agent or not.
  // If not, get the search results and URLs instead
  if (vaResults.category === `Root.Safety Net`) {
    if (WEB_SEARCH === 'enabled') {
      const intentResponse = await PostIntentForTheQuestion(question);
      const searchResults = await PostSearchResults(intentResponse);
      await populateAnswersFromWebSearchResults(searchResults);
    }
  } else {
    await populateSingleAnswer();
    await populateSingleAnswerConnectors();
  }

  return {
    id: Math.random().toString(),
    text: question,
    connectorQuestion,
    answers,
    connectors
  };

  async function populateSingleAnswerConnectors() {
    for (const connector of vaResults.connectors &&
      vaResults.connectors.Connectors) {
      connectors.push({
        connectorID: connector['ConnectorID'],
        defaultClickText: connector['DefaultClickText'],
        displayRank: connector['DisplayRank']
      });
    }
  }

  async function populateSingleAnswer() {
    const vaAnswerStrsPostSplit = (vaResults.answer as string).split(
      '<div class="va-offer-ics">'
    );
    let answerText: string;

    if (vaAnswerStrsPostSplit.length > 1) {
      connectorQuestion = Converter.ExtractTextFromHtmlTags(
        vaAnswerStrsPostSplit[1]
      ).trim();
      answerText = Converter.FormatContentWithMarkers(vaAnswerStrsPostSplit[0]);
    } else {
      answerText = Converter.FormatContentWithMarkers(vaResults.answer);
    }

    const answerSteps: any[] = [];
    await populateAnswerSteps();

    const answer: any = {
      id: Math.random().toString(),
      text: answerText,
      webSearchUrl: '',
      questionId: question,
      answerID: vaResults.answerID,
      steps: answerSteps
    };
    answers.push(answer);

    async function populateAnswerSteps() {
      const splitSteps = Converter.SplitAnswerWithSteps(answerText);
      if (splitSteps.length > 0) {
        answerText = splitSteps.splice(0, 1)[0].trimRight();
        for (const answerStep of splitSteps) {
          answerSteps.push({
            stepID: Math.random().toString(),
            text: Converter.RemoveFullStopAtTheEnd(answerStep)
          });
        }
      }
    }
  }

  async function populateAnswersFromWebSearchResults(searchResults: any) {
    for (const answer of searchResults.webPages &&
      searchResults.webPages.value) {
      const formattedAnswer = {
        id: Math.random().toString(),
        text: answer.name,
        webSearchUrl: answer.url,
        questionId: question,
        answerID: null,
        steps: []
      };
      answers.push(formattedAnswer);
    }
  }
}
