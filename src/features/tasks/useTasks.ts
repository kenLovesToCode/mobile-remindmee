import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { initializeAuthDb } from '../../data/auth/db';
import { getTasksByUserId, getUpcomingTasksByUserId } from '../../data/tasks/repository';
import { Task } from '../../data/tasks/models';

export interface TaskSection {
  readonly title: string;
  readonly countLabel: string;
  readonly accent: 'danger' | 'primary';
  readonly tasks: Task[];
}

export interface TaskStats {
  readonly today: number;
  readonly scheduled: number;
  readonly done: number;
}

export type TaskStatus = 'idle' | 'loading' | 'error' | 'empty';

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcoming, setUpcoming] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setUpcoming([]);
      setStatus('empty');
      return;
    }
    setStatus('loading');
    setError(undefined);
    try {
      await initializeAuthDb();
      const [allTasks, upcomingTasks] = await Promise.all([
        getTasksByUserId(userId),
        getUpcomingTasksByUserId(userId, 5),
      ]);
      setTasks(allTasks);
      setUpcoming(upcomingTasks);
      setStatus(allTasks.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to load tasks.');
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      return undefined;
    }, [refresh]),
  );

  const sections = useMemo<TaskSection[]>(() => {
    if (tasks.length === 0) {
      return [];
    }
    const now = new Date();
    const overdue = tasks.filter((task) => {
      if (task.isCompleted) {
        return false;
      }
      const scheduled = new Date(task.scheduledAt);
      return scheduled.getTime() < now.getTime() && !isSameDay(scheduled, now);
    });
    const today = tasks.filter((task) => {
      if (task.isCompleted) {
        return false;
      }
      const scheduled = new Date(task.scheduledAt);
      return isSameDay(scheduled, now);
    });
    const sectionsList: TaskSection[] = [];
    if (overdue.length > 0) {
      sectionsList.push({
        title: 'Overdue',
        countLabel: `${overdue.length} task${overdue.length === 1 ? '' : 's'}`,
        accent: 'danger',
        tasks: overdue,
      });
    }
    if (today.length > 0) {
      sectionsList.push({
        title: 'Today',
        countLabel: `${today.length} task${today.length === 1 ? '' : 's'}`,
        accent: 'primary',
        tasks: today,
      });
    }
    return sectionsList;
  }, [tasks]);

  const upcomingTasks = useMemo<Task[]>(() => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.isCompleted) {
        return false;
      }
      const scheduled = new Date(task.scheduledAt);
      return scheduled.getTime() >= now.getTime() && !isSameDay(scheduled, now);
    });
  }, [tasks]);

  const stats = useMemo<TaskStats>(() => {
    const now = new Date();
    const todayCount = tasks.filter((task) => isSameDay(new Date(task.scheduledAt), now)).length;
    const doneCount = tasks.filter((task) => task.isCompleted).length;
    const scheduledCount = tasks.filter((task) => !task.isCompleted).length;
    return {
      today: todayCount,
      scheduled: scheduledCount,
      done: doneCount,
    };
  }, [tasks]);

  return {
    tasks,
    upcoming,
    upcomingTasks,
    sections,
    stats,
    status,
    error,
    refresh,
  } as const;
};
