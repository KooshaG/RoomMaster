import { prisma } from "@/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function Schedule() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const reservationRequests = await prisma.reservationRequest.findMany({where: {userId: session?.user.id}});
    

    return (<pre>{JSON.stringify(reservationRequests, null, 2)}</pre>);
  }
  return <p>fuck</p>;
}
