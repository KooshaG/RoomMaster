import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/prismaClient";

type ReservationPartial = {
  dow: string
  iso_weekday: number
  startTime: string
  endTime: string
  slots30mins: number
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({error: "Not signed in"}, {status: 403});
  }
  const info: ReservationPartial[] = await req.json();
  const realReservationRequests = info.map((r) => {
    const obj = {
      ...r,
      userId: session.user.id as string
    };
    return obj;
  });
  await prisma.reservationRequest.deleteMany({
    where: {
      userId: session?.user.id
    }
  });
  await prisma.reservationRequest.createMany({
    data: realReservationRequests
  });


  return NextResponse.json({message: "success"}, {status: 200});
}
