"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FiFile } from "react-icons/fi";

export type ChatAttachment = {
  name: string;
  storageId: Id<"_storage">;
  size: number;
  type: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Attachment({ file }: { file: ChatAttachment }) {
  const fileUrl = useQuery(api.chat.getImageUrl, { storageId: file.storageId });

  if (fileUrl === undefined) {
    return <div className="text-xs text-slate-400">Laddar fil...</div>;
  }

  if (!fileUrl) {
    return <div className="text-xs text-red-400">Kunde inte ladda fil</div>;
  }

  if (file.type.startsWith("image/")) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={fileUrl}
          alt={file.name}
          className="max-w-full rounded max-h-32"
        />
      </a>
    );
  }

  if (file.type.startsWith("video/")) {
    return (
      <video src={fileUrl} controls className="max-w-full rounded max-h-32" />
    );
  }

  return (
    <a
      href={fileUrl}
      download={file.name}
      className="flex items-center gap-1 text-xs underline break-all"
    >
      <FiFile className="w-3 h-3 shrink-0" />
      <span className="break-all">{file.name}</span>
      <span className="text-slate-400">({formatFileSize(file.size)})</span>
    </a>
  );
}
