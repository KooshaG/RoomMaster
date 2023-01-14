import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.create({
    data:{
      username: 'test',
      password: 'user'
    }
  })
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