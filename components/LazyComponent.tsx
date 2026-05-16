"use client";

import { lazy, Suspense } from "react";
import { FiLoader } from "react-icons/fi";

// Lazy load tunga komponenter
export const LazyGithubActivity = lazy(() => import("./GithubActivity"));
export const LazyTestimonials = lazy(() => import("./Testimonials"));
export const LazyPerformanceScore = lazy(() => import("./PerformanceScore"));

// Loading fallback
export function LoadingFallback() {
  return (
    <div className="flex justify-center items-center py-12">
      <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}
