import { PrismaClient } from '@prisma/client'
import { deleteUser } from './userFuncs';


const prisma = new PrismaClient();

const main = async () => {
  const user = await deleteUser(prisma, {id: 1})
  console.log(user);
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