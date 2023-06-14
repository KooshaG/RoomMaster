'use client';

import { Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';

type Props = {
  session?: Session | null;
};

export default function SignInOutButton({ session }: Props) {
  const { data } = useSession();
  if (session === undefined) {
    session = data;
  }
  return (
    <button
      className={`btn ${session ? 'btn-accent' : 'btn-primary'}`}
      onClick={() => {
        session ? signOut() : signIn();
      }}
    >
      {session ? 'Sign Out' : 'Sign In'}
    </button>
  );
}
