import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prismaClient';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  const date = new Date()
  date.setDate(date.getDate() - 14) // limit number of reservations we pull
  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: date
      },
      userId: 'clixb60s300002xdwfogq7ahg'
    },
    select: {
      id: true,
      date: true,
    }
  })
  const correctedReservations = reservations.map((reservation) => {
    const correctedReservation = {id: reservation.id, date: new Date(reservation.date)}
    correctedReservation.date.setHours(12)
    // correctedReservation.date.setMinutes(720 - new Date().getTimezoneOffset())
    return correctedReservation
  })
  correctedReservations.forEach(async (reservation) => {
    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        date: reservation.date
      }
    })
  })

  return NextResponse.json({ ok: true, data: correctedReservations, original: reservations });
}