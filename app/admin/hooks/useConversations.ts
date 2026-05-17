// app/admin/hooks/useConversations.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback } from "react";

export function useConversations() {
  const activeConversations = useQuery(api.admin.getActiveConversations) || [];
  const closedConversations = useQuery(api.admin.getClosedConversations) || [];

  const sendReply = useMutation(api.chat.sendAdminReply);
  const markAsRead = useMutation(api.admin.markMessagesAsRead);
  const closeConversation = useMutation(api.admin.closeConversation);
  const openConversation = useMutation(api.admin.openConversation);

  const totalUnread = activeConversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );

  const handleMarkAsRead = useCallback(
    async (email: string) => {
      await markAsRead({ email });
    },
    [markAsRead],
  );

  const handleClose = useCallback(
    async (email: string) => {
      await closeConversation({ email });
    },
    [closeConversation],
  );

  const handleOpen = useCallback(
    async (email: string) => {
      await openConversation({ email });
    },
    [openConversation],
  );

  // Fix: Korrekt signatur för sendMessage
  const handleSendMessage = useCallback(
    async (
      email: string,
      name: string,
      message: string,
      attachments: any[],
    ) => {
      await sendReply({
        toEmail: email,
        toName: name,
        message: message,
        attachments: attachments,
      });
    },
    [sendReply],
  );

  return {
    activeConversations,
    closedConversations,
    totalUnread,
    sendMessage: handleSendMessage,
    markAsRead: handleMarkAsRead,
    closeConversation: handleClose,
    openConversation: handleOpen,
  };
}
