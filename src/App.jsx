import React, { useState } from "react";

// Read API key from .env.local
const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("te"); // default Telugu
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setTranslated("");

    try {
      const bodyData = new URLSearchParams({
  text: text,
  source_language: "en",
  target_language: language,
});


      console.log("🔑 Using key:", RAPID_KEY?.slice(0, 6) + "*****");
      console.log("📤 Request body:", bodyData.toString());

      const res = await fetch("https://text-translator2.p.rapidapi.com/translate", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": 'YOUR_RAPID_API_KEY',
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
          "Accept-Encoding": "application/gzip", // ✅ Important!
        },
        body: bodyData,
      });

      const data = await res.json();
      console.log("📥 API Response:", JSON.stringify(data, null, 2));

      const out = data?.data?.translatedText || "";
      setTranslated(out);

      if (!out) {
        setError("⚠️ No translation returned. Check API key/quota/params.");
      }
    } catch (e) {
      console.error("❌ Fetch error:", e);
      setError("Translation failed. Check network or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">🌐 Text Translator</h1>

        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring mb-4"
          rows={4}
          placeholder="Type something in English…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring mb-4"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="it">Italian</option>
        </select>

        <button
          onClick={translateText}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Translating…" : "Translate"}
        </button>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        {translated && (
          <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
            <div className="text-sm font-semibold mb-1">Translated text:</div>
            <div>{translated}</div>
          </div>
        )}
      </div>
    </div>
  );
}
