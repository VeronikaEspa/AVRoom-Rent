import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { id: userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { message: "Device ID is required" },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Primera petición para obtener los movimientos del usuario
    const movementsResponse = await axios.get(
      `http://localhost:3200/api/movements/users/${userId}`,
      { headers }
    );

    const movements = movementsResponse.data;

    if (!Array.isArray(movements)) {
      return NextResponse.json(
        { message: "Invalid data format for movements" },
        { status: 500 }
      );
    }

    const movementIds = movements.map((movement: any) => movement.idDevice);

    // Realizar peticiones paralelas para obtener la información de cada dispositivo
    const devicePromises = movementIds.map((id: string) =>
      axios
        .get(`http://localhost:3200/api/devices/${id}`, { headers })
        .then((res) => {
          return res.data.name;
        })
        .catch((err) => {
          console.error(`Error fetching device with id ${id}:`, err);
          return null; // O maneja el error según tus necesidades
        })
    );

    const deviceNames = await Promise.all(devicePromises);

    const result: Array<[string, string | null]> = movementIds.map((id, index) => [
      id,
      deviceNames[index],
    ]);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching movements or devices:", error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Si el servidor devolvió un 404, retornar una respuesta vacía con estado 404
      return NextResponse.json(
        { message: "Movements not found", data: [] },
        { status: 404 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: `Error fetching movements or devices: ${errorMessage}` },
      { status: 500 }
    );
  }
}