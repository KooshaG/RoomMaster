import { prisma } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Schedule() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const reservations = await prisma.reservation.findMany({ where: { userId: session.user.id }, include: { room: true }, orderBy: { date: 'desc'}});

      return (
        <table className='table table-pin-cols overflow-x-auto'>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Room Name</th>
              <th>Reservation Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return <tr key={reservation.id} className='hover'>
                <td>{reservation.id ?? "null"}</td>
                <td>{reservation.room.name ?? "null"}</td>
                <td>{reservation.date.toLocaleDateString("en-CA", {weekday: 'long', month: 'long', day: '2-digit'})}</td>
              </tr>;
            })}
          </tbody>
        </table>
      );
    // TODO: add tags to the table for better readability (upcoming/past/today...)
  }
  return <p>o no</p>;
}
