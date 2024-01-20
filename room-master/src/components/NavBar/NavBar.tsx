import dynamic from 'next/dynamic';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SignInOutButton from "../button/SignInOutButton";
import { LibraryBig } from "lucide-react"; 
import AlertController from './AlertController';
import { prisma } from '@/prismaClient';

const NavbarCenterButtons = dynamic(() => import("./NavbarCenterButtons"), {ssr: false});

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  let unverified = false;

  // check if there are unverified people
  if (session && session.user.admin) {
    const unverifiedCount = prisma.user.count({
      where: {
        verified: false
      }
    });
    unverified = !!unverifiedCount;
  }

  return (
    <div className={`${session && !session?.user.verified ? "join join-vertical" : ""} w-full z-10`}>
      <div className={`navbar ${session && !session?.user.verified ? "join-item" : ""} bg-base-100 drop-shadow`}>
        <div className='navbar-start'>
          <Link href='/' className='btn btn-ghost normal-case text-xl font-bold hidden md:inline-flex'>
            Room Master
          </Link>
          <Link href='/' className='btn btn-ghost normal-case text-xl font-bold md:hidden inline-flex'>
            <LibraryBig />
          </Link>
        </div>
        <div className='navbar-center'>
          <NavbarCenterButtons session={session} unverified={unverified}/>
        </div>
        <div className='navbar-end'>
          <SignInOutButton session={session}/>
        </div>
      </div>
      {<AlertController/>}
    </div>

  );
}
