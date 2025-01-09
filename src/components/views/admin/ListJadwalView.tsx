"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { FaTrash, FaPencilAlt, FaEye, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loading";
import { AiOutlineClose } from "react-icons/ai";

const ListJadwalView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // State for search input
  const { token } = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  }: any = useForm();

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jadwals/search`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/jadwals?take=${take}&skip=${skip}`,
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
      setData(result.data);
      setTotal(result.data.total || 0); // Handle total for search results
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [take, skip]);

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
    fetchJadwal();
  };

  const handleDeleteMapel = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jadwals/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        setAlertMessage(result.message);
        setAlertType("success");
        fetchJadwal();
      } else {
        setAlertMessage(result.message);
        setAlertType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Jadwal</h1>

      {alertMessage && (
        <div
          className={`px-4 py-2 text-sm rounded-md ${
            alertType === "success" ? "bg-green-400" : "bg-red-400"
          } text-white flex justify-between items-center`}
        >
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage("")}>
            <AiOutlineClose />
          </button>
        </div>
      )}

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
            </select>
          </div>
          <div className="flex gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-lamaSky"
              />
              <button
                type="submit"
                className="p-2 disabled:cursor-not-allowed bg-lamaSky text-white rounded"
              >
                <FaSearch />
              </button>
            </form>
            <Link
              href={"/list/jadwal/create"}
              className="py-2 px-4 rounded-md bg-green-400 text-white text-xs font-semibold"
            >
              Tambah Mapel
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">Guru</th>
                <th className="px-4 py-2 text-left border">Mapel</th>
                <th className="px-4 py-2 text-left border">Hari</th>
                <th className="px-4 py-2 text-left border">Kelas</th>
                <th className="px-4 py-2 text-left border">Waktu</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.jadwals.map((item: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">
                    {skip + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-lamaPurple text-white">
                      {item.guru.nama}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-yellow-400 text-white">
                      {item.mapel.nama_mapel}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    {" "}
                    <span className="px-2 py-1 rounded text-sm bg-blue-400 text-white">
                      {item.hari}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-green-400 text-white">
                      {item.kelas.nama}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-red-400 text-white">
                      {item.waktu_mulai} - {item.waktu_selesai}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/list/jadwal/edit/${item.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaPencilAlt />
                      </Link>
                      <button
                        onClick={() =>
                          confirm("Apakah anda yakin mau menghapus?") &&
                          handleDeleteMapel(item.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
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

export default ListJadwalView;
