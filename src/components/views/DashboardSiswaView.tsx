"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";

const DashboardSiswaView = () => {
  const { user, token }: any = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Dashboard Siswa</h1>

      <div className="w-full p-3 rounded-md bg-white flex gap-3 flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <img src="/welcome.jpg" className="w-full" alt="Selamat Datang" />
        </div>
        <div className="w-full md:w-2/3 space-y-2">
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
              href={"/absen_siswa"}
              className="bg-blue-400 hover:opacity-75 text-white font-bold py-2 px-4 rounded"
            >
              Absensi Siswa
            </Link>
            {user?.siswa.id === user?.siswa.kelas.ketuaKelasId && (
              <Link
                href={"/absen_guru/create"}
                className="bg-green-400 hover:opacity-75 text-white font-bold py-2 px-4 rounded"
              >
                Absensi Guru
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswaView;
