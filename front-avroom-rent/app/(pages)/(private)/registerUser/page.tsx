// "use client";

// import { useState } from "react";

// export default function CreateUser() {
//   const [username, setUsername] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [role, setRole] = useState<string>("admin"); // Valor predeterminado para el rol
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setErrorMessage("");
//     setIsLoading(true);

//     try {
//       console.log("Enviando datos para crear usuario:", { username, email, password, role });

//       await createUser(username, email, password, role);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error al enviar la solicitud:", error);
//       setIsLoading(false);
//       setErrorMessage("Error de red o del servidor.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold text-gray-700 mb-6">Crear Usuario</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded px-8 py-6 w-full max-w-md"
//       >
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Nombre de Usuario:
//           </label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Ingrese su nombre de usuario"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Correo Electrónico:
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Ingrese su correo"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Contraseña:
//           </label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Ingrese su contraseña"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Rol:
//           </label>
//           <select
//             name="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
//             required
//           >
//             <option value="admin">Admin</option>
//             <option value="editor">Editor</option>
//             <option value="superAdmin">Super Admin</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-2 rounded ${
//             isLoading
//               ? "bg-gray-300 cursor-not-allowed"
//               : "bg-primaryColor text-white hover:bg-primaryColorDark"
//           } focus:outline-none focus:ring-2 focus:ring-primaryColor`}
//         >
//           {isLoading ? "Cargando..." : "Crear Usuario"}
//         </button>
//         {errorMessage && (
//           <p className="mt-4 text-red-600 text-sm">{errorMessage}</p>
//         )}
//       </form>
//     </div>
//   );
// }