import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth";
import { prisma } from "@/prismaClient";

type Body = {
  userId: string;
  toggle: "verified" | "admin";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id || !session.user.admin) {
    return NextResponse.json({error: "Not signed in"}, {status: 403});
  }  
  const input: Body = await req.json();
  console.log(input);
  if (!input.userId || !input.toggle || (input.toggle !== "admin" && input.toggle !== "verified")) return NextResponse.json({error: "Invalid input"}, {status: 400});

  const user = await prisma.user.findUnique({
    where: {id: input.userId}
  });
  if (!user) return NextResponse.json({error: "User not found"}, {status: 404});
  
  await prisma.user.update({
    where: {id: input.userId},
    data: {
      [input.toggle]: !user[input.toggle]
    }
  });
  return NextResponse.json({field: input.toggle, value: !user[input.toggle]}, {status: 200});
}
