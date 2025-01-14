import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

function decodeAndValidateToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;

    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token structure");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", (error as Error).message);
    return false;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname === "/") {
    if (token && decodeAndValidateToken(token)) {
      return NextResponse.redirect(new URL("/device", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (!token || !decodeAndValidateToken(token)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/config/:path*", "/resources/:path*", "/movements/:path*"],
};