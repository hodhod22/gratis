import { Suspense } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import ProjectCard from "@/components/ProjectCard";
import CVButton from "@/components/CVButton";
import Stats from "@/components/Stats";
import WaitingTime from "@/components/WaitingTime";
import SocialProof from "@/components/SocialProof";
import { Doc } from "@/convex/_generated/dataModel";

export const metadata = {
  title: "Gratis Hemsida - FreeWebDev",
  description:
    "Få en gratis hemsida byggd av en erfaren webbutvecklare. Helt gratis, ingen kostnad. Perfekt för småföretag, privatpersoner och organisationer.",
};

export default async function Home() {
  const featuredProjects = await fetchQuery(api.projects.getFeatured);

  return (
    <>
      <Hero />

      <section className="container mx-auto px-4 -mt-8 mb-8 max-w-3xl">
        <WaitingTime />
      </section>

      <Stats />

      <SocialProof />

      <section className="text-center py-12 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <CVButton />
        </div>
      </section>

      <TechStack />

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Utvalda Projekt
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Några av mina bästa arbeten - se hela galleriet för mer
            </p>
          </div>
          {featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                Inga utvalda projekt ännu.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 3).map((project: Doc<"projects">) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <a href="/projects">
              <button className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                Se alla projekt →
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
