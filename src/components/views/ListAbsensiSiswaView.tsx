"use client";

import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import {
  FaEye,
  FaFileExcel,
  FaPencilAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

const ListAbsensiSiswaView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [kelas, setKelas] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataKelas, setDataKelas] = useState([]);

  const fetchKelas = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setDataKelas(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchKelas();
    }
  }, [token]);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa?take=${take}&skip=${skip}`;
      if (search) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/search?take=${take}&skip=${skip}`;
      }
      if (kelas) {
        url += `&kelas_id=${kelas}`;
      }
      if (startDate) {
        url += `&start_date=${startDate}`;
      }
      if (endDate) {
        url += `&end_date=${endDate}`;
      }

      const response = await fetch(url, {
        method: search ? "POST" : "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: search ? JSON.stringify({ keyword: search }) : null,
      });

      const result = await response.json();
      setData(result.data.absensiSiswa);
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
  }, [token, take, skip, kelas, startDate, endDate]);

  if (loading) return <Loading />;

  const handleTakeChange = (e: any) => {
    setTake(Number(e.target.value));
    setSkip(0);
  };

  const handleKelasChange = (e: any) => {
    setKelas(e.target.value);
    setSkip(0);
    fetchSiswa();
  };

  const handleStartDateChange = (e: any) => {
    setStartDate(e.target.value);
    setSkip(0);
    fetchSiswa();
  };

  const handleEndDateChange = (e: any) => {
    setEndDate(e.target.value);
    setSkip(0);
    fetchSiswa();
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSkip(0);
    fetchSiswa();
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Absensi Siswa</h1>

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
            <div>
              <label htmlFor="kelas" className="mr-2">
                Kelas:
              </label>
              <select
                id="kelas"
                value={kelas}
                onChange={handleKelasChange}
                className="py-1 px-2 border rounded"
              >
                <option value="">Semua</option>
                {dataKelas.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="mr-2">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className="py-1 px-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="mr-2">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                className="py-1 px-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-3 flex-col md:flex-row md:items-center">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 w-full md:w-auto items-center"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-lamaSky"
              />
              <button
                disabled={!search}
                type="submit"
                className="p-2 disabled:cursor-not-allowed bg-lamaSky text-white rounded"
              >
                <FaSearch />
              </button>
            </form>
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/export/excel?take=${take}&skip=${skip}&kelas_id=${kelas}&start_date=${startDate}&end_date=${endDate}`}
              className="p-2 bg-green-500 text-white rounded flex gap-2"
            >
              <span className="text-xs md:block hidden">Export</span>
              <FaFileExcel />
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">Nama Siswa</th>
                <th className="px-4 py-2 text-left border">Tanggal</th>
                <th className="px-4 py-2 text-left border">Status</th>
                <th className="px-4 py-2 text-left border">Kelas</th>
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
                    {item.siswa.nama}
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
                    <span className="px-2 py-1 text-xs text-white rounded bg-green-400">
                      {item.kelas.nama}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-left border">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/list/absensi_siswa/${item.id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEye />
                      </Link>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaPencilAlt />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
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
              className="px-2 py-1 text-sm bg-blue-500 text-white disabled:cursor-not-allowed disabled:opacity-50 rounded"
            >
              Previous
            </button>
            <button
              disabled={skip + take >= total}
              onClick={() => handlePageChange(skip + take)}
              className="px-2 py-1 text-sm bg-blue-500 text-white disabled:cursor-not-allowed disabled:opacity-50 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAbsensiSiswaView;
