// import { config } from "@/app/config/environment.config";

export async function getDevices(): Promise<any[]> {
  const url = `http://localhost:3200/api/device`;
  console.log("URL de la API:", url);

  try {
    console.log("Enviando solicitud al backend...");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener dispositivos");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    throw error;
  }
}