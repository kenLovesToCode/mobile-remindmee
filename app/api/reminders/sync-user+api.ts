import { syncReminderJobsForUser } from '../_lib/pushStore';

interface IncomingReminderTask {
  readonly taskId: string;
  readonly title: string;
  readonly scheduledAt: string;
  readonly notifyAt: string;
  readonly updatedAt: string;
  readonly isCompleted: boolean;
}

const isReminderTask = (value: unknown): value is IncomingReminderTask => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.taskId === 'string' &&
    typeof record.title === 'string' &&
    typeof record.scheduledAt === 'string' &&
    typeof record.notifyAt === 'string' &&
    typeof record.updatedAt === 'string' &&
    typeof record.isCompleted === 'boolean'
  );
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: unknown; tasks?: unknown };
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    if (!userId) {
      return Response.json({ error: 'Missing userId.' }, { status: 400 });
    }

    if (!Array.isArray(body.tasks) || !body.tasks.every(isReminderTask)) {
      return Response.json({ error: 'Invalid tasks payload.' }, { status: 400 });
    }

    const jobs = syncReminderJobsForUser(userId, body.tasks);
    return Response.json({ ok: true, pendingJobs: jobs.filter((job) => job.status === 'pending').length });
  } catch {
    return Response.json({ error: 'Unable to sync reminders.' }, { status: 500 });
  }
}

