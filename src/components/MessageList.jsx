import AttachmentPreview from './AttachmentPreview'

export default function MessageList({ messages, apiUrl }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 text-sm pt-16">
          Start chatting — ask anything.
        </div>
      )}
      {messages.map((m) => (
        <div key={m.id}
          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[70%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-gray-900 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}
          >
            {m.content}
            {Array.isArray(m.attachments) && m.attachments.length > 0 && (
              <div className={`mt-2 grid gap-2 ${m.role === 'user' ? 'text-white/90' : 'text-gray-700'}`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                {m.attachments.map((attId) => (
                  <AttachmentPreview key={attId} id={attId} apiUrl={apiUrl} isUser={m.role === 'user'} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
