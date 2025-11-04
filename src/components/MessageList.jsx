import React, { useEffect, useRef } from 'react';
import AttachmentPreview from './AttachmentPreview.jsx';

export default function MessageList({ messages }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-zinc-500 text-sm pt-24">
          Ask anything to get started. Drag and drop files for inline previews.
        </div>
      )}
      {messages.map((m) => (
        <div key={m.id} className="flex gap-3">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {m.role === 'user' ? 'U' : 'AI'}
          </div>
          <div className="max-w-3xl">
            <div className="whitespace-pre-wrap text-sm text-zinc-800 leading-relaxed">{m.content}</div>
            {m.attachments && m.attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {m.attachments.map((a) => (
                  <AttachmentPreview key={a.id} attachment={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
