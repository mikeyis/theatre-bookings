import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined')
    return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
  }

  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL)
    const [rows] = await connection.execute('SELECT * FROM TheatreVenueBooking')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
