import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/prismaClient";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({error: "Not signed in"}, {status: 403});
  }
  const { searchParams } = new URL(req.url);
  const reservationId = parseInt(searchParams.get('id') ?? "");
  if (Number.isNaN(reservationId) || reservationId < 0) {
    return NextResponse.json({error: "Invalid Parameters"}, {status: 422}); 
  }
  // make sure user owns that reservation
  const reservation = await prisma.reservation.findUnique({
    where: { 
      id: reservationId
    }
  });
  if (!reservation || reservation.userId !== session.user.id) {
    return NextResponse.json({error: "Invalid Parameters"}, {status: 422});  
  }
  // user is right
  await prisma.reservation.delete({
    where: {
      id: reservationId
    }
  });

  return NextResponse.json({message: `success, ${reservationId}`}, {status: 200});
}
