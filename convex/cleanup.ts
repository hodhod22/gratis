import { internalMutation } from "./_generated/server";

export const cleanupOldMessages = internalMutation({
  handler: async (ctx) => {
    const EXPIRY_HOURS = 24;
    const expiryTime = Date.now() - EXPIRY_HOURS * 60 * 60 * 1000;

    const oldMessages = await ctx.db
      .query("messages")
      .filter((q) => q.lt(q.field("createdAt"), expiryTime))
      .collect();

    let deletedCount = 0;
    let filesDeleted = 0;

    for (const message of oldMessages) {
      // Ta bort filer från Convex storage
      if (message.attachments && message.attachments.length > 0) {
        for (const file of message.attachments) {
          if (file.storageId) {
            await ctx.storage.delete(file.storageId);
            filesDeleted++;
          }
        }
      }
      await ctx.db.delete(message._id);
      deletedCount++;
    }

    console.log(
      `🧹 Rensade ${deletedCount} gamla meddelanden (${filesDeleted} filer från storage)`,
    );
    return { deletedCount, filesDeleted };
  },
});
