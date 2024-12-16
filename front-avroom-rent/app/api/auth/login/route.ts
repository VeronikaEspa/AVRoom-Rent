import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const url = `http://localhost:3200/api/login`;

  const { email, password } = await req.json();

  try {
    console.log("Enviando solicitud al backend...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error en la respuesta del servidor:", errorData);
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await response.json();
    const { token } = data;

    const res = NextResponse.json({ message: "Login successful" });

    // Configurar cookie del token
    res.headers.append(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
    );

    return res;
  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
}