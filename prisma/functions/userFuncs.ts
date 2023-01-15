import { PrismaClient } from '@prisma/client'

export const createUser = async (client: PrismaClient, args: { username: string, password: string }) => {
  const validEmail = args.username.endsWith("@live.concordia.ca")
  if (validEmail) {
    return await client.user.create(
      {
        data: {
          username: args.username,
          password: args.password
        }
      }
    )
  }
  else {
    throw new Error("Invalid username or password")
  }
}

export const updateUser = async (client: PrismaClient, args: {id: number, username?: string, password?: string}) => {
  const validEmail = args.username.endsWith("@live.concordia.ca")
  if (validEmail) {
    return await client.user.update({
      where: {id: args.id},
      data: {
        username: args.username,
        password: args.password
      }
    })
  }
  else {
    throw new Error("Invalid username or password")
  }
}

export const deleteUser = async (client: PrismaClient, args:{ id: number }) => {
  return await client.user.delete({
    where: {id: args.id}
  })
}

export const findUser = async (client: PrismaClient, args: {id: number}) => {
  return await client.user.findUnique({ where: {id: args.id} })
}

export const allUser = async (client: PrismaClient) => {
  return await client.user.findMany()
}