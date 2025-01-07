"use client";
import { useAuth } from "@/context/useAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

const AbsenSiswaView = () => {
  const [dataAbsen, setDataAbsen] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { user, token }: any = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/siswa/${user?.siswa.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setDataAbsen(data.data);
        console.log(data.data.absensiSiswa);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Absen Siswa</h1>
      <div className="flex gap-3 flex-col md:flex-row">
        <div className="flex-1 bg-white p-3 space-y-3 rounded-md shadow-sm">
          {dataAbsen?.isTodayAbsen ? (
            <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple">
              <div className="flex items-center justify-between flex-wrap">
                <h1 className="font-semibold text-gray-600">
                  Absensi Hari ini : {dataAbsen?.isTodayAbsen.status}
                </h1>

                <span className="text-gray-300 text-xs">
                  {dataAbsen?.isTodayAbsen.tanggal.split("T")[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple">
              <div className="flex items-center justify-between flex-wrap">
                <h1 className="font-semibold text-gray-600">
                  Belum Absen Hari Ini
                </h1>
                <span className="text-gray-300 text-xs">
                  {Date().toString()}
                </span>
              </div>
              <button
                onClick={() => router.push("/absen_siswa/create")}
                disabled={
                  user?.siswa.id === user?.siswa.kelas.ketuaKelasId
                    ? false
                    : true
                }
                className="mt-2 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-md bg-lamaYellow text-white text-xs font-semibold"
              >
                Absen Sekarang
              </button>
              {user?.siswa.id != user?.siswa.kelas.ketuaKelasId && (
                <p className="text-red-500 text-xs mt-1 italic">
                  Hanya Ketua Kelas Yang Bisa Absen
                </p>
              )}
            </div>
          )}

          {/* table */}
          <div className="p-3 space-y-1">
            <h3 className="font-semibold text-gray-600">Riwayat Absen</h3>
            <table className="w-full overflow-x-auto">
              <thead className="text-left">
                <tr>
                  <th className="px-3 py-2 font-semibold text-gray-600 border">
                    Tanggal
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-600 border">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataAbsen?.absensiSiswa?.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
                  >
                    <td className="px-3 py-2 border">
                      {item.tanggal.split("T")[0]}
                    </td>
                    <td className="px-3 py-2 border">
                      {item.status === "alpa" ? (
                        <span className="py-1 px-2 rounded-md bg-red-500 text-white text-xs font-semibold">
                          Alpa
                        </span>
                      ) : item.status === "hadir" ? (
                        <span className="py-1 px-2 rounded-md bg-green-500 text-white text-xs font-semibold">
                          Hadir
                        </span>
                      ) : (
                        <span className="py-1 px-2 rounded-md bg-yellow-500 text-white text-xs font-semibold">
                          Izin
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenSiswaView;
