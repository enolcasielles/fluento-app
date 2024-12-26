import { Result, Unit } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function generateNextUnit(sessionId: string): Promise<Unit> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      list: {
        include: {
          units: {
            include: {
              results: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      },
    },
  });

  const units = session.list.units;

  const currentTime = new Date().getTime();
  const maxTimeDifference = units
    .filter((unit) => unit.results.length > 0)
    .map((unit) => currentTime - unit.results[0].createdAt.getTime())
    .sort((a, b) => b - a)[0];

  const scoredUnits = units.map((unit) => {
    const practiceResults: Result[] = unit.results;

    const score =
      practiceResults.length === 0
        ? 1
        : practiceResults.reduce((prev, elem) => prev + elem.score, 0) /
          practiceResults.length;
    const timesPracticed = practiceResults.length;
    const lastPracticedTime =
      practiceResults.length === 0
        ? currentTime - maxTimeDifference
        : new Date(practiceResults[0].createdAt).getTime();

    const timeSinceLastPracticed = currentTime - lastPracticedTime;

    // Cálculo del finalScore con los pesos previamente definidos
    const finalScore =
      0.4 * (1 / score) +
      0.3 * (timeSinceLastPracticed / maxTimeDifference) +
      0.2 * (1 / (timesPracticed + 1)) +
      0.1 * Math.random();

    return {
      unitId: unit.id,
      finalScore,
    };
  });
  const highestScoreUnit = scoredUnits.reduce((prev, current) => {
    return prev.finalScore > current.finalScore ? prev : current;
  }, scoredUnits[0]);
  return units.find((unit) => unit.id === highestScoreUnit.unitId);
}
