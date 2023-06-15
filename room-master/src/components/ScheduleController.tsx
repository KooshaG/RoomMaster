"use client";

import { type ReservationRequest } from "@prisma/client";
import { days, endTimes, startTimes } from "@/lib/reservationConst";
import { type Session } from "next-auth";
import { useState } from "react";

type Props = {
  session: Session
  reservationRequests: ReservationRequest[]
}



export default function ScheduleController({session, reservationRequests}: Props) {

  const [reservationSchedule, setReservationSchedule] = useState(reservationRequests);
  const []

}

export function ReservationSelector() {}








