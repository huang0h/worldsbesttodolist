export interface Task {
  action: string;
  subtasks: Task[];
}

export interface TaskSection {
  sectionName: string;
  // tasks: Task[];
  content: string;
}

export const STORAGE_TASK_KEY = 'tasks';
