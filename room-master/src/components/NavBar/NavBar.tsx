import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import NavbarCenterButtons from "../NavbarCenterButtons";
import SignInOutButton from "../button/SignInOutButton";


export default async function NavBar() {
  const session = await getServerSession(authOptions);

  return await (
    <div className={`${session && !session?.user.verified ? "join join-vertical" : ""} w-full`}>
      <div className={`navbar ${session && !session?.user.verified ? "join-item" : ""} bg-base-100 drop-shadow`}>
        <div className='navbar-start'>
          <Link href='/' className='btn btn-ghost normal-case text-xl font-bold'>
            Room Master
          </Link>
        </div>
        <div className='navbar-center'>
          <NavbarCenterButtons session={session}/>
        </div>
        <div className='navbar-end'>
          <SignInOutButton session={session} />
        </div>
      </div>
      {session && !session?.user.verified && 
      <div className="alert join-item alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>Warning: You are not verified, you can use the website normally but reservations will not be made for you.</span>
      </div>}
    </div>

  );
}
