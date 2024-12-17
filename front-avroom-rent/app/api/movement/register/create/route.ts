import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const movementData = await req.json();

    const { deviceId, userId, loanDate, returnDateExpected, description, type } = movementData;

    if (!deviceId || !userId || !loanDate || !description || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validar el tipo de movimiento
    if (type !== "loan" && type !== "return") {
      return NextResponse.json(
        { message: "Invalid movement type. Use 'loan' or 'return'." },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let backendUrl = `http://localhost:3200/api/movements/users/${userId}`;

    const response = await axios.post(backendUrl, {
      deviceId,
      loanDate,
      returnDateExpected: type === "loan" ? returnDateExpected : null,
      description,
      type,
    }, {
      headers,
    });

    console.log(response)
    if (response.status === 201) {
      return NextResponse.json(
        { message: "Movimiento registrado exitosamente.", data: response.data },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to register movement." },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error("Error creating movement:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { message: error.response.data.message || "Error fetching data from backend." },
          { status: error.response.status }
        );
      } else if (error.request) {
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
      { message: `Error creating movement: ${errorMessage}` },
      { status: 500 }
    );
  }
}