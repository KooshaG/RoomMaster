import { Context } from "@azure/functions";
import superagent = require("superagent");
import HTMLParser from "node-html-parser";
import { RoomAvailability } from "./Types";
import { getAllRoom } from "../prisma/functions/roomFuncs";
import { User, Room, ReservationRequest, PrismaClient } from "@prisma/client";

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
  startTime: "18:30:00",
  endTime: "20:30:00",
  slots30mins: 4,
  userId: 4,
};



let debug: Context | Console;

const reserve = async (context: Context | Console = console) => {
  debug = context;
  const rooms = await getAllRoom(prisma);
  const days = reservationDaysInTwoWeeksFromNow(mockReservationRequest);
  const thing = await getAvailabilityArray(days[1]);
  let availableRooms: RoomAvailability[][] = []
  rooms.forEach(async (room) => {
    debug.log(`Room ${room.name}`)
    const roomAvailability = getRoomAvailabilityArray(thing, room);
    const pendingReservation = isRoomAvailableInTime(
      roomAvailability,
      mockReservationRequest
    );
    if (pendingReservation) {
      availableRooms.push(pendingReservation)
    }
  });
  console.log((await makeRequest(availableRooms[0])).text)
  debug.log(daysSinceEpoch());
};

const reservationDaysInTwoWeeksFromNow = (
  reservationRequest: ReservationRequest
) => {
  const dayDelta = (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  };
  debug.log(`Reservation request day: ${reservationRequest.dow}`);
  const now = Date.now();
  debug.log(`Now: ${new Date(now).toDateString()}`);
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
  debug.log(`Dates found: ${dates}`);
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
  const [year, month, day] = roomArray[0].start
    .split(" ")[0]
    .split("-")
    .map((x) => parseInt(x));
  const [startHour, startMinute, startSecond] = reservationRequest.startTime
    .split(":")
    .map((x) => parseInt(x));
  const [endHour, endMinute, endSecond] = reservationRequest.endTime
    .split(":")
    .map((x) => parseInt(x));

  const start = new Date(year, month, day, startHour, startMinute, startSecond);
  const end = new Date(year, month, day, endHour, endMinute, endSecond);

  let slotsInTime: RoomAvailability[] = [];
  let consecutiveSlots = reservationRequest.slots30mins;

  for (const availability of roomArray) {
    const [hour, minute, second] = availability.start
      .split(" ")[1]
      .split(":")
      .map((x) => parseInt(x));
    const slotStartTime = new Date(year, month, day, hour, minute, second);

    if (consecutiveSlots === 0) {
      // we found a place where all of the slots needed are free, end now
      return slotsInTime;
    }

    if (slotStartTime >= start && slotStartTime <= end) {
      // slot is between the start and end times we want
      consecutiveSlots--;
      slotsInTime.push(availability);
      debug.log(`${start.toLocaleTimeString()} > ${slotStartTime.toLocaleTimeString()} > ${end.toLocaleTimeString()}`)
    } else {
      // slot not in time, reset the counter, we don't need to reset the array because it won't be possible for us to get 2 sets of availabilies that are within time
      debug.log(`${slotStartTime.toLocaleTimeString()}`)
      consecutiveSlots = reservationRequest.slots30mins;
    }
  }
  if (consecutiveSlots === 0) return slotsInTime;
  else return false;
};

const createFormForRequest = (slots: RoomAvailability[]) => {
  let form = {
    libAuth: "true",
    blowAwayCart: "true",
    method: "14",
    returnUrl: `/r/accessible?lid=${LID}&gid=5032&zone=0&space=0&capacity=2&accessible=0&powered=0`,
  };
  slots.forEach((slot, index) => {
    Object.keys(slot).forEach((key) => {
      form[`bookings[${index}][${key}]`] = slot[key];
    });
  });
  return form;
};

const daysSinceEpoch = (date = new Date()) => {
  return Math.abs((date.getTime() - new Date(0).getTime()) / 1000 / 86400);
};

const dateFromReservation = (reservation: RoomAvailability[]) => {
  const [year, month, day] = reservation[0].start
    .split(" ")[0]
    .split("-")
    .map((x) => parseInt(x));
  return new Date(year, month - 1, day);
};

const CONCORDIA_LIBCAL_URL = "https://concordiauniversity.libcal.com";
const CONCORDIA_AUTH_URL = "https://fas.concordia.ca";

const HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Referer: "https://concordiauniversity.libcal.com/reserve/webster",
};

const LIBCAL_AUTH_REGEX_CHECK = new RegExp(/<h2>Redirecting \.\.\.<\/h2>/g)

const makeRequest = async (slotsToReserve: RoomAvailability[]) => {
  const getAuth = async (authCheckResText: string, agent: superagent.SuperAgentStatic & superagent.Request) => {
    let root = HTMLParser.parse(authCheckResText)
    const inputs = root.querySelector('#autoSAML').getElementsByTagName('input');
    
    let data: Record<string,string> = {}
    inputs.forEach(input => {
      data[input.getAttribute('name')] = input.getAttribute('value')
    })
    const libcalCookieAdderUrl = root.querySelector('#autoSAML').getAttribute('action')
    const libcalCookieAdderRes = await agent.get(libcalCookieAdderUrl).set(HEADERS).query(data)
    // console.log(libcalCookieAdderRes.text)
    root = HTMLParser.parse(libcalCookieAdderRes.text)
    data = {
      UserName: "k_gholip@live.concordia.ca",
      Password: "GmzFc3H0nD1",
      AuthMethod: "FormsAuthentication"
    }
    const microsoftAuthUrl = `${CONCORDIA_AUTH_URL}${root.querySelector("#loginForm").getAttribute("action")}`
    const microsoftAuthRes = await agent.post(microsoftAuthUrl).set(HEADERS).send(new URLSearchParams(data).toString())
    
    root = HTMLParser.parse(microsoftAuthRes.text)
    const concordiaAuthLinkUrl = root.getElementsByTagName('form')[0].getAttribute('action')
    const inputs2 = root.getElementsByTagName('input')
    data = {}
    inputs2.forEach(input => {
      if(input.getAttribute('type') === 'hidden'){
        data[input.getAttribute('name')] = input.getAttribute('value')
      }
    })
    console.log(concordiaAuthLinkUrl)
    console.log(data)
    try {
      const finalRes = await agent.post(concordiaAuthLinkUrl).set(HEADERS).send(new URLSearchParams(data).toString());
      console.log(finalRes.text);
      
    }
    catch (err) {
      // console.log('AUTH FAILED')
      // console.log('error')
      console.log(err)
    }

  }

  const agent = superagent.agent()

  const createCart = `${CONCORDIA_LIBCAL_URL}/ajax/space/createcart`;
  const data = new URLSearchParams(createFormForRequest(slotsToReserve)); // bro 2 weeks for this
  const createCartRes = await agent.post(createCart).set(HEADERS).send(data.toString())
  
  const authCheckUrl = `${CONCORDIA_LIBCAL_URL}${createCartRes.body['redirect']}`
  const authCheckRes = await agent.get(authCheckUrl).set(HEADERS)

  const isNotAuth = !!authCheckRes.text.match(LIBCAL_AUTH_REGEX_CHECK) // If there is a match here, we are getting redirected to the auth check page
  if(isNotAuth){
    await getAuth(authCheckRes.text, agent)
  }
  return authCheckRes

};

reserve(console);

prisma.$disconnect();
