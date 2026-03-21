export const blogPosts = [
  {
    slug: "build-with-ai-notes",
    title: "Build with AI, not just prompts",
    description:
      "A practical introduction to using AI as a real creative and technical building partner.",
    date: "2026-03-20",
    category: "AI Development",
    readingTime: "6 min read",
    content: [
      "The difference between casually using AI and truly building with AI is structure. Once you move from random prompting to repeatable workflows, AI becomes a real creative and technical partner.",
      "Inside the course, students learn how to go from idea to interface quickly, then layer in better prompts, better tools, and better systems. The goal is not novelty. The goal is real output.",
      "That includes AI assisted development, agent workflows, OpenClaw orchestration, image generation, video generation, and the kind of automation that actually saves hours instead of creating more complexity.",
    ],
  },
  {
    slug: "openclaw-for-builders",
    title: "Why OpenClaw matters for modern builders",
    description:
      "A calm, practical view on agents, orchestration, and getting real work done with OpenClaw.",
    date: "2026-03-18",
    category: "OpenClaw",
    readingTime: "5 min read",
    content: [
      "OpenClaw becomes interesting the moment you stop seeing it as a chat toy and start using it as an orchestration layer. That is where the real leverage begins.",
      "For builders, the value sits in combining tools, memory, decision rules, and repeatable flows. You want the system to help shape concepts, do useful work, and stay aligned with your way of thinking.",
      "That is why this course focuses on practical, shippable setups. Not theory for theory’s sake, but systems you can actually use in your own work.",
    ],
  },
  {
    slug: "from-idea-to-shippable",
    title: "From idea to shippable product faster",
    description:
      "How visual thinking, short iterations, and AI tooling combine into a much faster product workflow.",
    date: "2026-03-15",
    category: "Workflow",
    readingTime: "7 min read",
    content: [
      "A lot of projects get stuck because people over plan too early. A better rhythm is to get something visible first, react to it, and then improve with intention.",
      "AI helps here by compressing the distance between idea, copy, design direction, implementation, and deployment. But only if you use it with judgment.",
      "The course teaches a visual first approach that turns rough thinking into a clearer flow, then into a working interface, then into something you can actually ship.",
    ],
  },
];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
