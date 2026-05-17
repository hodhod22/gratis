"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatAttachment } from "./Attachment";

export function useChatFileUpload() {
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);

  const uploadFile = async (file: File): Promise<ChatAttachment> => {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!result.ok) {
      throw new Error(`Upload failed: ${result.statusText}`);
    }
    const { storageId } = await result.json();
    return {
      name: file.name,
      storageId,
      size: file.size,
      type: file.type,
    };
  };

  const uploadFiles = async (files: File[]) => {
    const attachments: ChatAttachment[] = [];
    for (const file of files) {
      attachments.push(await uploadFile(file));
    }
    return attachments;
  };

  return { uploadFiles };
}
