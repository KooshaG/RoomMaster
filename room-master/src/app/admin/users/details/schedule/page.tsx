import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dynamic from 'next/dynamic';
import { prisma } from "@/prismaClient"

const ReservationEntry = dynamic(() => import('@/components/Reservation/ReservationEntry'), {ssr: false});

export default async function UserDetails({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions)
  const userId = searchParams.user as String
  if (session && session.user.id && session.user.admin) {
    const user = await prisma.user.findUnique({ where: { id: userId as string } })
    if (!user) return <p>User not found</p>
    const reservations = await prisma.reservation.findMany({ where: { userId: user.id }, include: { room: true }, orderBy: { date: 'desc'}})

    return (
      <>
        <h1 className="text-2xl font-semibold">{`${user.name}'s Reservations`}</h1>
        <div className="overflow-x-auto">
          <table className='table pt-10'>
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
      </>
    );
  }
  return <p>o no</p>
}