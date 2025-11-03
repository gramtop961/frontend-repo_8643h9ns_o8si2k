import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    setValue('')
    await onSend(text)
  }

  return (
    <form onSubmit={submit} className="border-t border-gray-200 p-3 bg-white/70 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
          placeholder="Message the assistant..."
          className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black disabled:opacity-50"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </form>
  )
}
