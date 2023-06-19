import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/prismaClient";

type userid = {
  userId: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id || !session.user.admin) {
    return NextResponse.json({error: "Not signed in"}, {status: 403});
  }  
  const input: userid = await req.json();
  
  await prisma.user.update({
    where: {id: input.userId},
    data: {
      verified: true
    }
  });
  return NextResponse.json({message: "success"}, {status: 200});
}
