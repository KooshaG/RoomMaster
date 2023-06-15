"use client";

import { type ReservationRequest } from "@prisma/client";
import { days, fullTimes, startTimes } from "@/lib/reservationConst";
import { type Session } from "next-auth";
import { useState } from "react";

type Props = {
  session: Session | null
  reservationRequests: ReservationRequest[]
}



export default function ScheduleController({session, reservationRequests}: Props) {

  // const [reservationSchedule, setReservationSchedule] = useState(reservationRequests);
  const [selected, setSelected] = useState("");

  return(
  <>
  <select onChange={e => setSelected(e.target.value)} className="select select-bordered w-full max-w-xs">
    <option disabled selected>Start Time</option>
    {fullTimes.slice(0, fullTimes.length-1).map(time => <option key={time}>{`${time.split(':')[0]}:${time.split(':')[1]}`}</option>)}
  </select>
    <p>{selected}</p>
  </>
  );


}

export function ReservationSelector() {}








