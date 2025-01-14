"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IUser, Role } from "@/app/utils/types/user.types";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState<{
    user: Omit<IUser, "id" | "dateCreation">;
  }>({
    user: {
      username: "",
      email: "",
      password: "",
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await axios.post("/api/auth/register", formData.user);
      
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.response?.data?.message || "Error de red o del servidor.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)] bg-gray-100">
      <section className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
        <Image
          src="/imagenLogin.png"
          alt="Imagen de Registro"
          width={450}
          height={450}
          className="object-cover w-full h-[calc(100vh-40px)]"
        />
      </section>
      <section className="flex flex-1 items-center justify-center bg-white px-6">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <h1 className="text-xl font-bold mb-6 text-gray-800">Registro de Usuario</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              { label: "Nombre de Usuario:", name: "username", value: formData.user.username },
              { label: "Correo Electrónico:", name: "email", value: formData.user.email },
              { label: "Contraseña:", name: "password", value: formData.user.password, type: "password" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primaryColor text-sm"
                />
              </div>
            ))}
            <div className="flex justify-end">
            <Link
            href={"/login"}
                className={"px-6 py-2 rounded text-sm transition-all"}
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded text-sm transition-all ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primaryColor text-white hover:bg-primaryColorDark"
                }`}
              >
                {isLoading ? "Cargando..." : "Registrar"}
              </button>
            </div>
            {errorMessage && <p className="text-red-500 text-center mt-4 text-sm">{errorMessage}</p>}
          </form>
        </div>
      </section>

      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-md font-semibold text-green-800">¡Registro exitoso!</h2>
            <p className="text-green-700 mt-2 text-sm">El registro se ha completado correctamente.</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}