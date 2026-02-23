import { upsertPushDevice } from '../_lib/pushStore';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: unknown;
      expoPushToken?: unknown;
      platform?: unknown;
      deviceId?: unknown;
    };

    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const expoPushToken = typeof body.expoPushToken === 'string' ? body.expoPushToken.trim() : '';
    if (!userId || !expoPushToken) {
      return Response.json({ error: 'Missing userId or expoPushToken.' }, { status: 400 });
    }

    const device = upsertPushDevice({
      userId,
      expoPushToken,
      platform: typeof body.platform === 'string' ? body.platform : undefined,
      deviceId: typeof body.deviceId === 'string' ? body.deviceId : null,
    });

    return Response.json({ ok: true, device });
  } catch {
    return Response.json({ error: 'Unable to register push token.' }, { status: 500 });
  }
}

