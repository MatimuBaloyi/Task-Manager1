export interface Task {
  id?: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
dueDate?: Date | string | null;
  isDeleted?: boolean;
}