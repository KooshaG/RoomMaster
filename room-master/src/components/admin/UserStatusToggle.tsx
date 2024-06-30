"use client"

import type { User } from "@prisma/client"
import { useState } from "react"
interface Props {
  user: User
}

export default function UserStatusToggle({ user }: Props) {
  const [verified, setVerified] = useState(user.verified)
  const [admin, setAdmin] = useState(user.admin)

  const handleToggle = (e: any) => {
    const toggle = e.target.id
    // @ts-ignore
    document.getElementById(toggle).indeterminate = true
    fetch('/api/user/toggleStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user.id, toggle })
    }).then(res => res.json().then(data => {
      if (data.error) {
        console.error(data.error)
        // @ts-ignore
        document.getElementById(toggle).indeterminate = false
        return
      }
      if (toggle === 'verified') {
        setVerified(data.value)
      } else {
        setAdmin(data.value)
      }
    })).finally(() => {
      // @ts-ignore
      document.getElementById(toggle).indeterminate = false
    })
  }

  return (
    <div className="form-control gap-y-2">
      <label className="label cursor-pointer">
        <span className="label-text text-base font-semibold">Verified</span>
        <input id="verified" type="checkbox" className="toggle toggle-primary" checked={verified} onClick={handleToggle}/>
      </label>
      <label className="label cursor-pointer">
        <span className="label-text text-base font-semibold">Admin</span>
        <input id="admin" type="checkbox" className="toggle toggle-primary" checked={admin} onClick={handleToggle}/>
      </label>
    </div>
  )
}