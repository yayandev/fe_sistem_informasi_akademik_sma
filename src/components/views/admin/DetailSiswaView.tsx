"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

function DetailSiswaView({ id }: any) {
  const { token, user }: any = useAuth();
  const [loading, setLoading] = useState(true);
  const [dataSiswa, setDataSiswa]: any = useState(null);
  const [dataAbsen, setDataAbsen]: any = useState([]);
  const [activeTab, setActiveTab] = useState("dataSiswa"); // state untuk tab aktif

  const fetchDataSiswa = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/siswas/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDataSiswa(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataAbsen = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/siswa/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDataAbsen(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDataSiswa();
      fetchDataAbsen();
    }
  }, [token]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Detail Siswa</h1>

      <div className="bg-white p-3 space-y-3 rounded-md shadow-sm">
        <div className="flex justify-between gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => handleTabChange("dataSiswa")}
              className={`py-2 px-4 rounded-md ${
                activeTab === "dataSiswa"
                  ? "bg-lamaSky text-white"
                  : "bg-slate-300"
              }`}
            >
              Data Siswa
            </button>
            <button
              onClick={() => handleTabChange("dataAbsen")}
              className={`py-2 px-4 rounded-md ${
                activeTab === "dataAbsen"
                  ? "bg-lamaSky text-white"
                  : "bg-slate-300"
              }`}
            >
              Data Absen
            </button>
          </div>
          <Link
            href={user?.role === "admin" ? "/list/siswa" : "/list/guru/siswa"}
            className="py-2 px-4 rounded-md bg-lamaPurple text-white"
          >
            Kembali
          </Link>
        </div>

        {activeTab === "dataSiswa" && (
          <div className="overflow-x-auto space-y-3">
            <table className="w-full whitespace-nowrap md:w-3/4">
              <thead>
                <tr>
                  <th className="p-4 border text-left">Nama</th>
                  <th className="p-4 border text-left">{dataSiswa?.nama}</th>
                </tr>
                <tr>
                  <th className="p-4 border text-left">Jenis Kelamin</th>
                  <th className="p-4 border text-left">
                    {dataSiswa?.jenis_kelamin}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="p-4 border text-left">NIS</th>
                  <th className="p-4 border text-left">{dataSiswa?.nis}</th>
                </tr>
                <tr>
                  <th className="p-4 border text-left">Email</th>
                  <th className="p-4 border text-left">{dataSiswa?.email}</th>
                </tr>
                <tr>
                  <th className="p-4 border text-left">No Telp</th>
                  <th className="p-4 border text-left">{dataSiswa?.no_telp}</th>
                </tr>
                <tr>
                  <th className="p-4 border text-left">Alamat</th>
                  <th className="p-4 border text-left">{dataSiswa?.alamat}</th>
                </tr>
                <tr>
                  <th className="p-4 border text-left">Kelas</th>
                  <th className="p-4 border text-left">
                    {dataSiswa?.kelas.nama}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "dataAbsen" && (
          <div className="overflow-x-auto space-y-3">
            <table className="w-full whitespace-nowrap md:w-3/4">
              <thead>
                <tr className="border-gray-200">
                  <th className="px-4 py-2 text-left border">No</th>
                  <th className="px-4 py-2 text-left border">Tanggal</th>
                  <th className="px-4 py-2 text-left border">Status</th>
                </tr>
              </thead>

              <tbody>
                {dataAbsen?.absensiSiswa.map((item: any, index: number) => (
                  <tr key={index} className="border-gray-200">
                    <td className="px-4 py-2 text-left border">{index + 1}</td>

                    <td className="px-4 py-2 text-left border">
                      {item.tanggal.split("T")[0]}
                    </td>
                    <td className="px-4 py-2 text-left border">
                      <span
                        className={`px-2 py-1 text-xs text-white rounded ${
                          item.status === "hadir"
                            ? "bg-green-500"
                            : item.status === "izin"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailSiswaView;
