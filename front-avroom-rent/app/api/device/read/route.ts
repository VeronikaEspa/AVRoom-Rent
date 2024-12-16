import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Device } from "@/app/utils/types/device.types";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const response = await axios.get<Device>(`http://localhost:3200/api/devices/${id}`, {
        headers,
      });

      return NextResponse.json(response.data, { status: 200 });
    } else {
      const response = await axios.get<Device[]>("http://localhost:3200/api/devices", {
        headers,
      });

      return NextResponse.json(response.data, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching devices:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: `Error fetching devices: ${errorMessage}` },
      { status: 500 }
    );
  }
}