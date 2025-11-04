import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">StudyCenter Ai</h1>
        <p className="text-xs text-zinc-500">Unlimited chat with attachments and inline previews</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck size={14} />
        <span>Private per-visitor session</span>
      </div>
    </header>
  );
}
