"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function GlobalSound() {
  const { isSignedIn, user } = useUser();
  const [lastUnreadCount, setLastUnreadCount] = useState(0);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [playedTimestamps, setPlayedTimestamps] = useState<Map<string, number>>(
    new Map(),
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Hämta konversationer och meddelanden
  const activeConversations = useQuery(api.admin.getActiveConversations) || [];
  const totalUnread = activeConversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );

  // Hämta kundens egna meddelanden (för ljud när admin svarar)
  const customerMessages = useQuery(
    api.chat.getMessagesByEmail,
    !isAdmin && userEmail ? { email: userEmail } : "skip",
  );

  // Förbered ljudobjekt
  useEffect(() => {
    audioRef.current = new Audio("/sound2.mp3");
    audioRef.current.volume = 0.4;
  }, []);

  // ADMIN: Ljud vid nya meddelanden från kunder (oavsett sida)
  useEffect(() => {
    if (!isAdmin || !audioRef.current) return;

    if (totalUnread > lastUnreadCount && totalUnread > 0) {
      // Kolla om vi spelat ljud för denna kund inom 15 minuter
      const now = Date.now();
      const FIFTEEN_MINUTES = 15 * 60 * 1000;

      // Hitta vilken kund som skickade nytt meddelande
      for (const conv of activeConversations) {
        if (conv.unreadCount > 0) {
          const lastPlayed = playedTimestamps.get(conv.email) || 0;
          if (now - lastPlayed > FIFTEEN_MINUTES) {
            // Spela ljud
            audioRef.current
              .play()
              .catch((e) => console.log("Audio play failed:", e));
            console.log(
              `🔔 Ljud för admin - nytt meddelande från ${conv.name}`,
            );
            setPlayedTimestamps((prev) => new Map(prev).set(conv.email, now));
            break;
          }
        }
      }
    }

    setLastUnreadCount(totalUnread);
  }, [
    isAdmin,
    totalUnread,
    lastUnreadCount,
    activeConversations,
    playedTimestamps,
  ]);

  // KUND: Ljud när admin svarar (för varje meddelande)
  useEffect(() => {
    if (isAdmin || !customerMessages || !audioRef.current) return;

    const currentMessageCount = customerMessages.length;

    if (currentMessageCount > lastMessageCount) {
      // Kolla om det senaste meddelandet är från admin
      const lastMessage = customerMessages[customerMessages.length - 1];
      if (lastMessage && lastMessage.isFromAdmin) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
        console.log("🔔 Ljud för kund - nytt svar från admin");
      }
    }

    setLastMessageCount(currentMessageCount);
  }, [isAdmin, customerMessages, lastMessageCount]);

  return null;
}
