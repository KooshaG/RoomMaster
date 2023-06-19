import { prisma } from "@/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ScheduleController from "@/components/Schedule/ScheduleController";


export default async function Schedule() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const reservationRequests = await prisma.reservationRequest.findMany();
  
  return (
  <div className="flex flex-col justify-center">
    {/* <pre>{JSON.stringify(reservationRequests, null, 2)}</pre> */}
    <ScheduleController reservationRequests={reservationRequests}/>
  </div>
  );
  }
  return <p>o no</p>;

}
