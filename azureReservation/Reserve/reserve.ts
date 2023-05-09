import { Context } from "@azure/functions";
import superagent = require("superagent");
import HTMLParser from "node-html-parser";
import { RoomAvailability } from "./Types";
import { getAllRoom } from "../prisma/functions/roomFuncs";
import { allUser } from "../prisma/functions/userFuncs";
import { User, Room, ReservationRequest, PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import type { Page, Browser } from "puppeteer";
import { reservationRequestByUser } from "../prisma/functions/reservationRequestFuncs";
import { createReservation, getReservation } from "../prisma/functions/reservationFuncs";

const prisma = new PrismaClient();

const LID = 2161;

let debug: Context | Console;

const reserve = async (context: Context | Console = console) => {
  // initialize constants
  debug = context;
  const rooms = await getAllRoom(prisma);
  const users = await allUser(prisma)

  // debug.log(rooms)
  
  for (const user of users){
    debug.log(`Making reservations for user ${user.username}`)
    const reservationRequests = await reservationRequestByUser(prisma, {userId: user.id})
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();


    for (const reservationRequest of reservationRequests) {
      const days = reservationDaysInTwoWeeksFromNow(reservationRequest);

      for (const day of days) {
        const thing = await getAvailabilityArray(day);
        let availableRoom: RoomAvailability[];
        let roomId: number;
        for (let i = 0; i < rooms.length; i++) {
          debug.log(`Room ${rooms[i].name}`);
          const roomAvailability = getRoomAvailabilityArray(thing, rooms[i]);
          const pendingReservation = isRoomAvailableInTime(
            roomAvailability,
            reservationRequest
          );
          if (pendingReservation) {
            availableRoom = pendingReservation;
            roomId = rooms[i].id
            debug.log(`${rooms[i].name} is available!`);
            i = rooms.length; // break out of loop
          }
        }
        if (!availableRoom) {
          // not possible to make reservation on this day 😥, go to next day
          debug.log(`No rooms available for ${day.toLocaleDateString()}`);
        } else {
          // check if person already has a reservation on that day to save time with useless requests
          const reservationCheck = await getReservation(prisma, {userId: user.id, daySinceEpoch: daySinceEpoch(dateFromReservation(availableRoom))})
          if (!reservationCheck) {
            const res = await makeRequest(availableRoom, page, user, roomId)
            debug.log(`Reservation made on ${day.toLocaleDateString()} for ${user.username} at ${rooms.filter(r => r.id === roomId)[0].name}`)
            // sleep for a while for emails to be sent
            await new Promise(r => setTimeout(r, 30000));
          }
          else debug.log("Reservation was already made on this day!")
        }
      }
    }

    debug.log('okay im done now')
    await browser.close()
  }
};

const reservationDaysInTwoWeeksFromNow = (
  reservationRequest: ReservationRequest
) => {
  const dayDelta = (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  };
  console.log(`Reservation request day: ${reservationRequest.dow}`);
  const now = Date.now();
  console.log(`Now: ${new Date(now).toDateString()}`);
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
  console.log(`Dates found: ${dates}`);
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
  if (!roomArray[0]) return false;
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
      // debug.log(
      //   `${start.toLocaleTimeString()} > ${slotStartTime.toLocaleTimeString()} > ${end.toLocaleTimeString()}`
      // );
    } else {
      // slot not in time, reset the counter, we don't need to reset the array because it won't be possible for us to get 2 sets of availabilies that are within time
      // debug.log(`${slotStartTime.toLocaleTimeString()}`);
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

const daySinceEpoch = (date = new Date()) => {
  return Math.floor((date.getTime() - new Date(0).getTime()) / 1000 / 86400);
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

const LIBCAL_AUTH_REGEX_CHECK = new RegExp(/<h2>Redirecting \.\.\.<\/h2>/g);
const LIBCAL_SUBMIT_TIMES_REGEX_CHECK = new RegExp(/Booking Details -/);

const makeRequest = async (slotsToReserve: RoomAvailability[], page: Page, user: User, roomId: number) => {
  const getAuth = async (page: Page) => {
    const userNameInput = await page.waitForSelector("#userNameInput");
    const passwordInput = await page.waitForSelector("#passwordInput");
    const submitButton = await page.waitForSelector("#submitButton");

    await userNameInput.type(user.username);
    await passwordInput.type(user.password);
    await submitButton.click({ delay: 300 });

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const res = await page.content();

    return res;
  };

  const createCartUrl = `${CONCORDIA_LIBCAL_URL}/ajax/space/createcart`;
  const data = new URLSearchParams(createFormForRequest(slotsToReserve)); // bro 2 weeks for this

  await page.setRequestInterception(true);
  page.once("request", (request) => {
    request.continue({
      method: "POST",
      postData: data.toString(),
      headers: {
        ...HEADERS,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  });
  let content: string = "";
  await page.goto(createCartUrl);
  await page.setRequestInterception(false);
  const createCartRes = await page.content();
  const createCartRedirect = `${CONCORDIA_LIBCAL_URL}${
    createCartRes.match(/{"success":true,"redirect":"(.*)"}/)[1]
  }`;

  await page.goto(createCartRedirect);
  content = await page.content();
  const isNotAuth =
    !!content.match(LIBCAL_AUTH_REGEX_CHECK) ||
    !!content.match(/<title>Sign In<\/title>/); // If there is a match here, we are getting redirected to the auth check page
  if (isNotAuth) {
    await getAuth(page);
    console.log("auth time :)");
  }

  const confirmationPage = await page.content();
  const atConfirmationPage = !!confirmationPage.match(
    LIBCAL_SUBMIT_TIMES_REGEX_CHECK
  );
  if (!atConfirmationPage) {
    throw new Error("Not at confirmation page");
  }

  const submitButton = await page.waitForSelector("#btn-form-submit");
  await submitButton.click({ delay: 300 });

  // add reservation to database
  const dateSinceEpoch = daySinceEpoch(dateFromReservation(slotsToReserve))
  const reservation = await createReservation(prisma, {daySinceEpoch: dateSinceEpoch, roomId: roomId, userId: user.id})

  page.goto(
    "https://concordiauniversity.libcal.com/r/accessible/availability?lid=2161&zone=0&gid=5032&capacity=2&space=0"
  );

  return reservation;
};

reserve(console);

prisma.$disconnect();


export default reserve