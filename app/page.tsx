import { TheatreBookings } from './theatre-bookings'

export default async function Page() {
  const bookings = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`).then(res => res.json())
  
  return <TheatreBookings initialBookings={bookings} />
}