import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative w-full bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/pDXeCthqjmzYX5Zk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">StudyCenter Ai</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-300">
          A futuristic study companion with real-time answers, attachments, and inline previews.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 text-xs text-zinc-300">
          <span className="px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20">Neuroscience</span>
          <span className="px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20">Futuristic</span>
          <span className="px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20">Educational</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      <div className="relative h-[380px] sm:h-[520px]" />
    </section>
  );
}
