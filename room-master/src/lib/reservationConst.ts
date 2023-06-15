export const days = [
  { 
    dayName: "Sunday",
    isoDay: "0",
    selected: false,
  },
  { 
    dayName: "Monday",
    isoDay: "1",
    selected: false,
  },
  { 
    dayName: "Tuesday",
    isoDay: "2",
    selected: false,
  },
  { 
    dayName: "Wednesday",
    isoDay: "3",
    selected: false,
  },
  { 
    dayName: "Thursday",
    isoDay: "4",
    selected: false,
  },
  { 
    dayName: "Friday",
    isoDay: "5",
    selected: false,
  },
  { 
    dayName: "Saturday",
    isoDay: "6",
    selected: false,
  },
];

export const commonTime = [
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
  "17:00:00",
  "17:30:00",
  "18:00:00",
  "18:30:00",
  "19:00:00",
  "19:30:00",
  "20:00:00",
  "20:30:00",
  "21:00:00",
  "21:30:00",
];

export const startTimes = ["09:00:00", ...commonTime];
export const endTimes = [...commonTime, "22:00:00"];
