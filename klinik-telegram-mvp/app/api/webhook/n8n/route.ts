export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return Response.json({ error: "N8N_WEBHOOK_URL belum dikonfigurasi." }, { status: 503 });

  try {
    const payload = await request.json();
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET ? { "x-kliniks-secret": process.env.N8N_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ source: "kliniks-portal", receivedAt: new Date().toISOString(), ...payload }),
    });
    if (!response.ok) throw new Error(`n8n status ${response.status}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("n8n webhook error", error);
    return Response.json({ error: "Webhook gagal dikirim." }, { status: 502 });
  }
}
