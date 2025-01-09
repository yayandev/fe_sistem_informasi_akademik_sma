"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

const DetailKelasView = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kelas/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);
  return (
    <div className="p-4 w-full space-y-3">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Detail kelas</h1>

        <Link
          href="/list/kelas"
          className="bg-lamaPurple text-white py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-white p-4 rounded-md space-y-2">
        <h3 className="text-sm font-semibold">Data Kelas</h3>
        <table className="w-full md:w-1/2">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">ID</th>
              <td className="px-4 py-2 text-left border border-gray-200">
                {id}
              </td>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">
                Nama Kelas
              </th>
              <td className="px-4 py-2 text-left border border-gray-200">
                {data?.nama}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">
                Wali Kelas
              </th>
              <td className="px-4 py-2 text-left border border-gray-200">
                {data?.waliKelas ? data?.waliKelas?.name : "-"}
              </td>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">
                Ketua Kelas
              </th>
              <td className="px-4 py-2 text-left border border-gray-200">
                {data?.ketuaKelasId
                  ? data?.siswas.find((s: any) => s.id === data?.ketuaKelasId)
                      ?.nama
                  : "-"}
              </td>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">
                Jumlah Siswa
              </th>
              <td className="px-4 py-2 text-left border border-gray-200">
                {data?.siswas.length}
              </td>
            </tr>
          </tbody>
        </table>
        <h3 className="text-sm font-semibold">Data Siswa</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border border-gray-200">No</th>
              <th className="px-4 py-2 text-left border border-gray-200">
                Nama Siswa
              </th>
              <th className="px-4 py-2 text-left border border-gray-200">
                NIS
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.siswas.map((s: any, index: number) => (
              <tr key={s.id}>
                <td className="px-4 py-2 text-left border border-gray-200">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-left border border-gray-200">
                  {s.nama}
                </td>
                <td className="px-4 py-2 text-left border border-gray-200">
                  {s.nis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailKelasView;
