import { PrismaClient } from '@prisma/client'
import { createUser, deleteUser } from './userFuncs';
import { createReservationRequest } from './reservationRequestFuncs';


const prisma = new PrismaClient();

const main = async () => {
 
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })