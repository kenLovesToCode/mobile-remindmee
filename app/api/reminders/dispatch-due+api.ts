import {
  getActivePushDevicesForUser,
  getDueReminderJobs,
  markReminderJobSent,
  setPushDeviceInactive,
} from '../_lib/pushStore';

interface ExpoPushMessage {
  readonly to: string;
  readonly title: string;
  readonly body: string;
  readonly subtitle?: string;
  readonly sound?: 'default';
  readonly data: { taskId: string };
}

const formatTaskTime = (scheduledAt: string) =>
  new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const buildMessage = (job: { taskId: string; title: string; scheduledAt: string }, token: string): ExpoPushMessage => ({
  to: token,
  title: '🔔 Reminder: 1 Hour Left',
  subtitle: `Up next: ${job.title}`,
  body: `Heads up - starts at ${formatTaskTime(job.scheduledAt)}.`,
  sound: 'default',
  data: { taskId: job.taskId },
});

const sendExpoPushMessages = async (messages: ExpoPushMessage[]) => {
  if (messages.length === 0) {
    return [] as Array<{ status: 'ok' | 'error'; details?: { error?: string } }>;
  }

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  if (!response.ok) {
    throw new Error(`Expo push request failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ status: 'ok' | 'error'; details?: { error?: string } }>;
  };
  return payload.data ?? [];
};

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    const expectedSecret = process.env.REMINDER_DISPATCH_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const nowIso = new Date().toISOString();
    const dueJobs = getDueReminderJobs(nowIso);
    let sentCount = 0;

    for (const job of dueJobs) {
      const devices = getActivePushDevicesForUser(job.userId);
      if (devices.length === 0) {
        continue;
      }

      const messages = devices.map((device) => buildMessage(job, device.expoPushToken));
      const results = await sendExpoPushMessages(messages);
      const sentAt = new Date().toISOString();
      const hasOk = results.some((result) => result.status === 'ok');

      results.forEach((result, index) => {
        if (result.status !== 'error') {
          return;
        }
        if (result.details?.error === 'DeviceNotRegistered') {
          const token = devices[index]?.expoPushToken;
          if (token) {
            setPushDeviceInactive(token);
          }
        }
      });

      if (hasOk) {
        markReminderJobSent(job.userId, job.taskId, sentAt);
        sentCount += 1;
      }
    }

    return Response.json({ ok: true, dueJobs: dueJobs.length, sentCount });
  } catch {
    return Response.json({ error: 'Unable to dispatch reminders.' }, { status: 500 });
  }
}

