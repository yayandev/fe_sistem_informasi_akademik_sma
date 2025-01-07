"use client";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";

const LogoutPage = () => {
  const { logout } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg p-8 m-4 md:max-w-md text-center">
        <h1 className="text-xl font-semibold">Konfirmasi!</h1>
        <p className="mt-2 text-gray-600">Anda yakin ingin Keluar?</p>
        <div className="flex flex-row justify-center mt-4 gap-3">
          <button
            onClick={() => logout()}
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          <Link
            href={"/dashboard"}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Batal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
