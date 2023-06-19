"use client";

import { type ReservationRequest } from "@prisma/client";
import { days } from "@/lib/reservationConst";
import { useEffect, useState, useRef } from "react";
import ReservationSelector from "./ReservationSelector";

type Props = {
  reservationRequests: ReservationRequest[]
}

export default function ScheduleController({reservationRequests}: Props) {

  const initialReservationRequestsArray: (Partial<ReservationRequest> | false)[] = [...reservationRequests, ...Array(3 - reservationRequests.length).fill(false)];

  const [reservationSchedule, setReservationSchedule] = useState(initialReservationRequestsArray);
  const [availableDays, setAvailableDays] = useState(days);
  const [numRequests, setNumRequests] = useState(reservationRequests.length);
  const [validSchedule, setValidSchedule] = useState<boolean>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const timeoutID = useRef<NodeJS.Timeout>();

  // check that the reservation schedule is valid
  useEffect(() => {
    let valid = true;
    let falseHappened = false;
    let numFalses = 0;
    reservationSchedule.forEach(request => {
      if (request === false) {
        falseHappened = true;
        numFalses++;
      }
      else if (request.dow?.startsWith("Select") || request.endTime?.endsWith("Time") || request.startTime?.endsWith("Time") || request.slots30mins === 0) valid = false;
      else if (request.iso_weekday && falseHappened) valid = false; 
      else return;
    });
    if (3-numFalses !== numRequests) valid = false;
    setValidSchedule(valid);
  }, [reservationSchedule, numRequests]);

  // clear request
  useEffect(() => {
    setReservationSchedule((curr) => [...curr.slice(0, numRequests), ...Array(3 - numRequests).fill(false)]);
  }, [numRequests]);

  async function handleScheduleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(reservationSchedule.filter(request => request !== false))
    });
    setSubmitting(false);
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
    if (res.status === 200) {
      setToastVisible(true);
      timeoutID.current = setTimeout(() => setToastVisible(false), 2000);
    }
  }

  return (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-10">
      {[...Array(numRequests)].map((_,i) => {
        return (
          <div key={i} >
            <ReservationSelector days={availableDays} setDays={setAvailableDays} reservationIndex={i} reservatonRequest={reservationSchedule[i]} reservatonRequestArray={reservationSchedule} setReservatonRequest={setReservationSchedule}/>
          </div>
        );
        })}
    </div>
    <div className="flex flex-col self-center gap-4 ">
      <div className="join join-vertical sm:join-horizontal">
        <button className={`btn sm:w-[20rem] ${numRequests === 0 ? "hidden" : ""} ${numRequests === 3 ? "" : "join-item"}`} onClick={() => setNumRequests((curr) => curr-1)}>
          - Day
        </button>
        <button className={`btn btn-primary sm:w-[20rem] ${numRequests === 3 ? "hidden" : ""} ${numRequests === 0 ? "" : "join-item"}`} onClick={() => setNumRequests((curr) => curr+1)}>
          + Day
        </button>
      </div>
      <div className="divider"></div>
      <button className={`btn ${validSchedule && !submitting ? "btn-primary" : "btn-disabled btn-outline"} self-center w-full sm:w-[20rem]`} onClick={handleScheduleSubmit}>
        {validSchedule ? "Submit Schedule" : "Invalid Schedule"}
      </button>
    </div>
    <div className={`toast ${toastVisible ? "" : "hidden"}`}>
      <div className="alert alert-success">
        <span>Schedule submitted successfully!</span>
      </div>
    </div>
  </div>
  );
}
