"use client";

import { type ReservationRequest } from "@prisma/client";
import { days, fullTimes, startTimes } from "@/lib/reservationConst";
import { type Session } from "next-auth";
import { type ChangeEvent, useState } from "react";

type Props = {
  session: Session | null
  reservationRequests: ReservationRequest[]
}



export default function ScheduleController({session, reservationRequests}: Props) {

  // const [reservationSchedule, setReservationSchedule] = useState(reservationRequests);
  return <ReservationSelector/>;


}

export function ReservationSelector() {

  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);

  function handleStartChange(event: ChangeEvent<HTMLSelectElement>) {
    const timeIndex = event.target.options.selectedIndex;
    setSelectedStart(fullTimes[timeIndex - 1]);
    // console.log(event.target.options.selectedIndex);
    const times = fullTimes.slice(timeIndex, timeIndex + 6);
    setAvailableEndTimes(times);
    setSelectedEnd(fullTimes[timeIndex]); // TODO: the selected end always changes but it would be nice if it didnt change if the selected end was still valid
  }

  return(
  <>
    <select defaultValue="Start Time" onChange={handleStartChange} className="select select-bordered w-full max-w-xs">
      <option disabled>Start Time</option>
      {fullTimes.slice(0, fullTimes.length-1).map((time, index) => <option key={time} data-key={index}>{`${time.split(':')[0]}:${time.split(':')[1]}`}</option>)}
    </select>
    <p>{selectedStart}</p>
    <select defaultValue="End Time" disabled={selectedStart === ""} onChange={e => setSelectedEnd(e.target.value)} className="select select-bordered w-full max-w-xs">
      <option disabled>End Time</option>
      {availableEndTimes.map(time => <option key={time}>{`${time.split(':')[0]}:${time.split(':')[1]}`}</option>)}
    </select>
    <p>{selectedEnd}</p>
  </>
  );
  
}








