import { User, Room, ReservationRequest } from '@prisma/client'
import superagent = require('superagent')
import HTMLParser from 'node-html-parser'
import { RoomAvailability } from './Types'

const mockUser: User = {
  id: 4,
  username: "hi",
  password: "nice"
}

const mockReservationRequest: ReservationRequest = {
  id: 1,
  dow: "Monday",
  iso_weekday: 2,
  startTime: "10:30:00",
  endTime: "13:30:00",
  slots30mins: 6,
  userId: 4
}



const reserve = async () => {
  const days = reservationDaysInTwoWeeksFromNow(mockReservationRequest)
  days.forEach((day) => {
    console.log(day.toDateString())
  })
  const thing = await getAvailabilityArray(days[0])
  console.log(thing[0])
  console.log(thing.length)
}

const reservationDaysInTwoWeeksFromNow = (reservationRequest: ReservationRequest) => {
  
  const dayDelta = (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  }

  const now = Date.now();
  let dates: Date[] = [];
  const diff = reservationRequest.iso_weekday - new Date(now).getDay();
  if (diff === 0){
    dates.push(new Date(now));
    dates.push(new Date(now + dayDelta(7)));
    dates.push(new Date(now + dayDelta(14)))
  } else if (diff < 0){
    dates.push(new Date(now + dayDelta(diff+7)))
    dates.push(new Date(now + dayDelta(diff+14)))
  } else {
    dates.push(new Date(now + dayDelta(diff)))
    dates.push(new Date(now + dayDelta(diff+7)))
  }
  return dates
}

const getAvailabilityArray = async (date: Date, LID = 2161) => {
  
  const createDateStringForRequest = (date: Date) => {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`
  }

  const startString = createDateStringForRequest(date)
  const url = `https://concordiauniversity.libcal.com/r/accessible/availability?lid=${LID}&date=${startString}`;
  const res = await superagent.get(url)
  const root = HTMLParser.parse(res.text)
  const divs = root.querySelectorAll("div.panel.panel-default")
  const inputs = divs.map(div => {
    return div.getElementsByTagName('input')
  }).flat()
  // we now have a flat array of inputs that have all the information of the availabilities
  const availabilities = inputs.map(input => {
    const attributes = input.attributes
    const availability: RoomAvailability = {
      start: attributes["data-start"],
      end: attributes["data-end"],
      seat_id: attributes["data-seat"],
      lid: LID,
      eid: parseInt(attributes["data-eid"]),
      checksum: attributes["data-crc"]
    }
    return availability
  })
  return availabilities
}

const getRoomAvailabilityArray = (availabilityArray: RoomAvailability[], room: Room) => {
  
}

reserve()