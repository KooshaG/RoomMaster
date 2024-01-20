'use client';

import { useState } from 'react';

type Props = {
  reservationId: number;
};

export default function CancelReservationButton(props: Props) {
  const [cancelled, setCancelled] = useState('waiting');

  async function handleCancel() {
    setCancelled('loading');
    const res = await fetch(`/api/reservation/cancel?id=${props.reservationId}`);
    if (res.status === 200) {
      setCancelled('cancelled');
    }
  }

  if (cancelled === 'waiting') {
    return (
      <div className='tooltip' data-tip='This does not cancel the reservation, only removes the entry in RoomMaster'>
        <button className='btn btn-sm btn-error' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    );
  } else if (cancelled === 'loading') {
    return <button className='btn btn-sm btn-error btn-outline btn-disabled'>Cancelling</button>;
  } else if (cancelled === 'cancelled') {
    return <button className='btn btn-sm btn-disabled btn-outline'>Cancelled</button>;
  }
}
