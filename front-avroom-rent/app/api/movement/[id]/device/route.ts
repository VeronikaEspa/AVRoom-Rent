import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { id: deviceId } = await params;

    if (!deviceId) {
      return NextResponse.json(
        { message: "Device ID is required" },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `http://localhost:3200/api/devices/${deviceId}/movements`,
      {
        headers,
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching movements:", error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // If the server returned a 404, return an empty response with 404 status
      return NextResponse.json(
        { message: "Movements not found", data: [] },
        { status: 404 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: `Error fetching movements: ${errorMessage}` },
      { status: 500 }
    );
  }
}