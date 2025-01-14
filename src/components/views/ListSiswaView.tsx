"use client";

import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useAuth } from "@/context/useAuth";
import {
  FaTrash,
  FaPencilAlt,
  FaEye,
  FaSearch,
  FaFileExcel,
  FaPlus,
} from "react-icons/fa";
import Link from "next/link";

const ListSiswaView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // State for search input
  const { token } = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/siswas/search`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyword: search }),
          }
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/siswas?take=${take}&skip=${skip}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      const result = await response.json();
      if (response.status === 200) {
        setData(result.data);
        setTotal(result.data.total || 0); // Handle total for search results
      }
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
    setSkip(0); // Reset to first page
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSkip(0); // Reset to first page for search results
    fetchSiswa();
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Siswa</h1>

      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="mb-3 flex justify-between items-start flex-col md:flex-row gap-3">
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

          <div className="flex gap-2 md:items-center flex-col md:flex-row">
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
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
            <div className="flex gap-2">
              <Link
                href={"/list/siswa/create"}
                className="p-2 bg-blue-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Create</span>
                <FaPlus />
              </Link>
              <Link
                href={"/import/siswa"}
                className="p-2 bg-yellow-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Import</span>
                <FaFileExcel />
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/siswas/export/excel?take=${take}&skip=${skip}`}
                className="p-2 bg-green-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Export</span>
                <FaFileExcel />
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">NIS</th>
                <th className="px-4 py-2 text-left border">Nama Siswa</th>
                <th className="px-4 py-2 text-left border">Kelas</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.siswas.map((siswa: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">
                    {skip + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border">{siswa.nis}</td>
                  <td className="px-4 py-2 text-left border">{siswa.nama}</td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 text-xs py-1 bg-green-200 rounded">
                      {siswa.kelas.nama ? siswa.kelas.nama : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/list/siswa/${siswa.id}`}
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
            Showing {skip + 1} to {skip + take} of {total} entries
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

export default ListSiswaView;
