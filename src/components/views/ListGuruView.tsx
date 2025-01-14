"use client";

import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useAuth } from "@/context/useAuth";
import {
  FaTrash,
  FaPencilAlt,
  FaEye,
  FaSearch,
  FaPlus,
  FaFileExcel,
} from "react-icons/fa";
import Link from "next/link";

const ListGuruView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // State for search input
  const { token } = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataShow, setDataShow]: any = useState(null);

  const fetchGuru = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gurus/search`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/gurus?take=${take}&skip=${skip}`,
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
      fetchGuru();
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
    fetchGuru();
  };

  const handleShowModalEdit = (guru: any) => {
    setDataShow(guru);
    setShowModalEdit(true);
  };

  const handleDelete = async (id: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gurus/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        fetchGuru();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Guru</h1>

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
          <div className="flex gap-2 md:items-center flex-col md:flex-row">
            <form onSubmit={handleSearch} className="flex gap-2">
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
                href={"/list/guru/create"}
                className="p-2 bg-blue-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Create</span>
                <FaPlus />
              </Link>
              <Link
                href={"/import/guru"}
                className="p-2 bg-yellow-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Import</span>
                <FaFileExcel />
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/gurus/export/excel?take=${take}&skip=${skip}`}
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
                <th className="px-4 py-2 text-left border">Nama Guru</th>
                <th className="px-4 py-2 text-left border">NIP</th>
                <th className="px-4 py-2 text-left border">No Telp</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data?.gurus.map((guru: any, index: number) => (
                  <tr key={index} className="border-gray-200">
                    <td className="px-4 py-2 text-left border">
                      {skip + index + 1}
                    </td>
                    <td className="px-4 py-2 text-left border">{guru.nama}</td>
                    <td className="px-4 py-2 text-left border">{guru.nip}</td>
                    <td className="px-4 py-2 text-left border">
                      {guru.no_telp}
                    </td>
                    <td className="px-4 py-2 text-left border">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleShowModalEdit(guru)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaEye />
                        </button>
                        <Link
                          href={`/list/guru/${guru.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaPencilAlt />
                        </Link>
                        <button
                          onClick={() =>
                            confirm("Are you sure?") && handleDelete(guru.id)
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

      {/* modal show */}
      {showModalEdit && dataShow && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:pt-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Detail Guru
                    </h3>
                    <div className="mt-2">
                      <table className="min-w-full bg-white border border-gray-200">
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border">Nama</td>
                            <td className="px-4 py-2 border">
                              {dataShow.nama}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">NIP</td>
                            <td className="px-4 py-2 border">{dataShow.nip}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">Jenis Kelamin</td>
                            <td className="px-4 py-2 border">
                              {dataShow.jenis_kelamin}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">Alamat</td>
                            <td className="px-4 py-2 border">
                              {dataShow.alamat}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">No Telp</td>
                            <td className="px-4 py-2 border">
                              {dataShow.no_telp}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">Email</td>
                            <td className="px-4 py-2 border">
                              {dataShow.email}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModalEdit(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGuruView;
