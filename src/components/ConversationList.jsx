import { Plus, MessageSquare } from 'lucide-react'

export default function ConversationList({ conversations, currentId, onNew, onSelect }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNew}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 text-white py-2 text-sm hover:bg-black"
        >
          <Plus size={16} /> New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {conversations.length === 0 && (
          <div className="text-xs text-gray-500 p-3">No conversations yet</div>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
              currentId === c.id ? 'bg-gray-100' : ''
            }`}
          >
            <MessageSquare size={16} className="text-gray-500" />
            <span className="truncate text-sm text-gray-800">{c.title || 'Chat'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
