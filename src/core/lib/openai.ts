import { OpenAI } from "openai";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai: OpenAI = oai;
