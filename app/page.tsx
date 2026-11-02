'use client'

import { useMemo, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  CloudUpload,
  File,
  FileImage,
  FileText,
  Folder,
  Grid2X2,
  HardDrive,
  ImageIcon,
  List,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type FileItem = {
  id: number
  name: string
  type: 'image' | 'document' | 'archive'
  size: string
  updated: string
  color: string
}

const initialFiles: FileItem[] = [
  { id: 1, name: 'brand-guidelines.pdf', type: 'document', size: '4.8 MB', updated: 'Today, 10:42 AM', color: 'bg-rose-50 text-rose-500' },
  { id: 2, name: 'product-shot-01.jpg', type: 'image', size: '2.4 MB', updated: 'Yesterday, 4:18 PM', color: 'bg-sky-50 text-sky-500' },
  { id: 3, name: 'campaign-assets.zip', type: 'archive', size: '18.2 MB', updated: 'Mar 12, 2024', color: 'bg-amber-50 text-amber-500' },
  { id: 4, name: 'homepage-wireframe.png', type: 'image', size: '1.8 MB', updated: 'Mar 10, 2024', color: 'bg-violet-50 text-violet-500' },
  { id: 5, name: 'project-brief.docx', type: 'document', size: '832 KB', updated: 'Mar 08, 2024', color: 'bg-blue-50 text-blue-500' },
]

function FileIcon({ type }: { type: FileItem['type'] }) {
  if (type === 'image') return <FileImage className="size-5" />
  if (type === 'archive') return <Folder className="size-5" />
  return <FileText className="size-5" />
}

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState(initialFiles)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<number[]>([])

  const filteredFiles = useMemo(() => files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase())), [files, query])
  const selectedCount = selected.length

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    setUploading(true)
    window.setTimeout(() => {
      const additions = Array.from(fileList).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' as const : file.name.endsWith('.zip') ? 'archive' as const : 'document' as const,
        size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        updated: 'Just now',
        color: file.type.startsWith('image/') ? 'bg-sky-50 text-sky-500' : 'bg-blue-50 text-blue-500',
      }))
      setFiles((current) => [...additions, ...current])
      setUploading(false)
    }, 700)
  }

  function deleteSelected() {
    setFiles((current) => current.filter((file) => !selected.includes(file.id)))
    setSelected([])
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white"><CloudUpload className="size-5" /></div>
            <span className="text-lg font-semibold tracking-tight">Cloudcase</span>
          </div>
          <nav className="mt-10 flex flex-col gap-1 text-sm">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <button className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2.5 text-left font-medium text-slate-900"><HardDrive className="size-4" /> All files <span className="ml-auto text-xs text-slate-400">24</span></button>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-500 hover:bg-slate-50"><ImageIcon className="size-4" /> Images</button>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-500 hover:bg-slate-50"><FileText className="size-4" /> Documents</button>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-500 hover:bg-slate-50"><Trash2 className="size-4" /> Trash</button>
          </nav>
          <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-medium text-slate-300">Storage</span><span className="text-xs">28%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[28%] rounded-full bg-white" /></div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">2.8 GB of 10 GB used</p>
            <button className="mt-3 text-xs font-semibold text-white underline underline-offset-4">Upgrade storage</button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white lg:hidden"><CloudUpload className="size-5" /></div><span className="text-sm text-slate-400">Workspace / <span className="font-medium text-slate-700">All files</span></span></div>
            <div className="flex items-center gap-3"><button className="relative flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Notifications"><span className="absolute right-2 top-2 size-1.5 rounded-full bg-orange-400" /></button><div className="flex size-9 items-center justify-center rounded-full bg-[#d9e9e4] text-xs font-bold text-[#31695c]">AM</div></div>
          </header>

          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-slate-400">Tuesday, March 19, 2024</p><h1 className="text-3xl font-semibold tracking-tight">Good morning, Aamna</h1><p className="mt-2 text-sm text-slate-500">Manage your files and keep your workspace organized.</p></div><Button onClick={() => inputRef.current?.click()} className="h-11 rounded-xl bg-slate-950 px-5 hover:bg-slate-800"><UploadCloud data-icon="inline-start" /> Upload files</Button></div>

            <div onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragActive(true) }} onDragLeave={() => setDragActive(false)} onDrop={(event) => { event.preventDefault(); setDragActive(false); handleFiles(event.dataTransfer.files) }} className={`mb-8 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition-colors ${dragActive ? 'border-slate-900 bg-slate-100' : 'border-slate-300 bg-white hover:border-slate-400'}`}><div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><CloudUpload className="size-5" /></div><p className="text-sm font-semibold">{uploading ? 'Uploading files...' : 'Drop files here to upload'}</p><p className="mt-1 text-xs text-slate-400">or click to browse from your computer · Max file size 50 MB</p><input ref={inputRef} type="file" multiple className="hidden" onChange={(event) => handleFiles(event.target.files)} /></div>

            <div className="mb-5 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-500">Total files</span><File className="size-4 text-slate-400" /></div><p className="text-2xl font-semibold">{files.length + 19}</p><p className="mt-1 text-xs text-emerald-600">+12% this month</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-500">Storage used</span><HardDrive className="size-4 text-slate-400" /></div><p className="text-2xl font-semibold">2.8 <span className="text-sm font-normal text-slate-400">GB</span></p><p className="mt-1 text-xs text-slate-400">of 10 GB available</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-500">Shared with me</span><ShieldCheck className="size-4 text-slate-400" /></div><p className="text-2xl font-semibold">8</p><p className="mt-1 text-xs text-slate-400">Across 4 workspaces</p></div></div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Recent files</h2><p className="mt-1 text-sm text-slate-400">Your latest uploads and shared files</p></div><div className="flex items-center gap-2"><div className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:w-56"><Search className="size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files" className="min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div><button className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500" aria-label="Filter files"><SlidersHorizontal className="size-4" /></button><div className="hidden items-center rounded-xl border border-slate-200 bg-white p-1 sm:flex"><button onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`} aria-label="Grid view"><Grid2X2 className="size-4" /></button><button onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`} aria-label="List view"><List className="size-4" /></button></div></div></div>

            {selectedCount > 0 && <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm text-white"><span>{selectedCount} file{selectedCount > 1 ? 's' : ''} selected</span><div className="flex items-center gap-2"><button className="rounded-lg px-3 py-1.5 text-xs hover:bg-white/10" onClick={() => setSelected([])}>Cancel</button><button className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900" onClick={deleteSelected}>Delete</button></div></div>}

            <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-2'}>{filteredFiles.map((file) => <article key={file.id} className={`group border border-slate-200 bg-white transition-shadow hover:shadow-md ${view === 'grid' ? 'rounded-2xl p-4' : 'flex items-center gap-4 rounded-xl p-3'}`}><div className={`flex ${view === 'grid' ? 'mb-8 size-12' : 'size-10'} items-center justify-center rounded-xl ${file.color}`}><FileIcon type={file.type} /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-semibold">{file.name}</h3>{selected.includes(file.id) && <Check className="size-4 shrink-0 text-emerald-500" />}</div><p className="mt-1 text-xs text-slate-400">{file.size} · {file.updated}</p></div><div className={`${view === 'grid' ? 'mt-4 border-t border-slate-100 pt-3' : ''} flex items-center justify-between gap-2`}><span className="text-xs text-slate-400">Private</span><button onClick={() => setSelected((current) => current.includes(file.id) ? current.filter((id) => id !== file.id) : [...current, file.id])} className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Select ${file.name}`}><MoreHorizontal className="size-4" /></button></div></article>)}</div>
            {filteredFiles.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><X className="mx-auto size-6 text-slate-300" /><p className="mt-3 text-sm font-medium">No files found</p><p className="mt-1 text-xs text-slate-400">Try a different search term.</p></div>}
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck className="size-3.5" /> Files are encrypted and secured with enterprise-grade protection</p>
          </div>
        </section>
      </div>
    </main>
  )
}
