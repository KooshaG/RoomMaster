"use client";

import { type Reservation, type Room } from "@prisma/client";
import convert from '@/lib/timeConvert';
import RemoveReservationButton from "../button/RemoveReservationButton";

interface ReservationEntryProps {
  reservation: Reservation & {room: Room}
};

const dateDiff = (date1: Date, date2: Date) => {
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function ReservationEntry(props: ReservationEntryProps) {

  // determine if the reservation is today (0), in the future (>0), or in the past (<0)
  const daysFromToday = dateDiff(new Date(), props.reservation.date);

  return (
    <tr className='hover'>
      <td>{props.reservation.id ?? "null"}</td>
      <td className="text-center"><ReservationBadge days={daysFromToday}/></td>
      <td>{props.reservation.room.name ?? "null"}</td>
      <td>{props.reservation.date.toLocaleDateString("en-CA", {weekday: 'long', month: 'long', day: '2-digit', year: 'numeric'})}</td>
      <td>{convert(props.reservation.startTime)}</td>
      <td>{convert(props.reservation.endTime)}</td>
      <td>{daysFromToday > 0 && <RemoveReservationButton reservationId={props.reservation.id}/>}</td>
    </tr>
  );
}

interface badgeProps {
  days: number
}

function ReservationBadge({days}: badgeProps) {
  if (days < 0) {
    return <div className="badge badge-default">Past</div>;
  }
  if (days > 0) {
    return <div className="badge badge-info">Upcoming</div>; 
  }
  else return <div className="badge badge-success">Today</div>;
}

