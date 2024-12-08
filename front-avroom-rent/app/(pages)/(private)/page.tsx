"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo el dashboard</h1>
      <Link href="/dashboard/device">Device</Link>
      <Link href="/dashboard/user">User</Link>
    </div>
  );
}