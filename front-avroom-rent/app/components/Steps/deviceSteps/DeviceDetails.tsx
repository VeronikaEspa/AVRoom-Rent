import { Device } from "@/app/utils/types/device.types";
import {
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaCube,
  FaClock,
  FaTools,
} from "react-icons/fa";

interface DeviceDetailsProps {
  device: Device | null;
  lastMovementDate: string | null;
}

export default function DeviceDetails({ device, lastMovementDate }: DeviceDetailsProps) {
  if (!device) {
    return <p className="text-gray-500">No hay datos disponibles del dispositivo.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col lg:flex-row gap-6">
         Main Content */}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{device.name}</h2>
          <p className="text-gray-600 mb-4">{device.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             Category */}
            <div className="flex items-center">
              <FaTag className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Categoría:&nbsp;</span> {device.category}
            </div>

             Availability */}
            <div className="flex items-center">
              {device.available ? (
                <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <FaTimesCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="text-gray-700 font-medium">Disponible:&nbsp;</span>{" "}
              {device.available ? "Sí" : "No"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}