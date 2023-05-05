import { PrismaClient } from '@prisma/client'

export const createReservationRequest = async (
  client:PrismaClient, 
  args: { dayOfWeek: string, iso_weekday: number, slots30mins: number, startTime: string, endTime: string, userId: number }
  ) => {
  return await client.reservationRequest.create({
    data: {
      dow: args.dayOfWeek,
      iso_weekday: args.iso_weekday,
      slots30mins: args.slots30mins,
      startTime: args.startTime,
      endTime: args.endTime,
      user: { connect: { id: args.userId }}
    }
  })
}

export const updateReservationRequest = async (
  client:PrismaClient, 
  args: { id: number, dayOfWeek?: string, iso_weekday?: number, slots30mins?: number, startTime?: string, endTime?: string}
  ) => {
  return await client.reservationRequest.update({
    where: { id: args.id },
    data: {
      dow: args.dayOfWeek,
      iso_weekday: args.iso_weekday,
      slots30mins: args.slots30mins,
      startTime: args.startTime,
      endTime: args.endTime
    }
  })
}

export const deleteReservationRequest = async (client:PrismaClient, args: { id: number }) => {
  return await client.reservationRequest.delete({
    where: { id: args.id }
  })
}

export const reservationRequestByUser = async (client:PrismaClient, args: { userId: number }) => {
  return await client.reservationRequest.findMany({
    where: { userId: args.userId }
  })
}