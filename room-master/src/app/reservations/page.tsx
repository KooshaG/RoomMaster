import { prisma } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import convert from '@/lib/timeConvert';

export default async function Schedule() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const reservations = await prisma.reservation.findMany({ where: { userId: session.user.id }, include: { room: true }, orderBy: { date: 'desc'}});

      return (
        <table className='table table-pin-cols overflow-x-auto -z-10'>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Room Name</th>
              <th>Reservation Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return <tr key={reservation.id} className='hover'>
                <td>{reservation.id ?? "null"}</td>
                <td>{reservation.room.name ?? "null"}</td>
                <td>{reservation.date.toLocaleDateString("en-CA", {weekday: 'long', month: 'long', day: '2-digit'})}</td>
                <td>{convert(reservation.startTime)}</td>
                <td>{convert(reservation.endTime)}</td>
              </tr>;
            })}
          </tbody>
        </table>
      );
    // TODO: add tags to the table for better readability (upcoming/past/today...)
  }
  return <p>o no</p>;
}
