"use client";

import { useMemo, useState } from "react";
import { calculateFromIsoDate } from "@/lib/numerology";

export default function PinForm() {
  const [date, setDate] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => (date ? calculateFromIsoDate(date) : null), [date]);

  const copyPin = async () => {
    if (!result?.pin) return;
    try {
      await navigator.clipboard.writeText(result.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xl shadow-blue-900/20">
        <h2 className="text-xl font-semibold text-white tracking-tight">Doğum Tarihine Göre PIN ve Numeroloji</h2>
        <p className="text-sm text-blue-100/80 mt-1">
          4 haneli PIN: reduce(gün) + reduce(ay) + reduce(yıl) + reduce(Yaşam Yolu)
        </p>

        <div className="mt-5 grid gap-4">
          <label className="text-sm text-blue-100/90">Doğum Tarihi</label>
          <input
            type="date"
            className="h-11 rounded-lg bg-white/10 text-white placeholder-blue-100/60 border border-white/10 px-3 outline-none focus:ring-2 focus:ring-blue-400/60"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {result && (
          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-white/10 p-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-100/70">Önerilen PIN</div>
                <div className="text-3xl font-bold text-white mt-1">{result.pin}</div>
              </div>
              <button
                onClick={copyPin}
                className="h-10 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-400 transition-all"
              >
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Yaşam Yolu" value={String(result.lifePath)} />
              <Stat label="Gün" value={String(result.dayNum)} />
              <Stat label="Ay" value={String(result.monthNum)} />
              <Stat label="Yıl" value={String(result.yearNum)} />
              <Stat label="Kişisel Yıl" value={String(result.personalYear)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-white">
      <div className="text-xs text-blue-100/70">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}


