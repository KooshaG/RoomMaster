import dynamic from 'next/dynamic';
import { prisma } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

const ReservationEntry = dynamic(() => import('@/components/Reservation/ReservationEntry'), {ssr: false});


export default async function Reservations() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const reservations = await prisma.reservation.findMany({ where: { userId: session.user.id }, include: { room: true }, orderBy: { date: 'desc'}});

      return (
        <div className="overflow-x-auto">
          <table className='table table-pin-cols pt-10'>
            <thead>
              <tr>
                <th className='z-0'>Reservation ID</th>
                <th className='text-center'>Status</th>
                <th className='z-0'>Room Name</th>
                <th className='z-0'>Reservation Date</th>
                <th className='z-0'>Start Time</th>
                <th className='z-0'>End Time</th>
                <th className='z-0'></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                return <ReservationEntry key={reservation.id} reservation={reservation}/>;
              })}
            </tbody>
          </table>
        </div>
      );
  }
  else {
    const reservations = await prisma.reservation.findMany({ where: { userId: "clixb60s300002xdwfogq7ahg" }, include: { room: true }, orderBy: { date: 'desc'}});

      return (
        <div className="overflow-x-auto">
          <table className='table table-pin-cols pt-10'>
            <thead>
              <tr>
                <th className='z-0'>Reservation ID</th>
                <th className='text-center'>Status</th>
                <th className='z-0'>Room Name</th>
                <th className='z-0'>Reservation Date</th>
                <th className='z-0'>Start Time</th>
                <th className='z-0'>End Time</th>
                <th className='z-0'></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                return <ReservationEntry key={reservation.id} reservation={reservation}/>;
              })}
            </tbody>
          </table>
        </div>
      );
  }
  return <p>o no</p>;
}
