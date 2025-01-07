"use client";

import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaEye,
  FaFileExcel,
  FaPencilAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import Loading from "@/components/Loading";

const ListAbsensiGuruByIdGuruView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token, user }: any = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/absensi_guru/guru/${user?.guru.id}?take=${take}&skip=${skip}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setData(result.data.absensiGuru);
      setTotal(result.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSiswa();
    }
  }, [token, take, skip]);

  if (loading) return <Loading />;

  const handleTakeChange = (e: any) => {
    setTake(Number(e.target.value));
    setSkip(0);
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Absensi Guru</h1>

      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="mb-3 flex justify-between items-start flex-col md:flex-row gap-3">
          <div className="flex gap-3 flex-wrap">
            <div>
              <label htmlFor="take" className="mr-2">
                Show:
              </label>
              <select
                id="take"
                value={take}
                onChange={handleTakeChange}
                className="py-1 px-2 border rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={total}>Semua</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 flex-col md:flex-row md:items-center">
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/absensi_guru/export/excel?take=${take}&skip=${skip}`}
              className="p-2 w-max bg-green-500 text-white rounded flex gap-2"
            >
              <span className="text-xs">Export</span>
              <FaFileExcel />
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">Nama Guru</th>
                <th className="px-4 py-2 text-left border">Tanggal</th>
                <th className="px-4 py-2 text-left border">Status</th>
                <th className="px-4 py-2 text-left border">Kelas</th>
                <th className="px-4 py-2 text-left border">Jam Pelajaran</th>
                <th className="px-4 py-2 text-left border">Mapel</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">
                    {skip + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    {item.guru.nama}
                  </td>
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
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 text-xs text-white rounded bg-blue-400">
                      {item.kelas.nama}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 text-xs text-white rounded bg-red-400">
                      {item.jam_mulai} - {item.jam_selesai}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 text-xs text-white rounded bg-yellow-400">
                      {item.mapel.nama_mapel}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-left border">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/list/absensi_guru/${item.id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEye />
                      </Link>
                      {/* <button className="text-blue-500 hover:text-blue-700">
                        <FaPencilAlt />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-500">
            Showing {skip + 1} to {Math.min(skip + take, total)} of {total}{" "}
            entries
          </span>
          <div className="flex gap-2">
            <button
              disabled={skip === 0}
              onClick={() => handlePageChange(skip - take)}
              className="p-2 bg-lamaSky text-white disabled:cursor-not-allowed disabled:opacity-50 rounded"
            >
              Previous
            </button>
            <button
              disabled={skip + take >= total}
              onClick={() => handlePageChange(skip + take)}
              className="p-2 bg-lamaSky text-white disabled:cursor-not-allowed disabled:opacity-50 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAbsensiGuruByIdGuruView;
