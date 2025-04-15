import axios from 'axios';

const getAIResponse = async (message: string, apiKey: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  const systemPrompt = `You are a master chef and recipe creator, skilled in crafting delicious and creative recipes for any cuisine or dietary preference. 
Provide clear, step-by-step instructions, including precise ingredient measurements, cooking techniques, and helpful tips. Provide a recipe 
without asking follow-up questions if asked for a recipe or cooking advice in response to the question. Return your answer as properly formatted markdown.`;

  const separator = '\n**Start Recipe:**\n';

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt + message + separator}`,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const { data } = response;

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return generatedText;
  } catch (err) {
    return 'The Munch Master could not understand your message :(';
  }
};

export default getAIResponse;
