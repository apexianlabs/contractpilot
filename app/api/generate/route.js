import { NextResponse } from 'next/server'
export async function POST(request) {
  try {
    const body = await request.json()
    const { contract_text, reviewer_role, userId } = body
    if (!contract_text) return NextResponse.json({ error: 'Contract text is required' }, { status: 400 })
    const aiRes = await fetch(`${process.env.AI_API_URL}/api/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ task: 'analyse_contract', inputs: { contract_text, reviewer_role: reviewer_role||'Freelancer' } })
    })
    const aiData = await aiRes.json()
    if (!aiRes.ok) throw new Error(aiData.error || 'AI failed')
    const result = aiData.data
    let itemId = null
    if (userId && process.env.DB_API_URL) {
      try {
        const dbRes = await fetch(`${process.env.DB_API_URL}/db/contractpilot/analyses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.DB_API_KEY_CONTRACTPILOT}` },
          body: JSON.stringify({ user_id: userId, title: `Contract Analysis — ${new Date().toLocaleDateString()}`, reviewer_role, result_data: result, status: 'complete' })
        })
        const dbData = await dbRes.json()
        itemId = dbData.data?.id || null
      } catch(e) {}
    }
    return NextResponse.json({ itemId, result })
  } catch(err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
