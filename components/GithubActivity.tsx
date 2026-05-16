"use client";

import { useState, useEffect } from "react";
import { FiGithub, FiGitBranch, FiStar, FiAlertCircle } from "react-icons/fi";

interface GithubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string | null;
  updated_at: string;
}

export default function GithubActivity() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämta GitHub-användarnamn från .env.local
  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "hodhod22";

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6&type=all`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              `GitHub-användaren "${githubUsername}" hittades inte`,
            );
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          console.error("GitHub API returned non-array:", data);
          setRepos([]);
        }
      } catch (err) {
        console.error("Failed to fetch GitHub repos:", err);
        setError(
          err instanceof Error ? err.message : "Kunde inte hämta GitHub-repos",
        );
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    if (githubUsername) {
      fetchRepos();
    } else {
      setError("GitHub-användarnamn är inte konfigurerat");
      setLoading(false);
    }
  }, [githubUsername]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <FiGithub className="text-2xl animate-pulse text-blue-600" />
          <h3 className="text-xl font-semibold">GitHub aktivitet</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-200 dark:bg-slate-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <FiAlertCircle className="text-2xl text-yellow-500" />
          <h3 className="text-xl font-semibold">GitHub aktivitet</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            {error.includes("hittades inte")
              ? `GitHub-användaren "${githubUsername}" kunde inte hittas`
              : "Kunde inte ladda GitHub-repos"}
          </p>
          <p className="text-sm text-slate-400">
            💡 Kontrollera att användarnamnet är korrekt
          </p>
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <FiGithub className="text-2xl" />
          <h3 className="text-xl font-semibold">GitHub aktivitet</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">
            Inga repositories hittades för {githubUsername}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <FiGithub className="text-2xl" />
        <h3 className="text-xl font-semibold">GitHub aktivitet</h3>
        <span className="text-sm text-slate-500 ml-auto">
          @{githubUsername}
        </span>
      </div>
      <div className="space-y-4">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="flex-1">
                <h4 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {repo.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {repo.description || "Ingen beskrivning"}
                </p>
              </div>
              {repo.language && (
                <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-full">
                  {repo.language}
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FiStar className="w-3 h-3" /> {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <FiGitBranch className="w-3 h-3" /> {repo.forks_count}
              </span>
              <span className="text-slate-400">
                Uppdaterad:{" "}
                {new Date(repo.updated_at).toLocaleDateString("sv-SE")}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
