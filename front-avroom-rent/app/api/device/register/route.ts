// app/api/device/register/create/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Device } from "@/app/utils/types/device.types";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Obtener las cookies del request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Verificar si el token está presente
    if (!token) {
      console.log("Token faltante");
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    // Leer el cuerpo de la solicitud
    const deviceData: Device = await req.json();
    console.log("Dispositivo recibido:", deviceData);

    // Validar los campos necesarios
    const { name, description, category, available } = deviceData;

    if (!name || !description || !category || available === undefined) {
      console.log("Campos faltantes");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const backendUrl = `http://localhost:3200/api/devices`;
    const response = await axios.post(backendUrl, deviceData, { headers });

    console.log("Respuesta del backend:", response.status);

    if (response.status === 201) {
      console.log("Dispositivo creado exitosamente.");
      return NextResponse.json(
        { message: "Dispositivo registrado exitosamente.", data: response.data },
        { status: 201 }
      );
    } else {
      console.log("Falló la creación del dispositivo:", response.status);
      return NextResponse.json(
        { message: "Failed to register device." },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error("Error creando dispositivo:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("Error del backend:", error.response.data);
        return NextResponse.json(
          { message: error.response.data.message || "Error fetching data from backend." },
          { status: error.response.status }
        );
      } else if (error.request) {
        console.log("No se recibió respuesta del backend.");
        return NextResponse.json(
          { message: "No response received from the backend server." },
          { status: 502 }
        );
      }
    }

    // Errores inesperados
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      { message: `Error creating device: ${errorMessage}` },
      { status: 500 }
    );
  }
}