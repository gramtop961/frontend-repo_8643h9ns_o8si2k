import React from 'react';

export default function ConversationList({ conversations, activeId, onNewChat, onSelect }) {
  return (
    <aside className="w-full md:w-64 border-r border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-700">Conversations</h2>
        <button
          onClick={onNewChat}
          className="text-xs px-2 py-1 rounded-md bg-zinc-900 text-white hover:bg-zinc-800"
        >
          New Chat
        </button>
      </div>
      <ul className="px-2 pb-2 space-y-1 overflow-auto max-h-[calc(100vh-4rem)]">
        {conversations.length === 0 && (
          <li className="text-xs text-zinc-500 px-2 py-6 text-center">No conversations yet</li>
        )}
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-zinc-100 ${
                c.id === activeId ? 'bg-zinc-900 text-white hover:bg-zinc-900' : 'text-zinc-800'
              }`}
              title={c.title}
            >
              <div className="truncate">{c.title}</div>
              <div className={`text-xs truncate ${c.id === activeId ? 'text-zinc-300' : 'text-zinc-500'}`}>{c.preview}</div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
