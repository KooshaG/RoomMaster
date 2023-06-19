"use client";

import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  session?: Session | null
}

const navLinks = [
  {
    nav: "/schedule",
    name: "Reservation Schedule",
  }, 
  {
    nav: "/reservations",
    name: "Reservations",
  }, 
  {
    nav: "/settings",
    name: "Settings",
  },
];

export default function NavbarCenterButtons({session}: Props) {
  const pathname = usePathname();
  const { data } = useSession();
  if (session === undefined) {
    session = data;
  }



  return (
  <div className="navbar-center">
    {
    session && 
    <div className="tabs hidden md:block">
      {navLinks.map(link => {
        return (
        <Link key={link.nav} href={link.nav} className={`tab md:tab-md lg:tab-lg tab-lifted ${pathname.startsWith(link.nav) ? "tab-active" : ""}`}>
          {link.name}
        </Link>
        );
      })}
      {
      session && session.user.admin && 
      <Link key="/admin" href={"/admin"} className={`tab md:tab-md lg:tab-lg tab-lifted ${pathname.startsWith("/admin") ? "tab-active" : ""}`}>
        Admin
      </Link>
      }
    </div>
    }
  </div>
  );
}
