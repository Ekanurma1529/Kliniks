const TELEGRAM_API = "https://api.telegram.org";

export async function POST(request: Request) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) return Response.json({ ok: false }, { status: 401 });
  const update = await request.json() as { message?: { chat?: { id?: number }; text?: string } };
  const chatId = update.message?.chat?.id;
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return Response.json({ ok: true });
  const text = update.message?.text?.toLowerCase() ?? "";
  const reply = text.includes("janji")
    ? "Untuk membuat janji, kirim nama lengkap, tanggal pilihan, dan keluhan singkat Anda."
    : "Terima kasih telah menghubungi Klinik Sehat. Admin kami akan segera membantu Anda.";
  await fetch(`${TELEGRAM_API}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: reply }) });
  return Response.json({ ok: true });
}
