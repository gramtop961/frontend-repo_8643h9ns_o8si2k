import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-white flex items-center justify-center shadow-sm">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">StudyCenter Ai</h1>
          <p className="text-xs text-zinc-500">Unlimited chat with smart, helpful answers</p>
        </div>
      </div>
      <div className="text-xs text-zinc-500">
        Sessions are private to this browser. New visitors can’t see your chats.
      </div>
    </header>
  );
}
