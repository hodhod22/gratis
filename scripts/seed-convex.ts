// scripts/seed-convex.ts
import { fetchMutation } from "convex/nextjs";
import { api } from "../convex/_generated/api";

const DEMO_PROJECTS = [
  {
    title: "AI Task Manager",
    slug: "ai-task-manager",
    description:
      "Smart task management app with AI-powered prioritization and real-time collaboration.",
    longDescription:
      "A full-stack task management application that uses AI to automatically prioritize tasks based on urgency and importance. Features include real-time updates, team collaboration, and intelligent scheduling suggestions.",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Convex",
      "OpenAI API",
      "Tailwind CSS",
    ],
    category: "fullstack",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/yourusername/ai-task-manager",
    liveUrl: "https://ai-task-manager-demo.com",
    featured: true,
  },
  {
    title: "E-commerce Platform",
    slug: "ecommerce-platform",
    description:
      "Modern e-commerce platform with cart, checkout, and payment integration.",
    longDescription:
      "Complete e-commerce solution with product catalog, shopping cart, Stripe payment integration, order management, and admin dashboard.",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Stripe",
      "PostgreSQL",
      "Prisma",
    ],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.com",
    featured: true,
  },
  {
    title: "Real-time Dashboard",
    slug: "realtime-dashboard",
    description:
      "Analytics dashboard with live data updates and interactive charts.",
    longDescription:
      "Real-time analytics dashboard for monitoring business metrics. Features include live data streaming, interactive charts with Chart.js, user authentication, and customizable widgets.",
    technologies: ["Next.js", "Convex", "Chart.js", "Tailwind CSS", "Clerk"],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/yourusername/realtime-dashboard",
    liveUrl: "https://dashboard-demo.com",
    featured: true,
  },
  {
    title: "Mobile Fitness App API",
    slug: "fitness-app-api",
    description:
      "RESTful API backend for a fitness tracking mobile application.",
    longDescription:
      "Scalable backend API for fitness app with user authentication, workout tracking, progress monitoring, and social features.",
    technologies: ["Node.js", "Express", "TypeScript", "MongoDB", "JWT"],
    category: "api",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/yourusername/fitness-api",
    liveUrl: "https://api-demo.fitnessapp.com/docs",
    featured: false,
  },
  {
    title: "Portfolio Website Template",
    slug: "portfolio-template",
    description: "Modern portfolio template for developers and creatives.",
    longDescription:
      "A customizable portfolio template built with Next.js and Tailwind CSS. Features include blog system, project gallery, dark mode, and responsive design out of the box.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/yourusername/portfolio-template",
    liveUrl: "https://portfolio-template-demo.com",
    featured: false,
  },
];

const DEMO_BLOGS = [
  {
    title: "Why Next.js 15 is a Game Changer for Frontend Development",
    slug: "why-nextjs-15-game-changer",
    excerpt:
      "The new features in Next.js 15 including Turbopack, Server Actions, and improved performance make it the best framework for modern web apps.",
    content: `# Why Next.js 15 is a Game Changer

Next.js 15 has arrived with groundbreaking features that every frontend developer should know about.

## 🚀 Turbopack (Stable)

The biggest news is that Turbopack is now stable for development. This Rust-based bundler is **700x faster** than Webpack and **10x faster** than Vite for large applications.

\`\`\`bash
next dev --turbo
\`\`\`

## ⚡ Server Actions (Stable)

Server Actions allow you to mutate data directly from client components without creating API routes.

\`\`\`typescript
// app/actions.ts
'use server'
 
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  await db.post.create({ data: { title } })
}
\`\`\`

## 🎯 What This Means for Developers

If you haven't tried Next.js 15 yet, now is the perfect time to start!`,
    category: "Next.js",
    tags: ["Next.js", "React", "Performance", "Turbopack"],
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    isPublished: true,
  },
  {
    title: "Mastering TypeScript: Advanced Patterns You Should Know",
    slug: "mastering-typescript-advanced-patterns",
    excerpt:
      "Take your TypeScript skills to the next level with these advanced patterns: conditional types, mapped types, and type guards.",
    content: `# Mastering TypeScript: Advanced Patterns

TypeScript has become the standard for modern web development.

## 🔧 Conditional Types

Conditional types allow you to create types that depend on other types.

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>;  // true
type B = IsArray<number>;     // false
\`\`\`

## 🛡️ Type Guards

Create custom type guards for complex type checking.

\`\`\`typescript
interface Cat { meow: () => void }
interface Dog { bark: () => void }

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}
\`\`\`

Master these patterns and your TypeScript code will be more robust!`,
    category: "TypeScript",
    tags: ["TypeScript", "Advanced", "Best Practices"],
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    isPublished: true,
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Lägg till projekt
    console.log("📦 Adding projects...");
    for (const project of DEMO_PROJECTS) {
      await fetchMutation(api.projects.add, project);
      console.log(`✅ Added project: ${project.title}`);
    }

    // Lägg till bloggar
    console.log("📝 Adding blogs...");
    for (const blog of DEMO_BLOGS) {
      await fetchMutation(api.blog.add, blog);
      console.log(`✅ Added blog: ${blog.title}`);
    }

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed();
