// src/app/task.model.ts
export interface Task {
  id?: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  deleted?: boolean;
}