import { useEffect, useMemo, useState } from 'react'
import ChatHeader from './components/ChatHeader'
import ConversationList from './components/ConversationList'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const hasConversation = useMemo(() => Boolean(currentId), [currentId])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/conversations`)
      const data = await res.json()
      setConversations(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return
    try {
      const res = await fetch(`${API_URL}/messages?conversation_id=${conversationId}`)
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      console.error(e)
    }
  }

  const ensureConversation = async () => {
    if (currentId) return currentId
    // Create a lightweight conversation immediately
    const res = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Chat' }),
    })
    const data = await res.json()
    setConversations((prev) => [{ id: data.id, title: data.title }, ...prev])
    setCurrentId(data.id)
    setMessages([])
    return data.id
  }

  const startNewChat = async () => {
    await ensureConversation()
  }

  const sendMessage = async (text, attachmentIds = []) => {
    setLoading(true)
    try {
      const convId = await ensureConversation()

      const optimisticUser = { id: `u-${Date.now()}`,
        conversation_id: convId,
        role: 'user',
        content: text || (attachmentIds.length ? '(sent attachments)' : ''),
        attachments: attachmentIds }
      setMessages((prev) => [...prev, optimisticUser])

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text || '', conversation_id: convId, attachments: attachmentIds }),
      })
      const data = await res.json()

      const assistant = data.reply
      setMessages((prev) => prev.map(m => m.id === optimisticUser.id ? { ...m, id: `${Date.now()}` } : m).concat(assistant))
    } catch (e) {
      console.error(e)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    fetchMessages(currentId)
  }, [currentId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="mx-auto max-w-7xl h-screen grid grid-rows-[auto,1fr]">
        <ChatHeader />

        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] h-full">
          <aside className="hidden md:block border-r border-gray-200 bg-white">
            <ConversationList
              conversations={conversations}
              currentId={currentId}
              onNew={startNewChat}
              onSelect={(id) => setCurrentId(id)}
            />
          </aside>

          <main className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 md:hidden">
              <button
                className="text-sm text-gray-600 underline"
                onClick={startNewChat}
              >
                New chat
              </button>
              <div className="text-xs text-gray-500">{hasConversation ? 'Conversation' : 'No conversation selected'}</div>
            </div>

            <MessageList messages={messages} apiUrl={API_URL} />
            <ChatInput onSend={sendMessage} disabled={loading} apiUrl={API_URL} conversationId={currentId} ensureConversation={ensureConversation} />
          </main>
        </div>
      </div>
    </div>
  )
}
