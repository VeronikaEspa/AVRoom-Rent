import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ message: "Logout successful" });

  // Elimina la cookie 'token' expirándola
  res.cookies.set("token", "", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return res;
}