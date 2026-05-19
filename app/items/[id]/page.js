'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ItemDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [item, setItem]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    const token = document.cookie.match(/con_token=([^;]+)/)?.[1]
    if (!token) { router.push('/login'); return }
    fetch(`/api/items/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError('Item not found')
        else setItem(data.item)
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#94a3b8'}}>Loading...</div>
  if (error) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{textAlign:'center'}}>
        <p style={{color:'#dc2626',marginBottom:16}}>{error}</p>
        <Link href="/dashboard" style={{color:'#0f172a',textDecoration:'none'}}>← Back to dashboard</Link>
      </div>
    </div>
  )

  const result = item?.result_data || {}

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e2e8f0',height:56,display:'flex',alignItems:'center',padding:'0 24px',gap:16,position:'sticky',top:0,zIndex:10}}>
        <Link href="/dashboard" style={{fontSize:13,color:'#64748b',textDecoration:'none'}}>← Dashboard</Link>
        <div style={{flex:1}}/>
        <button onClick={() => window.print()}
          style={{background:'#dc2626',color:'#fff',padding:'7px 16px',borderRadius:8,border:'none',fontSize:13,fontWeight:600,cursor:'pointer'}}>
          📕 PDF
        </button>
      </nav>
      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 24px'}}>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:24,marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:'#0f172a',textTransform:'uppercase',marginBottom:4}}>Result</p>
          <p style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>{item?.title || 'Untitled'}</p>
          <p style={{fontSize:13,color:'#64748b'}}>{new Date(item?.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
        </div>
        {Object.entries(result).map(([key, value]) => {
          if (!value || key === 'version') return null
          const label = key.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())
          return (
            <div key={key} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:20,marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>{label}</p>
              {Array.isArray(value) ? (
                <ul style={{margin:0,padding:'0 0 0 16px'}}>
                  {value.map((v,i) => (
                    <li key={i} style={{fontSize:13,color:'#374151',lineHeight:1.6,marginBottom:4}}>
                      {typeof v === 'string' ? v : typeof v === 'object' ? Object.values(v).join(' — ') : String(v)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{fontSize:14,color:'#374151',lineHeight:1.7}}>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
