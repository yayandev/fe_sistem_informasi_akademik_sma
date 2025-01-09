"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";

const DashboardGuruView = () => {
  const { user }: any = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Dashboard Siswa</h1>

      <div className="w-full p-3 rounded-md bg-white flex gap-3 flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <img src="/welcome.jpg" className="w-full" alt="Selamat Datang" />
        </div>
        <div className="w-full md:w-1/3 space-y-2">
          <h1 className="text-xl font-semibold">
            Selamat Datang <strong>{user?.name}</strong>
          </h1>
          <p className="text-sm text-gray-500">
            Kamu login sebagai <strong>{user?.role}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Selamat datang di Sistem Informasi Akademik Sekolah. Di sini, Anda
            dapat menggunakan fitur-fitur yang tersedia untuk mengelola data
            akademik Anda.
          </p>

          <div className="flex gap-3">
            <Link
              href={"/list/guru/absensi_me"}
              className="bg-blue-400 hover:opacity-75 text-white font-bold py-2 px-4 rounded"
            >
              Absensi
            </Link>
            <Link
              href={"/jadwal_guru"}
              className="bg-green-400 hover:opacity-75 text-white font-bold py-2 px-4 rounded"
            >
              Jadwal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuruView;
