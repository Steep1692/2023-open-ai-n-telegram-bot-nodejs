import { OPEN_AI_TOKEN } from './config';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

export const askOpenAI = async (question: string) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: question,
  });

  return completion.data.choices[0].text
}