import React, { useEffect, useMemo, useState } from 'react';
import ChatHeader from './components/ChatHeader.jsx';
import ConversationList from './components/ConversationList.jsx';
import MessageList from './components/MessageList.jsx';
import ChatInput from './components/ChatInput.jsx';

// Simple, local assistant logic to provide helpful answers without backend
function safeMathEval(expr) {
  // Allow only digits, operators, parentheses, dots, and spaces
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${expr})`);
    const res = fn();
    if (typeof res === 'number' && Number.isFinite(res)) return res;
    return null;
  } catch {
    return null;
  }
}

function localAssistantReply(question) {
  const q = question.trim();
  const lower = q.toLowerCase();

  // Time & date
  if (/(what\s+time|current\s*time|time\s+now)/.test(lower)) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }
  if (/(what\s+date|today\'?s\s+date|current\s*date)/.test(lower)) {
    return `Today's date is ${new Date().toLocaleDateString()}.`;
  }

  // Who are you
  if (/(who\s+are\s+you|what\s+are\s+you|your\s+name)/.test(lower)) {
    return 'I\'m StudyCenter Ai — your always-on study companion. Ask me anything!';
  }

  // Quick math inside the sentence, e.g., "what is 12*(3+4)/2?"
  const mathMatch = lower.match(/([-+/*().\s0-9]+)=?\??$/);
  if (mathMatch) {
    const expr = mathMatch[1].replace(/[^0-9+\-*/().\s]/g, '');
    const result = safeMathEval(expr);
    if (result !== null) return `That evaluates to ${result}.`;
  }

  // Definitions or how-tos
  if (/^define\s+/.test(lower)) {
    const term = q.slice(7).trim();
    if (term) return `Definition of ${term}: a concise explanation based on common usage and context.`;
  }

  // Generic helpful answer
  return (
    "Here's a helpful answer: " +
    'I understood your question and can guide you step-by-step. '
    + 'If you share more details (context, constraints, examples), I\'ll tailor the answer.'
  );
}

export default function App() {
  const [sessionId, setSessionId] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Create a unique session id so new visitors can't see other chats (isolation per browser)
  useEffect(() => {
    const key = 'scai_session_id';
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(key, sid);
    }
    setSessionId(sid);
  }, []);

  // Load/save conversations scoped to session
  const storageKey = useMemo(() => (sessionId ? `scai_conversations_${sessionId}` : null), [sessionId]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConversations(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } else {
        // Start with one empty conversation
        const initial = [{ id: crypto.randomUUID(), title: 'New Chat', preview: 'Say hello to begin', messages: [] }];
        setConversations(initial);
        setActiveId(initial[0].id);
      }
    } catch {
      // Reset if corrupted
      const initial = [{ id: crypto.randomUUID(), title: 'New Chat', preview: 'Say hello to begin', messages: [] }];
      setConversations(initial);
      setActiveId(initial[0].id);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, storageKey]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  const updateActiveConversation = (updater) => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? updater(c) : c)));
  };

  const handleNewChat = () => {
    const newConv = { id: crypto.randomUUID(), title: 'New Chat', preview: 'Ask anything...', messages: [] };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  const handleSelect = (id) => setActiveId(id);

  const handleSend = (text, files) => {
    if (!activeConversation) return;
    const attachments = (files || []).map((f) => ({ id: crypto.randomUUID(), name: f.name, url: URL.createObjectURL(f) }));

    // Add user message
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text, attachments };
    updateActiveConversation((c) => {
      const msgs = [...c.messages, userMsg];
      return {
        ...c,
        messages: msgs,
        title: c.title === 'New Chat' && text ? (text.length > 28 ? text.slice(0, 28) + '…' : text) : c.title,
        preview: text || c.preview,
      };
    });

    // Simulate AI typing delay
    setTimeout(() => {
      const replyText = localAssistantReply(text || '');
      const aiMsg = { id: crypto.randomUUID(), role: 'assistant', content: replyText, attachments: [] };
      updateActiveConversation((c) => ({ ...c, messages: [...c.messages, aiMsg], preview: replyText }));
    }, 450);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900">
      <ChatHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="hidden md:block md:w-64">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onNewChat={handleNewChat}
            onSelect={handleSelect}
          />
        </div>
        <main className="flex-1 flex flex-col">
          <MessageList messages={activeConversation ? activeConversation.messages : []} />
          <ChatInput onSend={handleSend} />
        </main>
      </div>
    </div>
  );
}
