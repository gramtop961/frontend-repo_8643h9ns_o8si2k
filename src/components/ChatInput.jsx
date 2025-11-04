import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const addFiles = useCallback((list) => {
    const incoming = Array.from(list || []);
    if (incoming.length === 0) return;
    // Keep total size under ~25MB to be safe in-browser
    const next = [...files];
    for (const f of incoming) {
      if (f.size <= 25 * 1024 * 1024) next.push(f);
    }
    setFiles(next);
  }, [files]);

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

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles(e.dataTransfer.files);
    dropRef.current?.classList.remove('ring-2', 'ring-indigo-500');
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add('ring-2', 'ring-indigo-500');
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove('ring-2', 'ring-indigo-500');
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border-t border-zinc-200 p-3 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-3xl mx-auto">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((f, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                <span className="truncate max-w-[180px]" title={f.name}>{f.name}</span>
                <button onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-zinc-700">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="rounded-md border border-dashed border-zinc-300 p-3 transition-all bg-white"
        >
          <div className="flex items-end gap-2">
            <label className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer">
              <Paperclip size={18} className="text-zinc-700" />
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything... Drag files here"
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
    </div>
  );
}
