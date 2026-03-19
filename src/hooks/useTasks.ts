/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import type { Task, CreateTaskInput, TaskVersion, TaskStatus } from "../@types/task.types";

const client = generateClient<Schema>();

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const subscription = client.models.Task.observeQuery({
        authMode: "userPool",
      });
      
      return new Promise<Task[]>((resolve, reject) => {
        const items: Task[] = [];
        
        subscription.subscribe({
          next: (data: any) => {
            items.push(...data.items.map((item: any): Task => ({
              id: item.id,
              title: item.title,
              description: item.description ?? undefined,
              status: (item.status as TaskStatus) ?? "PENDIENTE",
              versions: Array.isArray(item.versions) ? item.versions as TaskVersion[] : [],
              createdAt: item.createdAt ?? new Date().toISOString(),
              updatedAt: item.updatedAt ?? new Date().toISOString(),
              owner: item.owner,
            })));
          },
          error: reject,
        });
        
        setTimeout(() => {
          resolve([...new Map(items.map((i) => [i.id, i])).values()]);
        }, 100);
      });
    },
    initialData: [],
    staleTime: 1000,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const now = new Date().toISOString();
      const firstVersion: TaskVersion = {
        id: crypto.randomUUID(),
        previousStatus: null,
        newStatus: "PENDIENTE",
        changedAt: now,
        changedBy: "system",
      };
      
      const result = await client.models.Task.create({
        title: input.title,
        description: input.description ?? null,
        status: "PENDIENTE",
        versions: [firstVersion],
        createdAt: now,
        updatedAt: now,
      } as any, {
        authMode: "userPool",
      });
      
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (input: { id: string; status?: TaskStatus; versions?: TaskVersion[]; title?: string; description?: string }) => {
      const updateData: any = {
        id: input.id,
        updatedAt: new Date().toISOString(),
      };
      
      if (input.status !== undefined) updateData.status = input.status;
      if (input.versions !== undefined) updateData.versions = input.versions;
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      
      const result = await client.models.Task.update(updateData, {
        authMode: "userPool",
      });
      
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await client.models.Task.delete({ id } as any, {
        authMode: "userPool",
      });
      
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(", "));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
