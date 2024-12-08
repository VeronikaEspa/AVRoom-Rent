import { config } from "@/app/config/environment.config";

export async function login(email: string, password: string): Promise<{ message: string; token?: string }> {

  const url = `http://localhost:3200/api/login`;
  console.log("URL de la API:", url);

  try {
    console.log("Enviando solicitud al backend...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await response.json();

    if (data && data.token) {
      localStorage.setItem("token", data.token);
    } else {
      console.warn("No se recibió un token en la respuesta.");
    }

    return data;

  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    throw error;
  }
}


export async function createUser(
  username: string,
  email: string,
  password: string,
  role: string
): Promise<{ message: string; user?: object }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token en localStorage. Por favor, inicia sesión nuevamente.");
    }

    console.log("Token encontrado en localStorage:", token);

    console.log("Enviando solicitud al backend...");
    const response = await fetch(`http://localhost:3200/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    console.log("Respuesta recibida:", response);

    if (!response.ok) {
      console.log("La respuesta no es OK. Código de estado:", response.status);
      const errorData = await response.json();
      console.log("Datos de error recibidos:", errorData);
      throw new Error(errorData.message || "Error al crear el usuario");
    }

    const data = await response.json();
    console.log("Datos recibidos del backend:", data);

    return data;
  } catch (error) {
    console.error("Ocurrió un error durante la petición:", error);
    throw error;
  }
}