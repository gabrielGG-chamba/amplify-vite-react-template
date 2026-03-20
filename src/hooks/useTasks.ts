/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface Todo {
  id: string;
  content: string | null;
  createdAt?: string;
  updatedAt?: string;
  owner?: string | null;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const observable = client.models.Todo.observeQuery({ authMode: "userPool" });
    
    subscriptionRef.current = observable.subscribe({
      next: ({ items }: any) => {
        setTasks(items.map((item: any): Todo => ({
          id: item.id,
          content: item.content,
          createdAt: item.createdAt ?? new Date().toISOString(),
          updatedAt: item.updatedAt ?? new Date().toISOString(),
          owner: item.owner,
        })));
        setIsLoading(false);
      },
      error: (err: Error) => {
        console.error("Error fetching tasks:", err);
        setError(err);
        setIsLoading(false);
      },
    });

    return () => subscriptionRef.current?.unsubscribe();
  }, []);

  const createTask = useCallback(async (content: string) => {
    setIsCreating(true);
    try {
      await client.models.Todo.create({ content } as any, { authMode: "userPool" });
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { tasks, isLoading, error, createTask, isCreating };
};
