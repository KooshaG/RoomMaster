import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/prismaClient";
import { encrypt } from "@/lib/encryption";

type userpass = {
  loginUsername: string;
  loginPassword: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({error: "Not signed in"}, {status: 403});
  }  
  const input: userpass = await req.json();
  
  await prisma.user.update({
    where: {id: session.user.id},
    data: {
      loginUsername: input.loginUsername,
      loginPassword: encrypt(input.loginPassword)
    }
  });
  return NextResponse.json({message: "success"}, {status: 200});
}
