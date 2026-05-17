// scripts/add-projects.mjs
import { fetchMutation } from "convex/nextjs";
import { api } from "../convex/_generated/api.js";

const projects = [
  {
    title: "AI Image Generator",
    slug: "ai-image-generator",
    description:
      "Generera fantastiska bilder med AI. Användaren kan skriva en textbeskrivning och få en unik bild genererad.",
    longDescription:
      "En webbapplikation som använder OpenAI's DALL-E API för att generera bilder från textbeskrivningar.",
    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI API",
      "Tailwind CSS",
      "Convex",
    ],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1545235617-7a424c1a60e1?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod212/ai-image-generator",
    liveUrl: "https://ai-image-generator-demo.vercel.app",
    featured: true,
  },
  {
    title: "Weather Dashboard",
    slug: "weather-dashboard",
    description:
      "Väderapp med live-data, 7-dagars prognos och interaktiva kartor.",
    longDescription:
      "En modern väderapplikation som visar aktuellt väder, timprognos och 7-dagarsprognos för valfri stad.",
    technologies: [
      "React",
      "TypeScript",
      "OpenWeatherMap API",
      "Chart.js",
      "Tailwind CSS",
    ],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1592210454359-9043ad067b6b?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod22/weather-dashboard",
    liveUrl: "https://weather-dashboard-demo.vercel.app",
    featured: true,
  },
  {
    title: "Task Management API",
    slug: "task-management-api",
    description: "RESTful API för att hantera uppgifter, projekt och team.",
    longDescription:
      "En skalbar RESTful API byggd med Node.js och Express. Hanterar användarautentisering, uppgiftshantering, projekt och teamfunktioner.",
    technologies: [
      "Node.js",
      "Express",
      "TypeScript",
      "MongoDB",
      "JWT",
      "Swagger",
    ],
    category: "api",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod22/task-management-api",
    liveUrl: "https://task-api-demo.herokuapp.com/api-docs",
    featured: false,
  },
  {
    title: "Portfolio 2024",
    slug: "portfolio-2024",
    description:
      "Modern portfolio-webbplats med blogg, projektgalleri och dark mode.",
    longDescription:
      "Min personliga portfolio-webbplats byggd med Next.js och Tailwind CSS. Innehåller blogg, projektgalleri, dark mode och är fullt responsiv.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Convex",
    ],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod22/portfolio-2024",
    liveUrl: "https://hodhod22.dev",
    featured: true,
  },
  {
    title: "E-commerce Backend",
    slug: "ecommerce-backend",
    description:
      "Fullständig backend för en e-handelsplattform med Stripe integration.",
    longDescription:
      "En komplett backend-lösning för e-handel med produktkatalog, varukorg, beställningshantering och Stripe-betalningsintegration.",
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Stripe",
      "Redis",
    ],
    category: "api",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod22/ecommerce-backend",
    liveUrl: "https://ecommerce-api-demo.herokuapp.com",
    featured: false,
  },
  {
    title: "Real-time Chat Application",
    slug: "realtime-chat",
    description:
      "Chattapplikation med live-meddelanden, användare och grupper.",
    longDescription:
      "En realtidschattapplikation byggd med Socket.io. Användare kan skapa konton, gå med i rum, skicka privata meddelanden och se när andra skriver.",
    technologies: [
      "React",
      "Socket.io",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
    ],
    category: "webapp",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop",
    githubUrl: "https://github.com/hodhod22/realtime-chat",
    liveUrl: "https://chat-demo.vercel.app",
    featured: false,
  },
];

async function addAllProjects() {
  console.log(`📦 Lägger till ${projects.length} projekt...`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    try {
      await fetchMutation(api.projects.add, project);
      console.log(`✅ ${i + 1}/${projects.length}: ${project.title}`);
    } catch (error) {
      console.error(`❌ Misslyckades: ${project.title}`, error);
    }
  }

  console.log("🎉 Alla projekt är tillagda!");
}

addAllProjects();
