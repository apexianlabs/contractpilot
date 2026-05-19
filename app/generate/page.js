'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function GeneratePageInner() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [result, setResult]   = useState(null)
  const [form, setForm]       = useState({})

  useEffect(() => {
    const match = document.cookie.match(/con_user=([^;]+)/)
    if (match) {
      try { setUser(JSON.parse(decodeURIComponent(match[1]))) } catch(e) {}
    }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const token = document.cookie.match(/con_token=([^;]+)/)?.[1] || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, userId: user?.id })
      })
      const data = await res.json()
      if (res.status === 402) { setError('limit_reached'); setLoading(false); return }
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data)
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e2e8f0',height:56,display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
        <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:26,height:26,borderRadius:6,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff'}}>C</div>
          <span style={{fontWeight:700,color:'#0f172a',fontSize:14}}>ClarityIQ</span>
        </Link>
        <div style={{flex:1}}/>
        {user && <Link href="/dashboard" style={{fontSize:13,color:'#64748b',textDecoration:'none'}}>Dashboard</Link>}
      </nav>
      <div style={{maxWidth:640,margin:'0 auto',padding:'40px 24px'}}>
        <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',marginBottom:6}}>Analyse a contract</h1>
        <p style={{fontSize:14,color:'#64748b',marginBottom:28}}>Paste contract text to get a plain-English breakdown.</p>

        {error && error !== 'limit_reached' && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#dc2626',marginBottom:20}}>{error}</div>}
        {error === 'limit_reached' && (
          <div style={{background:'#fafafa',border:'2px solid #0f172a',borderRadius:14,padding:24,marginBottom:20,textAlign:'center'}}>
            <p style={{fontSize:28,marginBottom:8}}>🚀</p>
            <p style={{fontSize:16,fontWeight:800,color:'#0f172a',marginBottom:6}}>You've reached your free limit</p>
            <p style={{fontSize:13,color:'#64748b',marginBottom:16,lineHeight:1.6}}>You've used all 3 free generations this month. Upgrade to continue.</p>
            <div style={{background:'#f1f5f9',borderRadius:8,padding:'10px 16px',marginBottom:16,textAlign:'left'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#64748b',marginBottom:6}}>
                <span>Free plan usage</span><span>3 / 3 used</span>
              </div>
              <div style={{background:'#e2e8f0',borderRadius:4,height:6}}>
                <div style={{background:'#0f172a',borderRadius:4,height:6,width:'100%'}}/>
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button onClick={() => setError('')}
                style={{padding:'10px 20px',borderRadius:8,border:'1px solid #e2e8f0',background:'#fff',fontSize:14,color:'#64748b',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                Maybe later
              </button>
              <a href="/billing"
                style={{padding:'10px 20px',borderRadius:8,border:'none',background:'#0f172a',color:'#fff',fontSize:14,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center'}}>
                Upgrade now →
              </a>
            </div>
            <p style={{fontSize:11,color:'#94a3b8',marginTop:12}}>Resets June 1st · No credit card needed for free plan</p>
          </div>
        )}

        {result ? (
          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:24}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#15803d',marginBottom:8}}>✅ Done!</h2>
            <p style={{fontSize:13,color:'#166534',marginBottom:16}}>Your result has been generated.</p>
            <pre style={{background:'#fff',borderRadius:8,padding:16,fontSize:12,color:'#374151',overflow:'auto',maxHeight:300,border:'1px solid #e2e8f0'}}>
              {JSON.stringify(result.result, null, 2)}
            </pre>
            <button onClick={() => { setResult(null); setForm({}) }}
              style={{marginTop:12,width:'100%',background:'transparent',border:'1px solid #e2e8f0',color:'#64748b',padding:'8px',borderRadius:8,fontSize:13,cursor:'pointer'}}>
              Generate another
            </button>
          </div>
        ) : (
          <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:28}}>
            <p style={{fontSize:13,color:'#94a3b8',marginBottom:20,textAlign:'center'}}>
              Fill in the details below to generate your result.
            </p>
            <button onClick={handleSubmit} disabled={loading}
              style={{width:'100%',background:loading?'#94a3b8':'#0f172a',color:'#fff',padding:'13px',borderRadius:10,border:'none',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'Inter,sans-serif'}}>
              {loading ? 'Generating...' : 'Generate →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#94a3b8'}}>Loading...</div>}>
      <GeneratePageInner />
    </Suspense>
  )
}
