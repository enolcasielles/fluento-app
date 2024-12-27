import { OpenAI } from "openai";
import { CustomError } from "../errors";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function evaluateAnswer(
  userResponse: string,
  answerText: string,
): Promise<number> {
  try {
    const prompt = `
    Eres un profesor de idiomas experto. Compara las siguientes dos respuestas y evalúa qué tan similar es la respuesta del usuario a la respuesta correcta.
    
    Respuesta correcta: "${answerText}"
    Respuesta del usuario: "${userResponse}"
    
    Evalúa la similitud en una escala del 1 al 4, donde:
    1 = Muy incorrecta (significado muy diferente o respuesta incomprensible)
    2 = Parcialmente incorrecta (tiene algunos elementos correctos pero con errores importantes)
    3 = Mayormente correcta (pequeños errores pero mantiene el significado)
    4 = Muy correcta (igual significado, pueden existir pequeñas variaciones gramaticales)
    
    Responde únicamente con el número de la evaluación (1, 2, 3 o 4).
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 5,
    });

    const score = parseInt(
      completion.choices[0].message.content?.trim() ?? "0",
    );

    if (score >= 1 && score <= 4) {
      return score;
    }

    throw new CustomError({
      message: "La evaluación no produjo un resultado válido",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al evaluar la respuesta",
    });
  }
}
