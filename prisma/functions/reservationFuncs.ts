import { PrismaClient } from '@prisma/client'

export const createReservation = async (client:PrismaClient, args: { daySinceEpoch: number, roomId: number, userId: number }) => {
  return await client.reservation.create({
    data:{
      daySinceEpoch: args.daySinceEpoch,
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

export const reservationByUser = async (client:PrismaClient, args: { userId: number }) => {
  return await client.reservation.findMany({
    where: { userId: args.userId },
    include: { room: true }
  })
}


