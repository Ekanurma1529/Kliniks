import { askGemini } from "../../../../lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { message?: string };
    const message = body.message?.trim();
    if (!message || message.length > 1500) return Response.json({ error: "Pesan tidak valid." }, { status: 400 });
    return Response.json({ answer: await askGemini(message) });
  } catch (error) {
    console.error("Gemini chat error", error);
    return Response.json({ error: "Asisten AI sedang tidak tersedia. Silakan coba kembali." }, { status: 503 });
  }
}
