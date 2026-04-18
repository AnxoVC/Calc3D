'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/contexts/I18nContext'

interface ForumItem {
  id: string
  title?: string
  subject?: string
  content?: string
  message?: string
  type: 'announcement' | 'suggestion'
  created_at: string
}

export default function ForumFeed() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ForumItem[]>([])
  const [loading, setLoading] = useState(true)

  async function loadForum() {
    const supabase = createClient()
    
    // Fetch both announcements and public feedback
    const [annData, feedData] = await Promise.all([
      supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('feedback').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(10)
    ])

    const combined: ForumItem[] = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(annData.data || []).map((a: any) => ({ ...a, type: 'announcement' as const })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(feedData.data || []).map((f: any) => ({ ...f, type: 'suggestion' as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setItems(combined)
    setLoading(false)
  }

  useEffect(() => { 
    loadForum() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div className="text-center p-12 text-muted">{t('landing.community.loading')}</div>
  
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {items.length === 0 ? (
        <div className="card p-10 text-center text-muted">{t('landing.community.empty')}</div>
      ) : (
        items.map(item => (
          <div key={item.id} className={`card ${item.type === 'announcement' ? 'border-brand/30 bg-brand/5' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                item.type === 'announcement' ? 'bg-brand text-white' : 'bg-white/10 text-muted'
              }`}>
                {item.type === 'announcement' ? t('landing.community.official') : t('landing.community.community_tag')}
              </span>
              <span className="text-[10px] text-muted">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <h3 className="text-base font-bold mb-1">{item.title || item.subject}</h3>
            <p className="text-sm text-muted leading-relaxed">
              {item.content || item.message}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
