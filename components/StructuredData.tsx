"use client";

import React from "react";

interface StructuredDataProps {
  type: "Organization" | "Person" | "WebSite" | "Service";
  data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}
