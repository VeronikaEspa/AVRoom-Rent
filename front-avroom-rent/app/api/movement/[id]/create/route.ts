import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Device ID is required" },
        { status: 400 }
      );
    }

    const movementData = await req.json();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`http://localhost:3200/api/movements/users/${movementData.userId}`, movementData, {
      headers,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Error creating movement:", error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: `Error creating movement: ${errorMessage}` },
      { status: 500 }
    );
  }
}