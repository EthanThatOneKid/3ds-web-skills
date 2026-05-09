const { Hono } = require('hono');

const app = new Hono();

app.post('/api/discord-webhook', async (c) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const username = process.env.DISCORD_WEBHOOK_USERNAME || '3DS Bot';

  if (!webhookUrl) {
    return c.json({ error: 'Missing DISCORD_WEBHOOK_URL environment variable.' }, 500);
  }

  let body;
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body.' }, 400);
  }

  const content = body && typeof body.content === 'string' ? body.content.replace(/^\s+|\s+$/g, '') : '';
  if (!content) {
    return c.json({ error: 'Message content is required.' }, 400);
  }

  const upstream = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      username,
      allowed_mentions: { parse: [] },
    }),
  });

  if (!upstream.ok && upstream.status !== 204) {
    const errorText = await upstream.text().catch(() => '');
    return c.json({
      error: 'Discord rejected the payload.',
      status: upstream.status,
      details: errorText.slice(0, 500),
    }, 502);
  }

  return c.json({
    ok: true,
    discordStatus: upstream.status,
  });
});

module.exports = app;
module.exports.default = app;
