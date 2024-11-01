import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM TheatreVenueBooking`
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.error()
  }
}