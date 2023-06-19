import { PrismaClient } from '@prisma/client'

export const createReservation = async (client:PrismaClient, args: { daySinceEpoch: number, roomId: number, userId: string, date: Date }) => {
  return await client.reservation.create({
    data:{
      daySinceEpoch: args.daySinceEpoch,
      date: args.date,
      room: { connect: { id: args.roomId }},
      user: { connect: { id: args.userId }}
    }
  })
}

export const deleteReservation = async (client:PrismaClient, args: { id: number }) => {
  return await client.reservation.delete({
    where: { id: args.id }
  })  
}

export const reservationByUser = async (client:PrismaClient, args: { userId: string }) => {
  return await client.reservation.findMany({
    where: { userId: args.userId },
    include: { room: true }
  })
}

export const getReservation = async (client:PrismaClient, args: { userId: string, daySinceEpoch: number }) => {
  return await client.reservation.findFirst({
    where: { userId: args.userId, daySinceEpoch: args.daySinceEpoch },
    include: { room: true}
  })
}


