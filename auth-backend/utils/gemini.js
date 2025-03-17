import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getLanguageGreeting = async (preferredLanguages) => {
  if (!preferredLanguages || preferredLanguages.length === 0) {
    return 'Hello!';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = `Given these preferred languages: ${preferredLanguages.join(
      ' '
    )}, provide a short, appropriate greeting in one of these languages. Just in 3 - 6 words.
    If there are more then 1 languages please provide the result like this: 
    Language name: respone next line language name: response `;

    const result = await model.generateContent([prompt]);
    const response = result.response;
    if (response && response.text) {
      console.log('result', response.text());
      return response.text();
    } else {
      return 'Hello!';
    }
  } catch (error) {
    console.error('Error getting language greeting:', error);
    return 'Hello!';
  }
};
