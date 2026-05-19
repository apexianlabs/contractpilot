import { NextResponse } from 'next/server'
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const res = await fetch(`${process.env.DB_API_URL}/db/contractpilot/analyses/${id}`, {
      headers: { 'Authorization': `Bearer ${process.env.DB_API_KEY_CONTRACTPILOT}` }
    })
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const data = await res.json()
    return NextResponse.json({ item: data.data })
  } catch(err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
