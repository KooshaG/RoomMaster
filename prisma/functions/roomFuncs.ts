import { PrismaClient } from '@prisma/client'

export const createRoom = async (client: PrismaClient, args: { name: string, tech: boolean, priority: number, eid: number, seats?: boolean }) => {
  return await client.room.create({
    data: {
      name: args.name,
      tech: args.tech,
      priority: args.priority,
      eid: args.eid,
      seats: args.seats
    }
  })
}

export const updateRoom = async (
  client: PrismaClient, 
  args: { id: number, name?: string, tech?: boolean, priority?: number, eid?: number, seats?: boolean }
  ) => {
    return await client.room.update({
      where: { id: args.id },
      data: {
        name: args.name,
        tech: args.tech,
        priority: args.priority,
        eid: args.eid,
        seats: args.seats
      }
    })
}

export const deleteRoom = async (client: PrismaClient, args: { id: number }) => {
  return await client.room.delete({ where: { id: args.id}})
}

export const getRoom = async (client: PrismaClient, args: { id: number }) => {
  return await client.room.findUnique({ where: { id: args.id }})
}

export const getAllRoom = async (client: PrismaClient) => {
  return await client.room.findMany({ orderBy: { priority: 'asc'}})
}