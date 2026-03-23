import { useState, useEffect, useCallback, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type Task = Schema["Todo"]["type"];
export type CreateTaskInput = Schema["Todo"]["createType"];
export type UpdateTaskInput = Schema["Todo"]["updateType"];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const subscriptionRef = useRef<ReturnType<ReturnType<typeof client.models.Todo.observeQuery>["subscribe"]> | null>(null);

  useEffect(() => {
    const observable = client.models.Todo.observeQuery({ authMode: "userPool" });
    
    subscriptionRef.current = observable.subscribe({
      next: ({ items }) => {
        setTasks(items.map((item): Task => ({
          id: item.id,
          content: item.content,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          owner: item.owner,
        })));
        setIsLoading(false);
      },
      error: (err) => {
        console.error("Error fetching tasks:", err);
        setError(err);
        setIsLoading(false);
      },
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    setIsCreating(true);
    try {
      await client.models.Todo.create(input, { authMode: "userPool" });
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { tasks, isLoading, error, createTask, isCreating };
};
