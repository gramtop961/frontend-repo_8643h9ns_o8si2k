import { useEffect, useState } from 'react'

export default function AttachmentPreview({ id, apiUrl, isUser }) {
  const [kind, setKind] = useState('unknown') // 'image' | 'pdf' | 'unknown'
  const [size, setSize] = useState(null)
  const [error, setError] = useState(null)

  const url = `${apiUrl}/attachments/${id}`

  useEffect(() => {
    let cancelled = false
    async function detect() {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (!res.ok) throw new Error('HEAD failed')
        const ct = res.headers.get('content-type') || ''
        const cl = res.headers.get('content-length')
        if (cancelled) return
        if (ct.startsWith('image/')) setKind('image')
        else if (ct === 'application/pdf') setKind('pdf')
        else setKind('unknown')
        if (cl) setSize(Number(cl))
      } catch (e) {
        if (!cancelled) setError(e)
      }
    }
    detect()
    return () => { cancelled = true }
  }, [url])

  const chipBase = isUser
    ? 'border-white/30 hover:bg-white/10 text-white/90'
    : 'border-gray-300 hover:bg-white text-gray-700'

  if (kind === 'image') {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block group">
        <img
          src={url}
          alt="attachment"
          className={`rounded-lg border ${isUser ? 'border-white/20' : 'border-gray-200'} max-h-48 max-w-[18rem] object-contain bg-white`}
          loading="lazy"
        />
      </a>
    )
  }

  if (kind === 'pdf') {
    return (
      <div className={`rounded-lg border ${isUser ? 'border-white/20' : 'border-gray-200'} bg-white overflow-hidden w-full max-w-[22rem]`}> 
        <div className="h-48">
          <iframe title="PDF preview" src={url} className="w-full h-full" />
        </div>
        <div className="flex items-center justify-between px-2 py-1 text-xs">
          <span className="text-gray-600">PDF document</span>
          <a href={url} target="_blank" rel="noreferrer" className="underline">Open</a>
        </div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border ${chipBase}`}
    >
      Attachment{size ? ` • ${(size/1024).toFixed(1)} KB` : ''}
    </a>
  )
}
