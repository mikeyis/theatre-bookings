'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { MoreHorizontal, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Booking = {
  id: number
  venue_name: string
  event_name: string
  booking_date: string
  status: string
}

export function TheatreBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bookings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        return response.json()
      })
      .then(data => {
        setBookings(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError('Error fetching bookings')
        setIsLoading(false)
      })
  }, [])

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-500'
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="w-[300px]" />
        </div>
        <Button>Add New Booking</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getStatusColor(booking.status)}`}
                    />
                    <span className="text-xs uppercase text-muted-foreground">{booking.status || 'Unknown'}</span>
                  </div>
                </TableCell>
                <TableCell>{booking.venue_name || 'N/A'}</TableCell>
                <TableCell>{booking.event_name || 'N/A'}</TableCell>
                <TableCell>{booking.booking_date ? format(new Date(booking.booking_date), 'PPP') : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
