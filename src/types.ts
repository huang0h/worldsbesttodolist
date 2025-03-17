export interface Task {
  action: string;
  subtasks: Task[];
}

export interface TaskSection {
  sectionName: string;
  // tasks: Task[];
  content: string;
  borderColor: string;
}

export const STORAGE_TASK_KEY = 'tasks';
export const SETTINGS_KEY = 'settings';
