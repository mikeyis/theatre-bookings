import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined')
    return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
  }

  const { username, password } = await request.json()

  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL)
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [username, password]
    )

    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as { id: number }
      
      // Set a cookie to maintain the session
      cookies().set('user_id', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error during authentication' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}