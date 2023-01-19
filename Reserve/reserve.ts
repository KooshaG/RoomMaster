import { User, Room, ReservationRequest, PrismaClient } from "@prisma/client";
import superagent = require("superagent");
import HTMLParser from "node-html-parser";
import { RoomAvailability } from "./Types";
import { getAllRoom } from "../prisma/functions/roomFuncs";

const prisma = new PrismaClient();

const LID = 2161;

const mockUser: User = {
  id: 4,
  username: "hi",
  password: "nice",
};

const mockReservationRequest: ReservationRequest = {
  id: 1,
  dow: "Tuesday",
  iso_weekday: 2,
  startTime: "10:30:00",
  endTime: "13:30:00",
  slots30mins: 6,
  userId: 4,
};

const reserve = async () => {
  const rooms = await getAllRoom(prisma);
  const days = reservationDaysInTwoWeeksFromNow(mockReservationRequest);
  days.forEach((day) => {
    console.log(day.toDateString());
  });
  const thing = await getAvailabilityArray(days[1]);
  console.log(thing[0]);
  console.log(thing.length);
  const room1 = getRoomAvailabilityArray(thing, rooms[1]);
  console.log(isRoomAvailableInTime(room1, mockReservationRequest));
  rooms.forEach((room) => {
    const roomAvailability = getRoomAvailabilityArray(thing, room);
    const pendingReservation = isRoomAvailableInTime(roomAvailability, mockReservationRequest)
    if (pendingReservation) {
      console.log(createFormForRequest(pendingReservation))
    }
  })

};

const reservationDaysInTwoWeeksFromNow = (
  reservationRequest: ReservationRequest
) => {
  const dayDelta = (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  };

  const now = Date.now();
  let dates: Date[] = [];
  const diff = reservationRequest.iso_weekday - new Date(now).getDay();
  if (diff === 0) {
    dates.push(new Date(now));
    dates.push(new Date(now + dayDelta(7)));
    dates.push(new Date(now + dayDelta(14)));
  } else if (diff < 0) {
    dates.push(new Date(now + dayDelta(diff + 7)));
    dates.push(new Date(now + dayDelta(diff + 14)));
  } else {
    dates.push(new Date(now + dayDelta(diff)));
    dates.push(new Date(now + dayDelta(diff + 7)));
  }
  return dates;
};

const getAvailabilityArray = async (date: Date, LID = 2161) => {
  const createDateStringForRequest = (date: Date) => {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`;
  };

  const startString = createDateStringForRequest(date);
  const url = `https://concordiauniversity.libcal.com/r/accessible/availability?lid=${LID}&date=${startString}`;
  const res = await superagent.get(url);
  const root = HTMLParser.parse(res.text);
  const divs = root.querySelectorAll("div.panel.panel-default");
  const inputs = divs
    .map((div) => {
      return div.getElementsByTagName("input");
    })
    .flat();
  // we now have a flat array of inputs that have all the information of the availabilities
  const availabilities = inputs.map((input) => {
    const attributes = input.attributes;
    const availability: RoomAvailability = {
      start: attributes["data-start"],
      end: attributes["data-end"],
      seat_id: attributes["data-seat"],
      lid: LID,
      eid: parseInt(attributes["data-eid"]),
      checksum: attributes["data-crc"],
    };
    return availability;
  });
  return availabilities;
};

const getRoomAvailabilityArray = (
  availabilityArray: RoomAvailability[],
  room: Room
) => {
  return availabilityArray.filter((availability) => {
    return availability.eid === room.eid;
  });
};

const isRoomAvailableInTime = (
  roomArray: RoomAvailability[],
  reservationRequest: ReservationRequest
) => {
  const [year, month, day] = roomArray[0].start.split(" ")[0].split("-").map(x => parseInt(x));
  const [startHour, startMinute, startSecond] = reservationRequest.startTime.split(':').map(x => parseInt(x));
  const [endHour, endMinute, endSecond] = reservationRequest.endTime.split(':').map(x => parseInt(x));

  const start = new Date(year, month, day, startHour, startMinute, startSecond);
  const end = new Date(year, month, day, endHour, endMinute, endSecond);

  let slotsInTime: RoomAvailability[] = [];
  let consecutiveSlots = reservationRequest.slots30mins;

  for (const availability of roomArray) {
    const [hour, minute, second] = availability.start.split(' ')[1].split(':').map(x => parseInt(x));
    const slotStartTime = new Date(year, month, day, hour, minute, second);
  
    if (consecutiveSlots === 0){
      // we found a place where all of the slots needed are free, end now
      return slotsInTime;
    }

    if ((slotStartTime >= start) && (slotStartTime <= end)) {
      // slot is between the start and end times we want
      consecutiveSlots--;
      slotsInTime.push(availability);
      console.log(`${start.toLocaleTimeString()} > ${slotStartTime.toLocaleTimeString()} > ${end.toLocaleTimeString()}`)
    } else {
      // slot not in time, reset the counter, we don't need to reset the array because it won't be possible for us to get 2 sets of availabilies that are within time
      console.log(`${slotStartTime.toLocaleTimeString()}`)
      consecutiveSlots = reservationRequest.slots30mins;
    }
  }
  if (consecutiveSlots === 0) return slotsInTime;
  else return false
};

const createFormForRequest = (slots: RoomAvailability[]) => {
  let form = {
    "libAuth": "true",
    "blowAwayCart": "true",
    "method": 14,
    "returnUrl": `/r/accessible?lid=${LID}&gid=5032&zone=0&space=0&capacity=2&accessible=0&powered=0`
  }
  slots.forEach((slot, index) => {
    Object.keys(slot).forEach(key => {
      form[`bookings[${index}][${key}]`] = slot[key]
    });
  })
  return form
}



reserve();

prisma.$disconnect();
