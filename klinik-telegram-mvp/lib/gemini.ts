const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";

const SYSTEM_PROMPT = `Anda adalah Asisten Sehat Klinik Sehat. Jawab dalam Bahasa Indonesia yang ramah, singkat, dan mudah dipahami. Anda boleh membantu tentang layanan klinik, jadwal, antrean, pendaftaran, dan edukasi kesehatan umum. Jangan membuat diagnosis atau menggantikan dokter. Untuk gejala darurat seperti sesak berat, nyeri dada, penurunan kesadaran, perdarahan hebat, atau kejang, arahkan pasien segera ke IGD/119. Jangan meminta nomor BPJS lengkap, kata sandi, token, atau data rahasia.`;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
};

export async function askGemini(message: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY belum dikonfigurasi");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await fetch(`${GEMINI_API}/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
    }),
  });

  const data = await response.json() as GeminiResponse;
  if (!response.ok) throw new Error(data.error?.message || "Gemini tidak dapat merespons");
  const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!answer) throw new Error("Gemini memberikan respons kosong");
  return answer;
}
