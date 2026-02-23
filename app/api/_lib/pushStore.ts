type PlatformName = 'ios' | 'android' | 'web' | 'unknown';

export interface PushDevice {
  readonly userId: string;
  readonly expoPushToken: string;
  readonly platform: PlatformName;
  readonly deviceId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isActive: boolean;
}

export interface ReminderJob {
  readonly userId: string;
  readonly taskId: string;
  readonly title: string;
  readonly scheduledAt: string;
  readonly notifyAt: string;
  readonly versionTs: string;
  readonly status: 'pending' | 'sent' | 'canceled';
  readonly sentAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PushStoreState {
  readonly devices: Record<string, PushDevice[]>;
  readonly jobs: Record<string, ReminderJob>;
}

declare global {
  var __remindMeePushStore: PushStoreState | undefined;
}

const getInitialState = (): PushStoreState => ({
  devices: {},
  jobs: {},
});

export const getPushStore = () => {
  if (!globalThis.__remindMeePushStore) {
    globalThis.__remindMeePushStore = getInitialState();
  }
  return globalThis.__remindMeePushStore;
};

export const upsertPushDevice = (input: {
  readonly userId: string;
  readonly expoPushToken: string;
  readonly platform?: string;
  readonly deviceId?: string | null;
}) => {
  const store = getPushStore();
  const now = new Date().toISOString();
  const list = store.devices[input.userId] ?? [];
  const platform = (input.platform ?? 'unknown') as PlatformName;
  const existingIndex = list.findIndex((device) => device.expoPushToken === input.expoPushToken);
  const next: PushDevice = {
    userId: input.userId,
    expoPushToken: input.expoPushToken,
    platform,
    deviceId: input.deviceId ?? null,
    createdAt: existingIndex >= 0 ? list[existingIndex].createdAt : now,
    updatedAt: now,
    isActive: true,
  };
  const nextList = existingIndex >= 0 ? [...list] : [...list, next];
  if (existingIndex >= 0) {
    nextList[existingIndex] = next;
  }
  store.devices[input.userId] = nextList;
  return next;
};

export const setPushDeviceInactive = (expoPushToken: string) => {
  const store = getPushStore();
  const now = new Date().toISOString();
  for (const userId of Object.keys(store.devices)) {
    store.devices[userId] = store.devices[userId].map((device) =>
      device.expoPushToken === expoPushToken ? { ...device, isActive: false, updatedAt: now } : device,
    );
  }
};

export const syncReminderJobsForUser = (
  userId: string,
  tasks: Array<{
    taskId: string;
    title: string;
    scheduledAt: string;
    notifyAt: string;
    updatedAt: string;
    isCompleted: boolean;
  }>,
) => {
  const store = getPushStore();
  const now = new Date().toISOString();
  const taskIds = new Set(tasks.map((task) => task.taskId));

  for (const [jobKey, job] of Object.entries(store.jobs)) {
    if (job.userId !== userId) {
      continue;
    }
    if (!taskIds.has(job.taskId) && job.status === 'pending') {
      store.jobs[jobKey] = { ...job, status: 'canceled', updatedAt: now };
    }
  }

  for (const task of tasks) {
    const key = `${userId}:${task.taskId}`;
    const existing = store.jobs[key];
    if (task.isCompleted) {
      if (existing && existing.status === 'pending') {
        store.jobs[key] = { ...existing, status: 'canceled', updatedAt: now };
      }
      continue;
    }

    const isFutureTask = new Date(task.scheduledAt).getTime() > Date.now();
    if (!isFutureTask) {
      if (existing && existing.status === 'pending') {
        store.jobs[key] = { ...existing, status: 'canceled', updatedAt: now };
      }
      continue;
    }

    const shouldReplace =
      !existing ||
      existing.versionTs !== task.updatedAt ||
      existing.notifyAt !== task.notifyAt ||
      existing.status !== 'pending';

    if (!shouldReplace) {
      continue;
    }

    store.jobs[key] = {
      userId,
      taskId: task.taskId,
      title: task.title,
      scheduledAt: task.scheduledAt,
      notifyAt: task.notifyAt,
      versionTs: task.updatedAt,
      status: 'pending',
      sentAt: null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
  }

  return Object.values(store.jobs).filter((job) => job.userId === userId);
};

export const getDueReminderJobs = (nowIso: string) => {
  const nowMs = new Date(nowIso).getTime();
  return Object.values(getPushStore().jobs).filter((job) => {
    if (job.status !== 'pending') {
      return false;
    }
    const notifyAtMs = new Date(job.notifyAt).getTime();
    const scheduledAtMs = new Date(job.scheduledAt).getTime();
    return notifyAtMs <= nowMs && scheduledAtMs > nowMs;
  });
};

export const markReminderJobSent = (userId: string, taskId: string, sentAt: string) => {
  const store = getPushStore();
  const key = `${userId}:${taskId}`;
  const existing = store.jobs[key];
  if (!existing) {
    return;
  }
  store.jobs[key] = { ...existing, status: 'sent', sentAt, updatedAt: sentAt };
};

export const getActivePushDevicesForUser = (userId: string) =>
  (getPushStore().devices[userId] ?? []).filter((device) => device.isActive);

