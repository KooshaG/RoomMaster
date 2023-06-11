import { PrismaClient } from '@prisma/client'

export const createUser = async (client: PrismaClient, args: { username: string, password: string }) => {
  const validEmail = args.username.endsWith("@live.concordia.ca")
  if (validEmail) {
    return await client.user.create(
      {
        data: {
          email: args.username,
          loginUsername: args.username,
          loginPassword: args.password,
          lastRequestTime: null
        }
      }
    )
  }
  else {
    throw new Error("Invalid username or password")
  }
}

export const updateUser = async (client: PrismaClient, args: {id: string, username?: string, password?: string}) => {
  const validEmail = args.username.endsWith("@live.concordia.ca")
  if (validEmail) {
    return await client.user.update({
      where: {id: args.id},
      data: {
        loginUsername: args.username,
        loginPassword: args.password
      }
    })
  }
  else {
    throw new Error("Invalid username or password")
  }
}

export const deleteUser = async (client: PrismaClient, args:{ id: string }) => {
  return await client.user.delete({
    where: {id: args.id}
  })
}

export const findUser = async (client: PrismaClient, args: {id: string}) => {
  return await client.user.findUnique({ where: {id: args.id} })
}

export const findUserForReservation = async (client: PrismaClient, args: {username: string}) => {
  const user = await client.user.findUnique({ where: {loginUsername: args.username} })
  if (!user || user.lastRequestTime?.getTime() + (1000 * 60 * 60 * 12) > Date.now()) {
  // if (!user || user.lastRequestTime?.getTime() > Date.now()) {
    return undefined
  }
  await client.user.update({
    where: {id: user.id},
    data: {lastRequestTime: new Date()}
  })
  return user
}

export const allUser = async (client: PrismaClient) => {
  return await client.user.findMany()
}