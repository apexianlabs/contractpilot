import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh',fontFamily:'Inter,sans-serif',background:'#fff',color:'#0f172a'}}>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(8px)',borderBottom:'1px solid #e2e8f0',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>C</div>
          <span style={{fontWeight:800,fontSize:16,color:'#0f172a'}}>ContractPilot</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link href="/login" style={{padding:'7px 14px',fontSize:13,color:'#475569',textDecoration:'none',fontWeight:500}}>Log in</Link>
          <Link href="/signup" style={{padding:'8px 16px',fontSize:13,background:'#0f172a',color:'#fff',textDecoration:'none',borderRadius:8,fontWeight:600}}>Start Free Trial</Link>
        </div>
      </nav>

      <section style={{padding:'80px 20px 60px',textAlign:'center',background:'linear-gradient(180deg,#f8fafc 0%,#fff 100%)'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f0f4ff',border:'1px solid #bfdbfe',borderRadius:20,padding:'4px 12px',fontSize:11,color:'#0f172a',fontWeight:700,marginBottom:20,textTransform:'uppercase',letterSpacing:'0.05em'}}>
          ⚡ AI-POWERED
        </div>
        <h1 style={{fontSize:'clamp(32px,5vw,56px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1.5px',marginBottom:20,maxWidth:640,margin:'0 auto 20px'}}>
          Understand any contract in 60 seconds
        </h1>
        <p style={{fontSize:17,color:'#64748b',maxWidth:480,margin:'0 auto 32px',lineHeight:1.6}}>
          Understand any contract in 60 seconds
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
          <Link href="/signup" style={{padding:'12px 28px',background:'#0f172a',color:'#fff',textDecoration:'none',borderRadius:10,fontWeight:700,fontSize:15}}>
            Start Free Trial →
          </Link>
          <Link href="/login" style={{padding:'12px 28px',background:'#fff',color:'#0f172a',textDecoration:'none',borderRadius:10,fontWeight:700,fontSize:15,border:'2px solid #e2e8f0'}}>
            Log in
          </Link>
        </div>
        <p style={{fontSize:12,color:'#94a3b8'}}>✓ No credit card required &nbsp;·&nbsp; ✓ 3 free uses &nbsp;·&nbsp; ✓ Cancel anytime</p>
      </section>

      <section style={{padding:'60px 20px',maxWidth:1000,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <h2 style={{fontSize:30,fontWeight:800,letterSpacing:'-0.5px',marginBottom:8}}>Everything you need</h2>
          <p style={{fontSize:15,color:'#64748b'}}>Built for professionals who value their time.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
          {[
            { icon:'⚡', title:'AI-Powered', desc:'Claude AI generates results in seconds, tailored to your specific needs.' },
            { icon:'⬇️', title:'Export Ready', desc:'Download your results instantly. Ready to use, share, or customise.' },
            { icon:'📊', title:'Track Results', desc:'See your history and track performance over time.' },
          ].map(f => (
            <div key={f.title} style={{background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0',padding:24}}>
              <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
              <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>{f.title}</h3>
              <p style={{fontSize:13,color:'#64748b',lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'60px 20px',background:'#0f172a',textAlign:'center'}}>
        <h2 style={{fontSize:30,fontWeight:800,color:'#fff',marginBottom:12}}>Ready to get started?</h2>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.8)',marginBottom:28}}>Join thousands of professionals saving time with ContractPilot.</p>
        <Link href="/signup" style={{padding:'13px 28px',background:'#fff',color:'#0f172a',textDecoration:'none',borderRadius:10,fontWeight:700,fontSize:15}}>
          Start Free Trial →
        </Link>
      </section>

      <footer style={{padding:'24px 20px',borderTop:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <span style={{fontWeight:700,fontSize:13,color:'#0f172a'}}>ContractPilot</span>
        <p style={{fontSize:12,color:'#94a3b8'}}>© {new Date().getFullYear()} ContractPilot. Built on Claude AI.</p>
        <div style={{display:'flex',gap:16}}>
          {['Privacy','Terms','Support'].map(l => <a key={l} href="#" style={{fontSize:12,color:'#64748b',textDecoration:'none'}}>{l}</a>)}
        </div>
      </footer>
    </div>
  )
}
