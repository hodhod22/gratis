import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Kör rensning varje dag kl 03:00
crons.daily(
  "cleanup-old-files",
  { hourUTC: 3, minuteUTC: 0 }, // 03:00 UTC = 05:00 svensk tid (sommar) / 04:00 (vinter)
  internal.cleanup.cleanupOldMessages,
);

export default crons;
