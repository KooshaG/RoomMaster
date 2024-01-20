'use client';

import { useState } from 'react';

type Props = {
  reservationId: number;
};

type ButtonState = "waiting" | "loading" | "removed" | "error"

export default function RemoveReservationButton(props: Props) {
  const [removed, setRemoved] = useState<ButtonState>('waiting');

  async function handleRemove() {
    setRemoved('loading');
    const res = await fetch(`/api/reservation/cancel?id=${props.reservationId}`);
    if (res.status === 200) {
      setRemoved('removed');
    }
    else setRemoved('error');
  }

  if (removed === 'waiting') {
    return (
      <div className='tooltip' data-tip='This does not cancel the reservation, only removes the entry in RoomMaster'>
        <button className='btn btn-sm btn-error' onClick={handleRemove}>
          Cancel
        </button>
      </div>
    );
  } else if (removed === 'loading') {
    return <button className='btn btn-sm btn-error btn-outline btn-disabled'>Cancelling</button>;
  } else if (removed === 'removed') {
    return <button className='btn btn-sm btn-disabled btn-outline'>Cancelled</button>;
  } else if (removed === 'error') {
    return <button className='btn btn-sm btn-disabled btn-warning'>Error</button>;
  }
}
