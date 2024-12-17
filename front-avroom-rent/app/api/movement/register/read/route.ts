import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { message: "Query parameter 'type' is required" },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let response;

    if (type === "users") {
      response = await axios.get("http://localhost:3200/api/users", { headers });
      console.log(response)
      return NextResponse.json({ users: response.data }, { status: 200 });
    } else if (type === "devices") {
      response = await axios.get("http://localhost:3200/api/devices", { headers });
      return NextResponse.json({ devices: response.data }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Invalid 'type' parameter. Use 'users' or 'devices'." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching data:", error);

    // Manejo de errores de Axios
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Errores del servidor backend
        return NextResponse.json(
          { message: error.response.data.message || "Error fetching data from backend." },
          { status: error.response.status }
        );
      } else if (error.request) {
        // No se recibió respuesta del servidor backend
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
      { message: `Error fetching data: ${errorMessage}` },
      { status: 500 }
    );
  }
}