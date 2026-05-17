// app/admin/hooks/useRequests.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo, useCallback } from "react";

interface Request {
  _id: string;
  name: string;
  email: string;
  websiteType: string;
  description: string;
  requirements: string;
  deadline?: string;
  budget: string;
  status: string;
  priority: number;
  createdAt: number;
  updatedAt: number;
  adminNotes?: string;
  completedUrl?: string;
}

export function useRequests() {
  const requests = useQuery(api.admin.getAllRequests) || [];

  const updateStatus = useMutation(api.admin.updateRequestStatus);
  const updatePriority = useMutation(api.admin.updateRequestPriority);
  const deleteRequest = useMutation(api.admin.deleteRequest);
  const bulkUpdateMutation = useMutation(api.admin.bulkUpdateRequestStatus);

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      inProgress: requests.filter((r) => r.status === "in-progress").length,
      completed: requests.filter((r) => r.status === "completed").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests],
  );

  const getProgress = useCallback((request: Request) => {
    if (request.status !== "in-progress") return 0;

    const startDate = request.updatedAt;
    const now = Date.now();
    const daysSinceStart = Math.floor(
      (now - startDate) / (1000 * 60 * 60 * 24),
    );
    const typicalDays = 14;
    let progress = Math.min(
      95,
      Math.floor((daysSinceStart / typicalDays) * 100),
    );
    return Math.max(5, Math.min(95, progress));
  }, []);

  // Wrapper functions for correct types
  const handleUpdateStatus = useCallback(
    async (id: Id<"requests">, status: string) => {
      await updateStatus({ id, status });
    },
    [updateStatus],
  );

  const handleUpdatePriority = useCallback(
    async (id: Id<"requests">, priority: number) => {
      await updatePriority({ id, priority });
    },
    [updatePriority],
  );

  const handleDeleteRequest = useCallback(
    async (id: Id<"requests">) => {
      await deleteRequest({ id });
    },
    [deleteRequest],
  );

  // Fix: Bulk update wrapper med rätt argument
  const handleBulkUpdate = useCallback(
    async (ids: Id<"requests">[], status: string) => {
      await bulkUpdateMutation({ ids, status });
    },
    [bulkUpdateMutation],
  );

  return {
    requests,
    stats,
    updateStatus: handleUpdateStatus,
    updatePriority: handleUpdatePriority,
    deleteRequest: handleDeleteRequest,
    bulkUpdate: handleBulkUpdate,
    getProgress,
  };
}
