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
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        subscriptionRef.current = client.models.Todo.observeQuery({
          authMode: "userPool",
        }).subscribe({
          next: (data: any) => {
            const mappedTasks: Todo[] = data.items.map((item: any): Todo => ({
              id: item.id,
              content: item.content ?? null,
              createdAt: item.createdAt ?? new Date().toISOString(),
              updatedAt: item.updatedAt ?? new Date().toISOString(),
              owner: item.owner,
            }));
            
            const uniqueTasks = mappedTasks.reduce((acc: Todo[], todo) => {
              const existing = acc.find(t => t.id === todo.id);
              if (!existing) {
                acc.push(todo);
              }
              return acc;
            }, []);
            
            setTasks(uniqueTasks);
            setIsLoading(false);
          },
          error: (err: Error) => {
            console.error("Error fetching tasks:", err);
            setError(err);
            setIsError(true);
            setIsLoading(false);
          },
        });
      } catch (err) {
        console.error("Error setting up subscription:", err);
        setError(err as Error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchTasks();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const createTask = useCallback(async (content: string) => {
    setIsCreating(true);
    try {
      await client.models.Todo.create({
        content,
      } as any, {
        authMode: "userPool",
      });
      
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err as Error);
      setIsCreating(false);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, content: string) => {
    setIsUpdating(true);
    try {
      await client.models.Todo.update({
        id,
        content,
      } as any, {
        authMode: "userPool",
      });
      
      setIsUpdating(false);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err as Error);
      setIsUpdating(false);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await client.models.Todo.delete({ id } as any, {
        authMode: "userPool",
      });
      
      setIsDeleting(false);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err as Error);
      setIsDeleting(false);
      throw err;
    }
  }, []);

  return {
    tasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
