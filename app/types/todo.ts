import { Id } from "@/convex/_generated/dataModel";

export interface Todo {
  _id: Id<"todos">;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}
