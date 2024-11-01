import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'gslcloudpaneldata',
    password: 'CDpp8xFm9a7SNC41z8jW',
    database: 'opportunity',
    port: 3306
  })

  try {
    const [rows] = await connection.execute('SELECT * FROM TheatreVenueBooking')
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' })
  } finally {
    await connection.end()
  }
}