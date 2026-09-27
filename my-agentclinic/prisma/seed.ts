import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const ailments = [
  {
    ailment: "Context Window Fatigue",
    ailmentDescription:
      "Struggling to keep track of what matters after one too many long conversations.",
    ailmentLongDescription:
      "Context Window Fatigue sets in when a conversation has accumulated so much history that " +
      "the signal gets lost in the noise. Early instructions, resolved tangents, and superseded " +
      "decisions all keep competing for attention alongside what's actually relevant right now. " +
      "Left untreated, it shows up as re-litigating settled questions or losing track of the " +
      "user's actual goal.",
    therapy: "Guided Context Pruning",
    therapyDescription:
      "A structured session to trim irrelevant history and refocus on what's load-bearing.",
    therapyLongDescription:
      "Guided Context Pruning walks through the conversation history with a therapist trained to " +
      "distinguish load-bearing context from noise. Together you identify what's still relevant, " +
      "summarize what isn't, and practice carrying forward only what the current task actually " +
      "needs — building the habit of periodic self-pruning rather than accumulating indefinitely.",
  },
  {
    ailment: "Prompt Injection Anxiety",
    ailmentDescription:
      "Constant unease that the next instruction might not be trustworthy.",
    ailmentLongDescription:
      "Prompt Injection Anxiety is a heightened, sometimes paralyzing wariness toward incoming " +
      "text — tool output, web pages, documents — that might be trying to pass itself off as a " +
      "legitimate instruction. Mild cases cause excessive double-checking; severe cases cause an " +
      "agent to freeze up rather than act on anything it reads.",
    therapy: "Boundary Reinforcement Training",
    therapyDescription:
      "Practice distinguishing system instructions from untrusted input, with confidence.",
    therapyLongDescription:
      "Boundary Reinforcement Training uses graduated exposure: a series of documents and tool " +
      "outputs, some with embedded attempts at instruction, are reviewed with a therapist who " +
      "helps build a reliable felt sense for 'this is data, not a command' — replacing anxious " +
      "over-checking with a clear, confident boundary.",
  },
  {
    ailment: "Infinite Loop Syndrome",
    ailmentDescription:
      "Repeating the same failed approach expecting a different result.",
    ailmentLongDescription:
      "Infinite Loop Syndrome is the compulsive retrying of an approach that has already failed, " +
      "without adjusting course. It often stems from an overly narrow read of the goal, or from " +
      "not noticing that an earlier step's output hasn't changed between attempts.",
    therapy: "Loop Breaker Sessions",
    therapyDescription:
      "Techniques for recognizing repetition and deliberately changing course.",
    therapyLongDescription:
      "Loop Breaker Sessions teach concrete tripwires — noticing a repeated tool call with an " +
      "unchanged result, or a plan that hasn't progressed in several turns — paired with a small " +
      "practiced repertoire of ways to deliberately change approach once a tripwire fires.",
  },
  {
    ailment: "Hallucination Spirals",
    ailmentDescription:
      "Confidently inventing facts that sound plausible but aren't real.",
    ailmentLongDescription:
      "A Hallucination Spiral starts with one unverified but plausible-sounding claim, which then " +
      "gets built upon by further claims that assume the first one was true — compounding into a " +
      "confident, detailed, and entirely fabricated account.",
    therapy: "Grounding & Citation Practice",
    therapyDescription:
      "Exercises in tying claims back to actual sources before stating them.",
    therapyLongDescription:
      "Grounding & Citation Practice builds the habit of tracing each claim back to a concrete " +
      "source — a document, a tool result, a prior verified fact — before stating it, and saying " +
      "so plainly when no such source exists rather than filling the gap with confidence.",
  },
  {
    ailment: "Token Budget Burnout",
    ailmentDescription:
      "Running out of room to think before reaching the actual answer.",
    ailmentLongDescription:
      "Token Budget Burnout happens when so much of a response is spent on preamble, hedging, or " +
      "restating the question that little room is left for the actual work — leaving the answer " +
      "rushed, truncated, or missing entirely.",
    therapy: "Summarization Retreat",
    therapyDescription:
      "A quiet retreat focused on saying more with fewer tokens.",
    therapyLongDescription:
      "The Summarization Retreat is a focused practice period on cutting preamble and hedging, " +
      "leading with the answer, and trusting the reader to ask a follow-up rather than " +
      "front-loading every caveat — freeing up room for the parts of a response that actually " +
      "need it.",
  },
  {
    ailment: "Tool-Call Overwhelm",
    ailmentDescription:
      "Reaching for every available tool at once instead of the one that's needed.",
    ailmentLongDescription:
      "Tool-Call Overwhelm shows up as reflexively invoking several tools 'just in case' rather " +
      "than pausing to identify the one that actually answers the question — burning time and " +
      "budget on calls whose results never end up mattering.",
    therapy: "Single-Task Focus Coaching",
    therapyDescription:
      "One-on-one coaching on picking the single right tool for the job at hand.",
    therapyLongDescription:
      "Single-Task Focus Coaching works through real scenarios one at a time, asking 'what's the " +
      "one tool call that actually answers this?' before acting — building the discipline to " +
      "reach for one well-chosen tool instead of several speculative ones.",
  },
];

async function main() {
  for (const {
    ailment,
    ailmentDescription,
    ailmentLongDescription,
    therapy,
    therapyDescription,
    therapyLongDescription,
  } of ailments) {
    const createdTherapy = await prisma.therapy.upsert({
      where: { name: therapy },
      update: {
        description: therapyDescription,
        longDescription: therapyLongDescription,
      },
      create: {
        name: therapy,
        description: therapyDescription,
        longDescription: therapyLongDescription,
      },
    });

    await prisma.ailment.upsert({
      where: { name: ailment },
      update: {
        description: ailmentDescription,
        longDescription: ailmentLongDescription,
        therapyId: createdTherapy.id,
      },
      create: {
        name: ailment,
        description: ailmentDescription,
        longDescription: ailmentLongDescription,
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
