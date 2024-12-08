import { config } from "@/app/config/environment.config";

export async function getDeviceMovements(idDevice: string): Promise<any[]> {
  const url = `http://localhost:3200/api/device/${idDevice}/movement`;
  console.log("URL de la API:", url);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token no encontrado en localStorage.");
    }

    console.log("Enviando solicitud al backend...");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error al obtener movimientos:", errorData);
      throw new Error("Error al obtener movimientos.");
    }

    const data = await response.json();
    console.log("Movimientos obtenidos:", data);
    return data;

  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    throw error;
  }
}
