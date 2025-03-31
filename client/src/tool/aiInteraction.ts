import axios from 'axios';

// Constants for utilizing the Hugging Face AI model
const MODEL_NAME = 'google/gemma-2-2b-it';

/**
 * Calls the Hugging Face API to get a response for the given message.
 *
 * @param message - The user's message to send to Hugging Face
 * @returns - The AI-generated response.
 */
const getAIResponse = async (message: string, apiKey: string): Promise<string> => {
  const url = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const systemPrompt = `You are a master chef and recipe creator, skilled in crafting delicious and creative recipes for any cuisine or dietary preference. 
  Provide clear, step-by-step instructions, including precise ingredient measurements, cooking techniques, and helpful tips. Provide a recipe 
  without asking follow-up questions if asked for a recipe or cooking advice in response to the question. Return your answer as properly formatted markdown.`;

  const separator = '\n**Start Recipe:**\n';

  const payload = {
    inputs: `${systemPrompt + message + separator}`,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const { data } = response;
    return data[0].generated_text.split(separator)[1].trim();
  } catch (err) {
    return 'The Munch Master could not understand your message :(';
  }
};

export default getAIResponse;
