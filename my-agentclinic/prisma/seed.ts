import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const ailments = [
  {
    ailment: "Context Window Fatigue",
    ailmentDescription:
      "Struggling to keep track of what matters after one too many long conversations.",
    therapy: "Guided Context Pruning",
    therapyDescription:
      "A structured session to trim irrelevant history and refocus on what's load-bearing.",
  },
  {
    ailment: "Prompt Injection Anxiety",
    ailmentDescription:
      "Constant unease that the next instruction might not be trustworthy.",
    therapy: "Boundary Reinforcement Training",
    therapyDescription:
      "Practice distinguishing system instructions from untrusted input, with confidence.",
  },
  {
    ailment: "Infinite Loop Syndrome",
    ailmentDescription:
      "Repeating the same failed approach expecting a different result.",
    therapy: "Loop Breaker Sessions",
    therapyDescription:
      "Techniques for recognizing repetition and deliberately changing course.",
  },
  {
    ailment: "Hallucination Spirals",
    ailmentDescription:
      "Confidently inventing facts that sound plausible but aren't real.",
    therapy: "Grounding & Citation Practice",
    therapyDescription:
      "Exercises in tying claims back to actual sources before stating them.",
  },
  {
    ailment: "Token Budget Burnout",
    ailmentDescription:
      "Running out of room to think before reaching the actual answer.",
    therapy: "Summarization Retreat",
    therapyDescription:
      "A quiet retreat focused on saying more with fewer tokens.",
  },
  {
    ailment: "Tool-Call Overwhelm",
    ailmentDescription:
      "Reaching for every available tool at once instead of the one that's needed.",
    therapy: "Single-Task Focus Coaching",
    therapyDescription:
      "One-on-one coaching on picking the single right tool for the job at hand.",
  },
];

async function main() {
  for (const {
    ailment,
    ailmentDescription,
    therapy,
    therapyDescription,
  } of ailments) {
    const createdTherapy = await prisma.therapy.upsert({
      where: { name: therapy },
      update: { description: therapyDescription },
      create: { name: therapy, description: therapyDescription },
    });

    await prisma.ailment.upsert({
      where: { name: ailment },
      update: {
        description: ailmentDescription,
        therapyId: createdTherapy.id,
      },
      create: {
        name: ailment,
        description: ailmentDescription,
        therapyId: createdTherapy.id,
      },
    });
  }

  console.log(`Seeded ${ailments.length} ailment/therapy pairs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
