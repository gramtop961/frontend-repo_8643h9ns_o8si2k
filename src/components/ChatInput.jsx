import { useState } from 'react'
import { Send, Paperclip, X } from 'lucide-react'

export default function ChatInput({ onSend, disabled, apiUrl, conversationId, ensureConversation }) {
  const [value, setValue] = useState('')
  const [uploads, setUploads] = useState([]) // {id, filename, size, content_type}
  const [uploading, setUploading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const text = value.trim()
    if (!text && uploads.length === 0) return
    setValue('')
    const attachmentIds = uploads.map(u => u.id)
    setUploads([])
    await onSend(text, attachmentIds)
  }

  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      // Ensure a conversation exists before uploading attachments
      const convId = await ensureConversation()

      const uploaded = []
      for (const file of files) {
        const form = new FormData()
        form.append('file', file)
        form.append('conversation_id', convId)
        const res = await fetch(`${apiUrl}/attachments`, { method: 'POST', body: form })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        uploaded.push({ id: data.id, filename: data.filename, size: data.size, content_type: data.content_type })
      }
      setUploads(prev => [...prev, ...uploaded])
    } catch (err) {
      console.error(err)
      alert('Failed to upload attachment(s).')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeUpload = (id) => setUploads(prev => prev.filter(u => u.id !== id))

  return (
    <form onSubmit={submit} className="border-t border-gray-200 p-3 bg-white/70 backdrop-blur-md">
      {uploads.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {uploads.map(u => (
            <span key={u.id} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md border border-gray-300 bg-white">
              <span className="truncate max-w-[160px]" title={u.filename}>{u.filename}</span>
              <button type="button" onClick={() => removeUpload(u.id)} className="text-gray-500 hover:text-gray-900">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <label className={`inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-2 hover:bg-gray-50 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <Paperclip size={16} className="text-gray-700" />
          <input type="file" multiple className="hidden" onChange={onPickFiles} />
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
          placeholder={uploading ? 'Uploading attachments...' : 'Message the assistant...'}
          className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <button
          type="submit"
          disabled={disabled || uploading}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black disabled:opacity-50"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </form>
  )
}
