import { PrismaClient } from "@prisma/client";
import { createRoom } from "./roomFuncs";

const initRooms = async () => {
  const prisma = new PrismaClient();

  rooms.forEach(async room => {
    const obj = await createRoom(prisma, {name: room.name, tech: room.tech, eid: room.eid, priority: room.priority, seats: true})
    console.log(obj)
  })

  await prisma.$disconnect().then(() => {
    return
  })
  return
}



const rooms = [
  [
    {
      'eid': 18520,
      'tech': true,
      'name': 'LB 257 - Croatia',
      'priority': 1
    },
  ],
  [
    {
      'eid': 18518,
      'tech': false,
      'name': 'LB 251 - Luxembourg',
      'priority': 2
    },
    {
      'eid': 18522,
      'tech': false,
      'name': 'LB 259 - New Zealand',
      'priority': 2
    },
  ],
  [
    {
      'eid': 18508,
      'tech': true,
      'name': 'LB 351 - Netherlands',
      'priority': 3
    },
    {
      'eid': 18535,
      'tech': true,
      'name': 'LB 353 - Kenya',
      'priority': 3
    },
    {
      'eid': 18536,
      'tech': true,
      'name': 'LB 359 - Vietnam',
      'priority': 3
    },
  ],
  [
    {
      'eid': 18510,
      'tech': true,
      'name': 'LB 451 - Brazil',
      'priority': 4
    },
    {
      'eid': 18512,
      'tech': true,
      'name': 'LB 453 - Japan',
      'priority': 4
    },
    {
      'eid': 18523,
      'tech': true,
      'name': 'LB 459 - Italy',
      'priority': 4
    },
  ],
  [
    {
      'eid': 18524,
      'tech': true,
      'name': 'LB 518 - Ukraine',
      'priority': 5
    },
    {
      'eid': 18525,
      'tech': true,
      'name': 'LB 520 - South Africa',
      'priority': 5
    },
    {
      'eid': 18526,
      'tech': true,
      'name': 'LB 522 - Peru',
      'priority': 5
    },
    {
      'eid': 18511,
      'tech': true,
      'name': 'LB 547 - Lithuania',
      'priority': 5
    },
    {
      'eid': 18528,
      'tech': true,
      'name': 'LB 583 - Poland',
      'priority': 5
    },
  ]
].flat()

initRooms()