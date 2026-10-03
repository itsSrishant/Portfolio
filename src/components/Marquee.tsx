export default function Marquee() {
  return (
    <div className="relative w-full overflow-hidden bg-accent-2 text-bg py-4 border-y-4 border-bg my-8 transform -rotate-1 scale-105 z-20 shadow-[0_0_50px_rgba(255,122,0,0.2)]">
      <div className="flex whitespace-nowrap animate-[marquee_15s_linear_infinite] font-black text-xl sm:text-2xl tracking-[0.2em] uppercase">
        <span className="shrink-0 flex items-center">
          <span className="mx-6">///</span> AI ENGINEERING <span className="mx-6">///</span> RAG SYSTEMS <span className="mx-6">///</span> SCALABLE ARCHITECTURE <span className="mx-6">///</span> INTELLIGENT AGENTS
        </span>
        <span className="shrink-0 flex items-center">
          <span className="mx-6">///</span> AI ENGINEERING <span className="mx-6">///</span> RAG SYSTEMS <span className="mx-6">///</span> SCALABLE ARCHITECTURE <span className="mx-6">///</span> INTELLIGENT AGENTS
        </span>
        <span className="shrink-0 flex items-center">
          <span className="mx-6">///</span> AI ENGINEERING <span className="mx-6">///</span> RAG SYSTEMS <span className="mx-6">///</span> SCALABLE ARCHITECTURE <span className="mx-6">///</span> INTELLIGENT AGENTS
        </span>
      </div>
    </div>
  );
}
