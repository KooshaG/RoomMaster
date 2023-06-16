"use client";

import { type ReservationRequest } from "@prisma/client";
import { days } from "@/lib/reservationConst";
import { type Session } from "next-auth";
import { useState } from "react";
import ReservationSelector from "./ReservationSelector";

type Props = {
  session: Session | null
  reservationRequests: ReservationRequest[]
}



export default function ScheduleController({session, reservationRequests}: Props) {

  const initialReservationRequestsArray: (Partial<ReservationRequest> | false)[] = [...reservationRequests, ...Array(3 - reservationRequests.length).fill(false)];

  const [reservationSchedule, setReservationSchedule] = useState(initialReservationRequestsArray);
  const [availableDays, setAvailableDays] = useState(days);
  const [numRequests, setNumRequests] = useState(reservationRequests.length);

  return (
  <div className="flex flex-col gap-8">
    <pre>{JSON.stringify(reservationSchedule, null, 2)}</pre>
    <div className="self-center">
      <label className="label">
        <span className="label-text">Number of Reservations</span>
      </label>
      <select defaultValue={numRequests} onChange={(e) => setNumRequests(parseInt(e.target.value))} className="select select-bordered w-full sm:w-[20rem]">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>
    <div className="flex flex-col gap-10">
      {[...Array(numRequests)].map((_,i) => {
        return (
          <div key={i} >
            <ReservationSelector days={availableDays} setDays={setAvailableDays} reservationIndex={i} reservatonRequest={reservationSchedule[i]} reservatonRequestArray={reservationSchedule} setReservatonRequest={setReservationSchedule}/>
          </div>
        );
        })}
    </div>

    
  </div>
  );


}










