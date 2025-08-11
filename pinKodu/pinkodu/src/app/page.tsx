import PinForm from "@/components/PinForm";

export default function Home() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* Nebula background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[42rem] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Bulutsu Mavilik PIN & Numeroloji
          </h1>
          <p className="text-blue-100/80 mt-2">Doğum tarihinle kişisel numerolojini ve 4 haneli PIN önerini keşfet.</p>
        </header>
        <PinForm />
        <p className="text-blue-100/60 text-xs text-center mt-6">Hesaplama eğlence amaçlıdır; güvenlik için PIN’ini başka servislerde tekrar kullanma.</p>
      </main>
    </div>
  );
}
