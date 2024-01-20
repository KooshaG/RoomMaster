import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/prismaClient';
import timeConvert from '@/lib/timeConvert';

interface Alert {
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const dateDiff = (date1: Date, date2: Date) => {
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default async function AlertController() {
  const session = await getServerSession(authOptions);

  let alerts: Alert[] = [];

  // user isnt verified
  if (session && !session.user?.verified) {
    const alert: Alert = {
      level: 'warning',
      message:
        'Warning: You are not verified, you can use the website normally but reservations will not be made for you.',
    };
    alerts.push(alert);
  }

  if (!session) {
    const today = new Date();
    today.setHours(today.getHours() - 5); // correct for tz
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    console.log(today);
    console.log(today.getTimezoneOffset())
    const reservation = await prisma.reservation.findFirst({
      where: {
        userId: "clixb60s300002xdwfogq7ahg",
        date: { gte: today },
      },
      include: {
        room: { select: { name: true } },
      },
      orderBy: {
        date: 'asc',
      },
    });
    if (reservation) {
      // check if the first reservation is today (reservations are max 14 days in advance so checking just the day is okay)
      if (today.getDay() === reservation.date.getDay()) {
        const alert: Alert = {
          level: 'success',
          message: `You have a reservation today from ${timeConvert(reservation.startTime)} to ${timeConvert(
            reservation.endTime
          )} at ${reservation.room.name}`,
        };
        alerts.push(alert);
      } else {
        const alert: Alert = {
          level: 'info',
          message: `You have an upcoming reservation on ${reservation.date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
          })} from ${timeConvert(reservation.startTime)} to ${timeConvert(reservation.endTime)} at ${
            reservation.room.name
          }`,
        };
        alerts.push(alert);
      }
    }
  }

  // get user upcoming reservations
  if (session && session.user.id) {
    const today = new Date();
    today.setHours(today.getHours() - today.getTimezoneOffset() / 60); // correct for tz
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    console.log(today);
    console.log(today.getTimezoneOffset())
    const reservation = await prisma.reservation.findFirst({
      where: {
        userId: session.user.id,
        date: { gte: today },
      },
      include: {
        room: { select: { name: true } },
      },
      orderBy: {
        date: 'asc',
      },
    });
    if (reservation) {
      // check if the first reservation is today (reservations are max 14 days in advance so checking just the day is okay)
      if (today.getDay() === reservation.date.getDay()) {
        const alert: Alert = {
          level: 'success',
          message: `You have a reservation today from ${timeConvert(reservation.startTime)} to ${timeConvert(
            reservation.endTime
          )} at ${reservation.room.name}`,
        };
        alerts.push(alert);
      } else {
        const alert: Alert = {
          level: 'info',
          message: `You have an upcoming reservation on ${reservation.date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
          })} from ${timeConvert(reservation.startTime)} to ${timeConvert(reservation.endTime)} at ${
            reservation.room.name
          }`,
        };
        alerts.push(alert);
      }
    }
  }

  return (
    <>
      {alerts.map((alert, i) => {
        // idk why but this is the only way i got conditional classes working
        return (
          <div
            key={i}
            className={`alert join-item ${alert.level === 'info' ? 'alert-info' : ''}${alert.level === 'warning' ? 'alert-warning' : ''}
            ${alert.level === 'error' ? 'alert-error' : ''}${alert.level === 'success' ? 'alert-success' : ''}`}
          >
            <Icon name={alert.level} />
            <span>{alert.message}</span>
          </div>
        );
      })}
    </>
  );
}

function Icon(props: { name: Alert['level'] }) {
  switch (props.name) {
    case 'info':
      return <Info />;
    case 'warning':
      return <AlertTriangle />;
    case 'error':
      return <XCircle />;
    case 'success':
      return <CheckCircle2 />;

    default:
      return <></>;
  }
}
