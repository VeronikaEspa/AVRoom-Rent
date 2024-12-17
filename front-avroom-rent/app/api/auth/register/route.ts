import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { IUser, Role } from "@/app/utils/types/user.types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const urlUser = `http://localhost:3200/api/users`;

  try {
    const body = await req.json();

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios: username, email o password." },
        { status: 400 }
      );
    }

    const userData: IUser = {
      id: crypto.randomUUID() as unknown as string,
      username: body.username,
      email: body.email,
      password: body.password,
      dateCreation: new Date(),
      role: body.role || Role.STUDENT,
      isActive: false
    };

    const userResponse = await fetch(urlUser, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Error en el registro del usuario:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Error al registrar el usuario" },
        { status: userResponse.status }
      );
    }

    const userDataResponse = await userResponse.json();
    const { token } = userDataResponse;

    const res = NextResponse.json({ message: "Registro exitoso" });

    res.headers.append(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
    );

    return res;
  } catch (error: any) {
    console.error("Ocurrió un error durante la operación:", error.message);
    return NextResponse.json(
      { message: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}