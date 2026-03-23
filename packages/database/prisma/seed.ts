import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../generated/client';

type Slide = { title: string; content: string; imageUrl?: string };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const curriculum = [
  {
    title: 'AI Foundations',
    description: 'Understand the core concepts behind modern AI systems and large language models.',
    order: 1,
    icon: '🎓',
    lessons: [
      {
        title: 'How Large Language Models Work',
        slug: 'how-llms-work',
        order: 1,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-1-1',
        content: `# How Large Language Models Work\n\nIn this lesson we explore the transformer architecture and how LLMs are trained on massive text corpora to develop emergent reasoning capabilities.\n\n## Key Concepts\n\n- Tokenization and embeddings\n- Attention mechanisms\n- Pre-training vs fine-tuning\n- Prompt engineering fundamentals`,
        duration: 22,
      },
      {
        title: 'Prompting Strategies That Actually Work',
        slug: 'prompting-strategies',
        order: 2,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-1-2',
        content: `# Prompting Strategies That Actually Work\n\nLearn proven techniques for crafting prompts that produce reliable, high-quality outputs from AI models.\n\n## Techniques Covered\n\n- Chain-of-thought prompting\n- Few-shot examples\n- Role and context setting\n- Output formatting instructions`,
        duration: 18,
      },
      {
        title: 'Choosing the Right Model for Your Use Case',
        slug: 'choosing-the-right-model',
        order: 3,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-1-3',
        content: `# Choosing the Right Model for Your Use Case\n\nNot all AI models are created equal. Learn how to evaluate models based on capability, cost, latency, and context window for your specific needs.\n\n## Decision Framework\n\n- Capability vs cost tradeoffs\n- Latency requirements\n- Context window considerations\n- Open-source vs proprietary models`,
        duration: 20,
      },
    ],
  },
  {
    title: 'Building with AI',
    description: 'Integrate AI into real applications using the Vercel AI SDK and modern tooling.',
    order: 2,
    icon: '🔧',
    lessons: [
      {
        title: 'Setting Up the Vercel AI SDK',
        slug: 'vercel-ai-sdk-setup',
        order: 1,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-2-1',
        content: `# Setting Up the Vercel AI SDK\n\nGet up and running with the Vercel AI SDK to build streaming AI applications in Next.js.\n\n## What We Build\n\n- Project scaffolding with Next.js\n- AI Gateway configuration\n- Your first streaming endpoint\n- useChat hook integration`,
        duration: 25,
      },
      {
        title: 'Building a Streaming Chat Interface',
        slug: 'streaming-chat-interface',
        order: 2,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-2-2',
        content: `# Building a Streaming Chat Interface\n\nBuild a production-grade chat UI with real-time streaming responses, message history, and a polished UI using shadcn/ui and AI Elements.\n\n## Topics\n\n- useChat hook patterns\n- Streaming response handling\n- Message rendering with AI Elements\n- Error and loading states`,
        duration: 30,
        slides: [
          {
            title: 'Wat is Streaming?',
            content: 'Server-Sent Events sturen tokens één voor één naar de client, zodat de gebruiker direct tekst ziet verschijnen.',
          },
          {
            title: 'De useChat Hook',
            content: 'useChat beheert berichten, status, en streaming automatisch. Je hoeft alleen een API endpoint op te geven.',
          },
          {
            title: 'Server-side: streamText',
            content: 'streamText() geeft een StreamResponse terug die je direct als Response kunt retourneren vanuit een Route Handler.',
          },
          {
            title: 'Best Practices',
            content: 'Gebruik altijd error boundaries rond chat components. Toon een loading state tijdens het streamen. Cache waar mogelijk.',
          },
        ] as Slide[],
      },
      {
        title: 'Tool Calling and Structured Outputs',
        slug: 'tool-calling-structured-outputs',
        order: 3,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-2-3',
        content: `# Tool Calling and Structured Outputs\n\nGive your AI the ability to take actions and return structured data with type-safe tool definitions.\n\n## Topics\n\n- Defining tools with inputSchema\n- Handling tool calls on the server\n- Structured outputs with Output.object()\n- Building an AI-powered form filler`,
        duration: 28,
      },
    ],
  },
  {
    title: 'Shipping AI Products',
    description: 'Take your AI application from prototype to production with auth, payments, and observability.',
    order: 3,
    icon: '🚀',
    lessons: [
      {
        title: 'Authentication and Access Control',
        slug: 'auth-and-access-control',
        order: 1,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-3-1',
        content: `# Authentication and Access Control\n\nSecure your AI application with Clerk and implement tier-based access control to protect premium features.\n\n## Topics\n\n- Clerk integration with Next.js\n- Protecting API routes\n- Tier-based feature flags\n- User metadata and roles`,
        duration: 24,
      },
      {
        title: 'Monetising with Stripe',
        slug: 'monetising-with-stripe',
        order: 2,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-3-2',
        content: `# Monetising with Stripe\n\nAdd subscription billing to your AI product using Stripe and the Vercel Marketplace integration.\n\n## Topics\n\n- Stripe product and price setup\n- Checkout session flow\n- Webhook handling\n- Gating features behind subscriptions`,
        duration: 32,
      },
      {
        title: 'Observability, Costs, and Scaling',
        slug: 'observability-costs-scaling',
        order: 3,
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-3-3',
        content: `# Observability, Costs, and Scaling\n\nMonitor your AI application in production, track token costs, and scale intelligently using Vercel Analytics and the AI Gateway.\n\n## Topics\n\n- Vercel Analytics and Speed Insights\n- AI Gateway cost tracking\n- Rate limiting strategies\n- Caching AI responses for cost reduction`,
        duration: 26,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  const course = await prisma.course.upsert({
    where: { slug: 'ai-builder-course' },
    update: { title: 'AI Development' },
    create: {
      title: 'AI Development',
      slug: 'ai-builder-course',
      description:
        'Learn to build, ship, and monetise AI-powered applications from scratch. ' +
        'Go from AI foundations to a fully deployed product in three focused modules.',
      imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
      price: 0,
      tier: 'FREE',
      published: true,
    },
  });

  console.log(`✅ Course created: ${course.title}`);

  for (const moduleData of curriculum) {
    const module = await prisma.module.upsert({
      where: {
        id: `seed-module-${moduleData.order}`,
      },
      update: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        icon: moduleData.icon,
      },
      create: {
        id: `seed-module-${moduleData.order}`,
        courseId: course.id,
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        icon: moduleData.icon,
      },
    });

    console.log(`  📦 Module ${moduleData.order}: ${module.title}`);

    for (const lessonData of moduleData.lessons) {
      const lesson = await prisma.lesson.upsert({
        where: {
          moduleId_slug: {
            moduleId: module.id,
            slug: lessonData.slug,
          },
        },
        update: {
          title: lessonData.title,
          order: lessonData.order,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          duration: lessonData.duration,
          slides: (lessonData as any).slides ?? undefined,
        },
        create: {
          moduleId: module.id,
          title: lessonData.title,
          slug: lessonData.slug,
          order: lessonData.order,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          duration: lessonData.duration,
          slides: (lessonData as any).slides ?? undefined,
        },
      });

      console.log(`    📖 Lesson ${lessonData.order}: ${lesson.title}`);
    }
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
