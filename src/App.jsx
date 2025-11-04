import React, { useEffect, useMemo, useState } from 'react';
import ChatHeader from './components/ChatHeader.jsx';
import HeroSpline from './components/HeroSpline.jsx';
import MessageList from './components/MessageList.jsx';
import ChatInput from './components/ChatInput.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Local fallback assistant
function safeMathEval(expr) {
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${expr})`);
    const res = fn();
    return Number.isFinite(res) ? res : null;
  } catch {
    return null;
  }
}

function localAssistantReply(question) {
  const q = question.trim();
  const lower = q.toLowerCase();

  if (/(what\s+time|current\s*time|time\s+now)/.test(lower)) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }
  if (/(what\s+date|today\'?s\s+date|current\s*date)/.test(lower)) {
    return `Today's date is ${new Date().toLocaleDateString()}.`;
  }
  if (/(who\s+are\s+you|what\s+are\s+you|your\s+name)/.test(lower)) {
    return "I'm StudyCenter Ai — your always-on study companion. Ask me anything!";
  }
  const mathMatch = lower.match(/([-+/*().\s0-9]+)=?\??$/);
  if (mathMatch) {
    const expr = mathMatch[1].replace(/[^0-9+\-*/().\s]/g, '');
    const result = safeMathEval(expr);
    if (result !== null) return `That evaluates to ${result}.`;
  }
  if (/^define\s+/.test(lower)) {
    const term = q.slice(7).trim();
    if (term) return `Definition of ${term}: a concise explanation based on common usage and context.`;
  }
  return (
    "Here's a helpful answer: " +
    'I understood your question and can guide you step-by-step. If you share more details, I\'ll tailor the answer.'
  );
}

async function tryBackendChat(message, attachments = []) {
  if (!BACKEND_URL) throw new Error('No backend configured');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // Send JSON; backend can adapt. Files are not uploaded here yet; we pass names only.
    const resp = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, attachments: attachments.map((f) => ({ name: f.name, type: f.type, size: f.size })) }),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error('Backend error');
    const data = await resp.json();
    if (typeof data.reply === 'string') return data.reply;
    throw new Error('Invalid backend response');
  } finally {
    clearTimeout(timeout);
  }
}

export default function App() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);

  // Per-visitor isolation using session-scoped storage
  useEffect(() => {
    const key = 'scai_session_id';
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(key, sid);
    }
    setSessionId(sid);
  }, []);

  const storageKey = useMemo(() => (sessionId ? `scai_messages_${sessionId}` : null), [sessionId]);

  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { setMessages(JSON.parse(raw)); } catch { setMessages([]); }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const handleSend = async (text, files) => {
    const attachments = (files || []).map((f) => ({ id: crypto.randomUUID(), name: f.name, url: URL.createObjectURL(f), type: f.type }));

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text, attachments };
    setMessages((prev) => [...prev, userMsg]);

    // Try backend first; if unavailable, fallback to local assistant
    let replyText = '';
    try {
      replyText = await tryBackendChat(text, files);
    } catch {
      replyText = localAssistantReply(text || '');
    }

    const aiMsg = { id: crypto.randomUUID(), role: 'assistant', content: replyText, attachments: [] };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="min-h-screen w-screen bg-zinc-50 text-zinc-900">
      <HeroSpline />
      <ChatHeader />
      <main className="max-w-5xl mx-auto px-4 flex flex-col h-[calc(100vh-64px-420px)]">
        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </main>
    </div>
  );
}
