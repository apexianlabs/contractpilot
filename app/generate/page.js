'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const ROLES = ['Freelancer','Agency Owner','Small Business Owner','Consultant','Employee','Other']

export default function GeneratePage() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [result, setResult]   = useState(null)
  const [form, setForm]       = useState({ contract_text:'', reviewer_role:'Freelancer' })

  useEffect(() => {
    try {
      const match = document.cookie.match(/con_user=([^;]+)/)
      if (match) setUser(JSON.parse(decodeURIComponent(match[1])))
    } catch(e) {}
  }, [])

  const handleSubmit = async () => {
    if (!form.contract_text.trim()) return setError('Please paste the contract text.')
    setLoading(true); setError(''); setResult(null)
    try {
      const token = document.cookie.match(/con_token=([^;]+)/)?.[1] || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  const inputStyle = { width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, color:'#0f172a', background:'#fff', outline:'none', fontFamily:'Inter,sans-serif', boxSizing:'border-box' }
  const labelStyle = { fontSize:11, fontWeight:600, color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:5 }

  const getRiskColor = (level) => {
    if (!level) return { bg:'#f8fafc', color:'#475569' }
    const l = level.toLowerCase()
    if (l.includes('high') || l.includes('red')) return { bg:'#fef2f2', color:'#dc2626' }
    if (l.includes('medium') || l.includes('yellow')) return { bg:'#fffbeb', color:'#d97706' }
    return { bg:'#f0fdf4', color:'#15803d' }
  }

  if (result) return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e2e8f0',height:56,display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>C</div>
          <span style={{fontWeight:700,color:'#0f172a',fontSize:15}}>ClarityIQ</span>
        </Link>
        <div style={{flex:1}}/>
      </nav>
      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 24px',display:'flex',flexDirection:'column',gap:14}}>
        <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:12,padding:20}}>
          <p style={{fontSize:11,fontWeight:700,color:'#0f172a',textTransform:'uppercase',marginBottom:4}}>✅ Contract Analysis Complete</p>
          <p style={{fontSize:16,fontWeight:700,color:'#0f172a'}}>Reviewed as: {form.reviewer_role}</p>
        </div>
        {result.overall_risk && (() => {
          const rc = getRiskColor(result.overall_risk)
          return (
            <div style={{background:rc.bg,border:`2px solid ${rc.color}20`,borderRadius:12,padding:20}}>
              <p style={{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',marginBottom:6}}>⚠️ Overall Risk Level</p>
              <p style={{fontSize:22,fontWeight:800,color:rc.color}}>{result.overall_risk}</p>
            </div>
          )
        })()}
        {result.summary && <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:20}}>
          <p style={{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',marginBottom:8}}>📋 Summary</p>
          <p style={{fontSize:14,color:'#374151',lineHeight:1.7}}>{result.summary}</p>
        </div>}
        {result.red_flags && result.red_flags.length > 0 && (
          <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:12,padding:20}}>
            <p style={{fontSize:11,fontWeight:700,color:'#dc2626',textTransform:'uppercase',marginBottom:10}}>🚩 Red Flags</p>
            {result.red_flags.map((f,i) => (
              <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
                <span style={{color:'#dc2626',fontSize:12,marginTop:2,flexShrink:0}}>!</span>
                <p style={{fontSize:13,color:'#374151',lineHeight:1.6}}>{typeof f === 'string' ? f : f.issue || JSON.stringify(f)}</p>
              </div>
            ))}
          </div>
        )}
        {result.key_terms && <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:20}}>
          <p style={{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',marginBottom:10}}>📌 Key Terms</p>
          {Array.isArray(result.key_terms) ? result.key_terms.map((t,i) => (
            <div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom: i < result.key_terms.length-1 ? '1px solid #f1f5f9' : 'none'}}>
              <p style={{fontSize:13,fontWeight:600,color:'#0f172a',marginBottom:2}}>{typeof t === 'string' ? t : t.term || t.clause || ''}</p>
              {t.explanation && <p style={{fontSize:12,color:'#64748b',lineHeight:1.5}}>{t.explanation}</p>}
            </div>
          )) : <p style={{fontSize:13,color:'#374151'}}>{result.key_terms}</p>}
        </div>}
        {result.recommendations && <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:20}}>
          <p style={{fontSize:11,fontWeight:700,color:'#15803d',textTransform:'uppercase',marginBottom:10}}>✅ Recommendations</p>
          {Array.isArray(result.recommendations) ? result.recommendations.map((r,i) => (
            <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
              <span style={{color:'#15803d',fontSize:12,marginTop:2,fontWeight:700}}>{i+1}.</span>
              <p style={{fontSize:13,color:'#374151',lineHeight:1.6}}>{typeof r === 'string' ? r : JSON.stringify(r)}</p>
            </div>
          )) : <p style={{fontSize:13,color:'#374151'}}>{result.recommendations}</p>}
        </div>}
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button onClick={() => window.print()} style={{flex:1,padding:'10px',borderRadius:8,border:'1px solid #e2e8f0',background:'#fff',fontSize:13,fontWeight:600,color:'#475569',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>📕 Print / PDF</button>
          <button onClick={() => { setResult(null); setForm({contract_text:'',reviewer_role:'Freelancer'}) }} style={{flex:1,padding:'10px',borderRadius:8,border:'1px solid #e2e8f0',background:'#fff',fontSize:13,fontWeight:600,color:'#475569',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>Analyse another</button>
          {user ? <Link href="/dashboard" style={{flex:1,padding:'10px',borderRadius:8,border:'none',background:'#0f172a',color:'#fff',fontSize:13,fontWeight:700,textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>Dashboard →</Link>
                : <Link href="/login" style={{flex:1,padding:'10px',borderRadius:8,border:'none',background:'#0f172a',color:'#fff',fontSize:13,fontWeight:700,textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>Save analysis →</Link>}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e2e8f0',height:56,display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>C</div>
          <span style={{fontWeight:700,color:'#0f172a',fontSize:15}}>ClarityIQ</span>
        </Link>
        <div style={{flex:1}}/>
        {user ? <Link href="/dashboard" style={{fontSize:13,color:'#64748b',textDecoration:'none'}}>Dashboard</Link>
               : <Link href="/login" style={{fontSize:13,color:'#0f172a',fontWeight:600,textDecoration:'none'}}>Sign in</Link>}
      </nav>
      <div style={{maxWidth:680,margin:'0 auto',padding:'40px 24px'}}>
        <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',marginBottom:6}}>Analyse a contract</h1>
        <p style={{fontSize:14,color:'#64748b',marginBottom:28}}>Paste any contract and get a plain-English breakdown of risks, obligations, and red flags.</p>
        {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#dc2626',marginBottom:20}}>{error}</div>}
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:28}}>
          <div style={{marginBottom:18}}>
            <label style={labelStyle}>I am reviewing this as a...</label>
            <select value={form.reviewer_role} onChange={e => setForm({...form,reviewer_role:e.target.value})} style={{...inputStyle,background:'#fff'}}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{marginBottom:24}}>
            <label style={labelStyle}>Contract text *</label>
            <textarea value={form.contract_text} onChange={e => setForm({...form,contract_text:e.target.value})}
              placeholder="Paste the full contract or relevant sections here..."
              rows={12} style={{...inputStyle,resize:'vertical'}}/>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:loading?'#475569':'#0f172a',color:'#fff',fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'Inter,sans-serif'}}>
            {loading ? '🔍 Analysing contract...' : 'Analyse contract →'}
          </button>
          <p style={{fontSize:11,color:'#94a3b8',textAlign:'center',marginTop:12}}>⚠️ AI analysis is for informational purposes only. Always consult a lawyer for legal advice.</p>
        </div>
      </div>
    </div>
  )
}
