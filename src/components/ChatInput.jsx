import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;
    onSend(trimmed, files);
    setText('');
    setFiles([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-zinc-200 p-3 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-3xl mx-auto">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((f, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {f.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer">
            <Paperclip size={18} className="text-zinc-700" />
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none rounded-md border border-zinc-200 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            onClick={submit}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500 disabled:opacity-50"
            disabled={!text.trim() && files.length === 0}
          >
            <Send size={16} />
            Send
          </button>
        </div>
        <div className="text-[10px] text-zinc-500 mt-1">Press Enter to send • Shift+Enter for new line</div>
      </div>
    </div>
  );
}
