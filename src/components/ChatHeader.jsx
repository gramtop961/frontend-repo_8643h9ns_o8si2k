import { Sparkles } from 'lucide-react'

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-gray-800">ChatGPT Clone</h1>
          <p className="text-xs text-gray-500">Unlimited, always-on assistant</p>
        </div>
      </div>
      <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
        Free & unlimited usage — no sign-in
      </div>
    </div>
  )
}
