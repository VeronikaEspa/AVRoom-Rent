"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      setIsLoading(false);

      router.push("/device")
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || "Error de red o del servidor.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)]">
      <section className="hidden md:flex w-1/2 items-center justify-center bg-gray-200">
        <img
          src="/imagenLogin.png"
          alt="Logo Empresa"
          width={600}
          height={600}
          className="object-cover w-full h-[calc(100vh-35.5px)]"
        />
      </section>

      <section className="flex flex-1 items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Bienvenido</h1>
          <p className="text-center text-gray-600 mb-8">
            Por favor, inicia sesión para continuar
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primaryColor"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Contraseña:</label>
              <input
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primaryColor"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 text-white font-medium rounded transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primaryColor hover:bg-primaryColorDark"
              }`}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
          </form>

          <p className="text-center text-gray-600 mt-6">
            ¿No estás registrado? Puedes ingresar
            <Link href="/register" className="text-primaryColorDark font-medium ml-1 italic">
              aquí
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}