import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/prismaClient';
import convert from '@/lib/timeConvert';
import InfoCard from '../UI/InfoCard';

interface ScheduleViewProps {
  userId?: string;
}

export default async function ScheduleView({ userId }: ScheduleViewProps) {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    // if userId exists, fetch user data
    // else get current user data
    if (!session.user.admin && userId !== session.user.id) {
      return <p>Unauthorized</p>;
    }
    let userName = "null";
    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          name: true
        }
      });
      userName = user?.name ?? "null";
    }
    const reservationSchedule = await prisma.reservationRequest.findMany({
      where: {
        userId: userId ?? session.user.id
      },
      orderBy: {
        dow: 'asc'
      }
    });
    if (reservationSchedule.length === 0) {
      return (
        <InfoCard title={`${userId && userId !== session.user.id ? `${userName}'s` : "Your "} Reservation Schedule`}>
          <p>No reservation schedule exists!</p>
        </InfoCard>
      );
    }
    return (
      <InfoCard title={`${userId && userId !== session.user.id ? `${userName}'s` : "Your "} Reservation Schedule`}>
        <ul className="list-disc list-inside">
          {reservationSchedule.map((request, i) => {
            return (
              <li key={i}>{request.dow} @ {convert(request.startTime)} to {convert(request.endTime)}</li>
            );
          })}
        </ul>
      </InfoCard>
    );
  }
  return <p>o no</p>;
}

