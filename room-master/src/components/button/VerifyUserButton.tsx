'use client';

import { useState } from 'react';

type Props = {
  userId: string;
};

export default function VerifyUserButton({ userId }: Props) {
  const [verified, setVerified] = useState(false);

  async function handleVerification() {
    const res = await fetch(`/api/admin`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    });
    if (res.status === 200) {
      setVerified(true);
    }
  }

  return (
    <button className={`btn ${verified ? 'btn-disabled btn-outline' : 'btn-primary'}`} onClick={handleVerification}>
      {verified ? 'Verified' : 'Verify'}
    </button>
  );
}
