"use client";

import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, Table, Settings, Shield } from 'lucide-react';
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Props = {
  session?: Session | null
  unverified?: boolean
}

const navLinks = [
  {
    nav: "/schedule",
    name: "Reservation Schedule",
    icon: Pencil
  }, 
  {
    nav: "/reservations",
    name: "Reservations",
    icon: Table
  }, 
  {
    nav: "/settings",
    name: "Settings",
    icon: Settings
  },
];

export default function NavbarCenterButtons(props: Props) {
  const pathname = usePathname();
  const { data } = useSession();
  let session = props.session;
  if (session === undefined) {
    session = data;
  }
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
  <div className="navbar-center">
    {
    session && 
    <div className="tabs">
      {navLinks.map(link => {
        return (
        <Link key={link.nav} href={link.nav} className={`tab md:tab-md lg:tab-lg tab-lifted ${pathname.startsWith(link.nav) ? "tab-active" : ""}`}>
          {isDesktop ? <>{link.name}</> : <NavIcon name={link.name}/>}
        </Link>
        );
      })}
      {
      session && session.user.admin && 
      <Link key="/admin" href={"/admin"} className={`tab md:tab-md lg:tab-lg tab-lifted  ${pathname.startsWith("/admin") ? "tab-active" : ""}`}>
        {isDesktop ? <>{"Admin "}</> : <NavIcon name={"Admin"}/>}
        {props.unverified && <div className="badge badge-info badge-xs ml-1"></div>}
      </Link>
      }
    </div>
    }
  </div>
  );
}

function NavIcon(props: {name: string}) {
  if (props.name === "Reservation Schedule") return <Pencil/>;
  else if (props.name === "Reservations") return <Table/>;
  else if (props.name === "Settings") return <Settings/>;
  else if (props.name === "Admin") return <Shield/>;
  else return <></>;
}
