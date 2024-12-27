import { evaluateAnswer } from "@/core/engine/evaluate-answer";

const testCases = [
  {
    userResponse: "The cat is sleeping on the couch",
    answerText: "The cat is sleeping on the sofa",
  },
  {
    userResponse: "Yesterday I go to the store",
    answerText: "Yesterday I went to the store",
  },
  {
    userResponse: "She like ice cream very much",
    answerText: "She likes ice cream very much",
  },
  {
    userResponse: "The weather is very hot today",
    answerText: "It is extremely hot today",
  },
  {
    userResponse: "I have three brothers",
    answerText: "I have 3 brothers",
  },
  {
    userResponse: "The movie was completely boring",
    answerText: "The film was very boring",
  },
  {
    userResponse: "He works as doctor in hospital",
    answerText: "He works as a doctor in the hospital",
  },
  {
    userResponse: "I love to eating pizza",
    answerText: "I love to eat pizza",
  },
  {
    userResponse: "The car is red color",
    answerText: "The car is red",
  },
  {
    userResponse: "They are playing football in garden",
    answerText: "They are playing football in the garden",
  },
  {
    userResponse: "My sister study mathematics",
    answerText: "My sister studies mathematics",
  },
  {
    userResponse: "The book has 300 pages aproximately",
    answerText: "The book has approximately 300 pages",
  },
  {
    userResponse: "I am living here since 5 years",
    answerText: "I have been living here for 5 years",
  },
  {
    userResponse: "The children are making much noise",
    answerText: "The children are making a lot of noise",
  },
  {
    userResponse: "He don't like vegetables",
    answerText: "He doesn't like vegetables",
  },
  {
    userResponse: "I visited Paris last summer",
    answerText: "I went to Paris last summer",
  },
  {
    userResponse: "The train arrives at 3 o'clock",
    answerText: "The train will arrive at 3 o'clock",
  },
  {
    userResponse: "She is more taller than me",
    answerText: "She is taller than me",
  },
  {
    userResponse: "I like very much chocolate",
    answerText: "I really like chocolate",
  },
  {
    userResponse: "This exercise is very difficulty",
    answerText: "This exercise is very difficult",
  },
];

export async function POST() {
  try {
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        const score = await evaluateAnswer(
          testCase.userResponse,
          testCase.answerText,
        );
        return {
          ...testCase,
          score,
        };
      }),
    );

    return Response.json({ results });
  } catch (error) {
    return Response.json(
      { error: "Error al procesar las evaluaciones" },
      { status: 500 },
    );
  }
}
