"use client";

import { User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

type Props = {
  user: User
}

export default function SettingController({user}: Props) {

  const [username, setUsername] = useState(user.loginUsername ?? "");
  const [password, setPassword] = useState("");
  const [validInput, setValidInput] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const timeoutID = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setValidInput(username.endsWith("@live.concordia.ca") && password.length > 0);
  }, [password, username]);

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({loginUsername: username, loginPassword: password})
    });
    setSubmitting(false);
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
    if (res.status === 200) {
      setToastVisible(true);
      timeoutID.current = setTimeout(() => setToastVisible(false), 2000);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full sm:max-w-md">
          <label className="label">
            <span className="label-text">Concordia Email</span>
          </label>
          <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="cool_guy@live.concordia.ca" className="input input-bordered w-full sm:max-w-md" />
        </div>
        <div className="w-full sm:max-w-md">
          <label className="label">
            <span className="label-text">Concordia Password</span>
          </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full sm:max-w-md" />
        </div>
        <button onClick={handleSubmit} className={`btn ${submitting || !validInput ? "btn-disabled btn-outline" : "btn-primary"}`}>
          {validInput ? "Submit Changes" : "Invalid Settings"}
        </button>
      </div>
      <div className={`toast ${toastVisible ? "" : "hidden"}`}>
      <div className="alert alert-success">
        <span>Settings changed successfully!</span>
      </div>
    </div>
    </>
  );
}
