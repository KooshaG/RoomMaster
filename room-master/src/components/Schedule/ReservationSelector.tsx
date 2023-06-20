
import { type ChangeEvent, useState, type SetStateAction, type Dispatch, useEffect } from 'react';
import { fullTimes } from '@/lib/reservationConst';
import { type ReservationRequest } from '@prisma/client';
import convert from '@/lib/timeConvert';

type Props = {
  days: Day[];
  setDays: Dispatch<
    SetStateAction<
      {
        dayName: string;
        isoDay: number;
        selected: boolean;
      }[]
    >
  >;
  reservatonRequest: (Partial<ReservationRequest> | false)
  reservatonRequestArray: (Partial<ReservationRequest> | false)[]
  setReservatonRequest: Dispatch<SetStateAction<(false | Partial<ReservationRequest>)[]>>
  reservationIndex: number
};

type Day = {
  dayName: string;
  isoDay: number;
  selected: boolean;
};

export default function ReservationSelector({ days, setDays, reservatonRequest, reservatonRequestArray, setReservatonRequest, reservationIndex }: Props) {
  const [selectedStart, setSelectedStart] = useState<string>(reservatonRequest && reservatonRequest.startTime ? reservatonRequest.startTime : 'Start Time');
  const [selectedEnd, setSelectedEnd] = useState<string>(reservatonRequest && reservatonRequest.endTime ? reservatonRequest.endTime : 'End Time');
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day>();

  // When the component is removed, clear the selected day
  useEffect(() => {
    return () => {
      if (selectedDay) {
        const oldDayIndex = selectedDay?.isoDay;
        setDays((curr) => [
          ...curr.slice(0, oldDayIndex),
          { dayName: curr[oldDayIndex].dayName, isoDay: oldDayIndex, selected: false },
          ...curr.slice(oldDayIndex + 1),
        ]);
      }
    };
  }, [setDays, selectedDay]);

  // whenever the information of the selected day changes, update the schedule and when the component is removed, remove the request
  useEffect(() => {
    const newRequestArray = reservatonRequestArray.map((request, i) => {
      if (i === reservationIndex && selectedDay && selectedStart && selectedEnd) {
        const newRequest: Partial<ReservationRequest> = {
          dow: selectedDay.dayName,
          iso_weekday: selectedDay?.isoDay,
          startTime: selectedStart,
          endTime: selectedEnd,
          slots30mins: availableEndTimes.findIndex(time => selectedEnd === time) + 1
        };
        return newRequest;
      }
      return request;
    });
    setReservatonRequest(newRequestArray);
  }, [availableEndTimes, reservationIndex, selectedDay, selectedEnd, selectedStart, setReservatonRequest]);

  useEffect(() => {
    // set day if reservation request already exists
    if (reservatonRequest && reservatonRequest.dow && reservatonRequest.iso_weekday) {
      const dayIndex = reservatonRequest.iso_weekday;
      setSelectedDay({ ...days[dayIndex], selected: true });
      setDays((curr) => [
        ...curr.slice(0, dayIndex),
        { dayName: curr[dayIndex].dayName, isoDay: dayIndex, selected: true },
        ...curr.slice(dayIndex + 1),
      ]);
    }
    // set end time if reservation request already exists
    if (reservatonRequest && reservatonRequest.startTime) {
      const timeIndex = fullTimes.findIndex(time => reservatonRequest.startTime === time) + 1;
      const times = fullTimes.slice(timeIndex, timeIndex + 6);
      setAvailableEndTimes(times);
    }
  }, []);

  function handleStartChange(event: ChangeEvent<HTMLSelectElement>) {
    const timeIndex = event.target.options.selectedIndex;
    setSelectedStart(event.target.value);
    const times = fullTimes.slice(timeIndex, timeIndex + 6);
    setAvailableEndTimes(times);
    setSelectedEnd(fullTimes[timeIndex]); // TODO: the selected end always changes but it would be nice if it didnt change if the selected end was still valid
  }

  function handleDayChange(event: ChangeEvent<HTMLSelectElement>) {
    // set the current day if it exists to not selected and set the new day to be selected
    if (event.target.value === "Select Day") return;
    if (selectedDay) {
      const oldDayIndex = selectedDay?.isoDay;
      setDays((curr) => [
        ...curr.slice(0, oldDayIndex),
        { dayName: curr[oldDayIndex].dayName, isoDay: oldDayIndex, selected: false },
        ...curr.slice(oldDayIndex + 1),
      ]);
    }

    const newDayIndex = parseInt(event.target.value);
    setDays((curr) => [
      ...curr.slice(0, newDayIndex),
      { dayName: curr[newDayIndex].dayName, isoDay: newDayIndex, selected: true },
      ...curr.slice(newDayIndex + 1),
    ]);
    setSelectedDay({ ...days[newDayIndex], selected: true });
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <select value={selectedDay?.isoDay ?? -1} onChange={handleDayChange} className='select select-bordered w-full sm:w-[20rem]'>
        <option disabled value="-1">Select Day</option>
        {days
          .filter((day) => !day.selected || day.isoDay === selectedDay?.isoDay)
          .map((day) => (
            <option key={day.isoDay} value={day.isoDay}>{`${day.dayName}`}</option>
          ))}
      </select>

      <select
        value={selectedStart}
        disabled={!selectedDay}
        onChange={handleStartChange}
        className='select select-bordered w-full sm:w-[20rem]'
      >
        <option disabled>Start Time</option>
        {fullTimes.slice(0, fullTimes.length - 1).map((time) => (
          <option key={time} value={time}>{convert(time)}</option>
        ))}
      </select>

      <select
        value={selectedEnd.endsWith("M") ? convert(selectedEnd) : selectedEnd}
        disabled={selectedStart === 'Start Time'}
        onChange={(e) => setSelectedEnd(availableEndTimes[e.target.options.selectedIndex - 1])}
        className='select select-bordered w-full sm:w-[20rem]'
      >
        <option disabled>End Time</option>
        {availableEndTimes.map((time) => (
          <option key={time} value={time}>{convert(time)}</option>
        ))}
      </select>
    </div>
  );
}
