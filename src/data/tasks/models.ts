export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string | null;
  readonly priority: TaskPriority;
  readonly scheduledAt: string;
  readonly isCompleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
