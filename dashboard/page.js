'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STATUS = {
  draft:  { bg: '#f1f5f9', color: '#475569', label: 'Draft' },
  ready:  { bg: '#f0fdf4', color: '#15803d', label: 'Ready' },
  sent:   { bg: '#eff6ff', color: '#1d4ed8', label: 'Sent' },
  won:    { bg: '#ecfdf5', color: '#059669', label: 'Won' },
  lost:   { bg: '#fff1f2', color: '#e11d48', label: 'Lost' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const match = document.cookie.match(/con_user=([^;]+)/)
    if (!match) { router.push('/login'); return }
    try {
      const u = JSON.parse(decodeURIComponent(match[1]))
      setUser(u)
      loadItems(u.id)
    } catch(e) { router.push('/login') }
  }, [])

  const loadItems = async (userId) => {
    try {
      const token = document.cookie.match(/con_token=([^;]+)/)?.[1] || ''
      const res = await fetch(`/api/items?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setItems(data.items || [])
    } catch(e) {}
    finally { setLoading(false) }
  }

  const handleLogout = () => {
    document.cookie = 'con_token=; path=/; max-age=0'
    document.cookie = 'con_user=; path=/; max-age=0'
    router.push('/login')
  }

  const getInitials = (u) => {
    if (!u) return 'CC'
    const name = u.name || u.email || ''
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const NAV = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard', active: true },
    { icon: '📄', label: 'My Items', href: '/items' },
    { icon: '⚙️', label: 'Settings', href: '/billing' },
  ]

  const sidebar = (
    <div style={{width:220,background:'#0f172a',display:'flex',flexDirection:'column',minHeight:'100vh',flexShrink:0}}>
      <div style={{padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:6,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>C</div>
          <div>
            <p style={{fontSize:13,fontWeight:800,color:'#fff',lineHeight:1}}>ContractPilot</p>
            <p style={{fontSize:10,color:'#64748b',lineHeight:1,marginTop:2}}>Understand any contract in</p>
          </div>
        </Link>
      </div>
      <div style={{padding:'12px 10px',flex:1}}>
        <Link href="/generate" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#0f172a',color:'#fff',textDecoration:'none',borderRadius:8,padding:'10px 16px',fontSize:13,fontWeight:600,marginBottom:16}}>
          <span style={{fontSize:16}}>+</span> New Result
        </Link>
        {NAV.map(item => (
          <Link key={item.label} href={item.href}
            style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:8,textDecoration:'none',marginBottom:2,
              background: item.active ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: item.active ? '#fff' : '#94a3b8',
              fontSize:13,fontWeight: item.active ? 600 : 400}}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </div>
      <div style={{padding:'12px 10px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{background:'rgba(255,255,255,0.05)',borderRadius:10,padding:'12px',marginBottom:8}}>
          <p style={{fontSize:11,fontWeight:600,color:'#94a3b8',marginBottom:6}}>Free Plan</p>
          <Link href="/billing" style={{display:'block',textAlign:'center',background:'#0f172a',color:'#fff',textDecoration:'none',borderRadius:6,padding:'6px',fontSize:11,fontWeight:600}}>
            Upgrade →
          </Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',cursor:'pointer'}} onClick={handleLogout}>
          <div style={{width:28,height:28,borderRadius:8,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>
            {getInitials(user)}
          </div>
          <div style={{minWidth:0}}>
            <p style={{fontSize:12,fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name || 'User'}</p>
            <p style={{fontSize:10,color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:'Inter,sans-serif',background:'#f8fafc'}}>
      {!isMobile && sidebar}
      {isMobile && sidebarOpen && (
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex'}}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} onClick={() => setSidebarOpen(false)}/>
          <div style={{position:'relative',zIndex:1}}>{sidebar}</div>
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <div style={{background:'#fff',borderBottom:'1px solid #e2e8f0',minHeight:56,display:'flex',alignItems:'center',padding:'8px 20px',gap:12,flexShrink:0}}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',flexDirection:'column',gap:4}}>
              <div style={{width:20,height:2,background:'#0f172a',borderRadius:2}}/>
              <div style={{width:20,height:2,background:'#0f172a',borderRadius:2}}/>
              <div style={{width:20,height:2,background:'#0f172a',borderRadius:2}}/>
            </button>
          )}
          <div style={{flex:1}}>
            <h1 style={{fontSize:17,fontWeight:700,color:'#0f172a',lineHeight:1}}>{greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p style={{fontSize:12,color:'#94a3b8',marginTop:2}}>Here's your ContractPilot activity.</p>
          </div>
          <Link href="/generate" style={{background:'#0f172a',color:'#fff',padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none',flexShrink:0}}>
            + New Result
          </Link>
        </div>
        <div style={{flex:1,padding:'24px',overflowY:'auto'}}>
          <div style={{display:'grid',gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',gap:12,marginBottom:24}}>
            {[
              { label:'Total', value: items.length, icon:'📄' },
              { label:'This Month', value: items.filter(i => new Date(i.created_at) > new Date(Date.now()-30*24*60*60*1000)).length, icon:'📅' },
              { label:'Time Saved', value: `${items.length * 2}h`, icon:'⏰' },
              { label:'Active', value: items.filter(i => i.status === 'active' || i.status === 'sent').length, icon:'🟢' },
            ].map(stat => (
              <div key={stat.label} style={{background:'#fff',borderRadius:12,border:'1px solid #e2e8f0',padding:'16px 18px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <p style={{fontSize:11,fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{stat.label}</p>
                  <span style={{fontSize:18}}>{stat.icon}</span>
                </div>
                <p style={{fontSize:26,fontWeight:700,color:'#0f172a'}}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div style={{background:'#fff',borderRadius:12,border:'1px solid #e2e8f0',overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <h2 style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>Recent Results</h2>
              <Link href="/generate" style={{background:'#0f172a',color:'#fff',padding:'6px 14px',borderRadius:7,fontSize:12,fontWeight:600,textDecoration:'none'}}>+ New</Link>
            </div>
            {loading ? (
              <div style={{padding:40,textAlign:'center',color:'#94a3b8',fontSize:13}}>Loading...</div>
            ) : items.length === 0 ? (
              <div style={{padding:48,textAlign:'center'}}>
                <p style={{color:'#94a3b8',fontSize:13,marginBottom:12}}>No Results yet</p>
                <Link href="/generate" style={{background:'#0f172a',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:600,textDecoration:'none'}}>
                  Create your first Result →
                </Link>
              </div>
            ) : items.slice(0,5).map((item, i) => (
              <div key={item.id} style={{padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom: i < 4 ? '1px solid #f8fafc' : 'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0,flex:1}}>
                  <div style={{width:36,height:36,borderRadius:8,background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#0f172a',flexShrink:0}}>
                    {(item.title || item.name || '?')[0].toUpperCase()}
                  </div>
                  <div style={{minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:600,color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title || item.name}</p>
                    <p style={{fontSize:11,color:'#94a3b8'}}>{new Date(item.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                  </div>
                </div>
                <Link href={`/items/${item.id}`} style={{color:'#0f172a',fontSize:12,fontWeight:600,textDecoration:'none',padding:'5px 12px',border:'1px solid #e2e8f0',borderRadius:6,flexShrink:0,marginLeft:12}}>
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
