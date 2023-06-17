import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  return NextResponse.json(session);
}
