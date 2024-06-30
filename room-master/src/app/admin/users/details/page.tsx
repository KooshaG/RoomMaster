import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ScheduleView from "@/components/Schedule/ScheduleView"
import InfoCard from "@/components/UI/InfoCard"
import { prisma } from "@/prismaClient"
import Link from "next/link"
import UserStatusToggle from "@/components/admin/UserStatusToggle"

export default async function UserDetails({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions)
  const userId = searchParams.user as String
  if (session && session.user.id && session.user.admin) {
    const user = await prisma.user.findUnique({ where: { id: userId as string } })
    if (!user) return <p>User not found</p>
    const reservations = await prisma.reservation.findMany({ where: { userId: user.id } })

    return (
      <div className="flex flex-wrap">
        <InfoCard title='User Details'>
          <p><span className="font-semibold">Name: </span>{user.name}</p>
          <p><span className="font-semibold">Email: </span>{user.email}</p>
          <p><span className="font-semibold">Concordia Email: </span>{user.loginUsername}</p>
          <div className="divider my-2"></div>
          <UserStatusToggle user={user}/>
        </InfoCard>
        <InfoCard title='Total Reservations'>
          <p className="text-3xl font-bold">{reservations.length}</p>
          <Link href={`/admin/users/details/schedule?user=${userId}`} className="btn btn-ghost">View Reservations</Link>
        </InfoCard>
        <ScheduleView userId={user.id} />
      </div>
    )
  }
  return <p>o no</p>
}