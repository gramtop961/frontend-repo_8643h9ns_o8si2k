import React from 'react';

function isImage(type) {
  return type?.startsWith('image/');
}

function isPDF(type, name = '') {
  return type === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
}

export default function AttachmentPreview({ attachment }) {
  // attachment can be { id, name, url, type }
  const { name, url, type } = attachment;

  if (isImage(type)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-md border border-zinc-200">
        <img src={url} alt={name} className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
        <div className="px-2 py-1 text-[10px] text-zinc-600 truncate bg-white">{name}</div>
      </a>
    );
  }

  if (isPDF(type, name)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block rounded-md border border-zinc-200 bg-white overflow-hidden">
        <div className="h-32 w-full bg-zinc-50 grid place-items-center text-xs text-zinc-600">PDF Preview</div>
        <div className="px-2 py-1 text-[10px] text-zinc-600 truncate">{name}</div>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className="px-2 py-2 rounded-md border border-zinc-200 bg-white text-xs text-zinc-700 truncate">
      {name}
    </a>
  );
}
