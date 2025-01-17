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
} from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

const ListKelasView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // State for search input
  const { token } = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalAdd, setModalAdd] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [guruNotWaliKelas, setGuruNotWaliKelas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = useForm();

  const fetchKelas = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kelas/search`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/kelas?take=${take}&skip=${skip}`,
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
      } else {
        setData([]);
        setTotal(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const fetchGuruNotWaliKelas = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gurus/not/walikelas`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setGuruNotWaliKelas(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchKelas();
      fetchGuruNotWaliKelas();
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
    fetchKelas();
  };

  const onSubmitAddKelas = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (response.status === 201) {
        setAlertMessage(result.message);
        setAlertType("success");
      } else {
        setAlertMessage(result.message);
        setAlertType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setAlertMessage("Terjadi kesalahan saat membuat kelas.");
      setAlertType("error");
    } finally {
      setModalAdd(false);
      setLoading(false);
    }
  };

  const handleDeleteKelas = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/delete/${id}`,
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
        fetchKelas();
      } else {
        setAlertMessage(result.message);
        setAlertType("error");
      }
    } catch (error) {
      console.log(error);
      setAlertMessage("Terjadi Kesalahan saat menghapus, Ulangi kembali!");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Data Kelas</h1>

      {alertMessage && (
        <div
          className={`px-4 py-2 text-sm rounded-md ${
            alertType === "success" ? "bg-green-400" : "bg-red-400"
          } text-white flex items-center justify-between`}
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
                disabled={!search}
                type="submit"
                className="p-2 disabled:cursor-not-allowed bg-lamaSky text-white rounded"
              >
                <FaSearch />
              </button>
            </form>
            <div className="flex gap-3 items-center flex-wrap">
              <button
                onClick={() => setModalAdd(true)}
                className="py-2 px-4 rounded-md bg-green-400 text-white text-xs font-semibold"
              >
                Tambah Kelas
              </button>
              <Link
                href={"/import/kelas"}
                className="p-2 bg-yellow-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Import</span>
                <FaFileExcel />
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/kelas/export/excel?take=${take}&skip=${skip}`}
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
                <th className="px-4 py-2 text-left border">Nama Kelas</th>
                <th className="px-4 py-2 text-left border">Wali Kelas</th>
                <th className="px-4 py-2 text-left border">Tanggal Dibuat</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data?.kelas.map((item: any, index: number) => (
                  <tr key={index} className="border-gray-200">
                    <td className="px-4 py-2 text-left border">
                      {skip + index + 1}
                    </td>
                    <td className="px-4 py-2 text-left border">{item.nama}</td>
                    <td className="px-4 py-2 text-left border">
                      {item.waliKelas ? item?.waliKelas?.name : "-"}
                    </td>
                    <td className="px-4 py-2 text-left border">
                      {item.createdAt.split("T")[0]}
                    </td>
                    <td className="px-4 py-2 text-left border">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/list/kelas/${item.id}`}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={`/list/kelas/edit/${item.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaPencilAlt />
                        </Link>
                        <button
                          onClick={() =>
                            confirm("Apakah anda yakin mau menghapus?") &&
                            handleDeleteKelas(item.id)
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

      {modalAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[90%] md:w-1/3 p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tambah Kelas</h2>
            <form
              action=""
              onSubmit={handleSubmit(onSubmitAddKelas)}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Nama Kelas"
                {...register("nama", {
                  required: {
                    value: true,
                    message: "Nama kelas harus diisi",
                  },
                })}
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.nama ? "border-red-500" : ""
                }`}
              />
              {errors.nama && (
                <span className="text-red-500 text-xs">
                  {errors.nama.message}
                </span>
              )}

              <select
                {...register("waliKelasId", {
                  required: {
                    value: true,
                    message: "Walikelas harus diisi",
                  },
                })}
                id=""
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.waliKelasId ? "border-red-500" : ""
                }`}
              >
                <option value="">Pilih Walikelas</option>
                {guruNotWaliKelas.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-400 text-white py-2 px-4 rounded-md border-none w-max"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setModalAdd(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded-md border-none w-max"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListKelasView;
