import { prisma } from "@/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SettingController from "@/components/Settings/SettingController";


export default async function Schedule() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  if (user) {
    return (
    <div className="flex flex-col justify-center">
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <SettingController user={user}/>
    </div>
    );
  }}
  return <p>o no</p>;

}
