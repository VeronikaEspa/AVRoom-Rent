import { config } from "@/app/config/environment.config";

export async function getUsers(): Promise<any[]> {
  const url = `http://localhost:3200/api/user`;
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
      console.error("Error al obtener usuarios:", errorData);
      throw new Error("Error al obtener usuarios.");
    }

    const data = await response.json();
    console.log("Usuarios obtenidos:", data);
    return data;

  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    throw error;
  }
}

export const updateUser = async (userId: string, updatedData: any) => {
  try {
    console.log("hola1")
    const response = await fetch(`http://localhost:3200/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error en la actualización: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};