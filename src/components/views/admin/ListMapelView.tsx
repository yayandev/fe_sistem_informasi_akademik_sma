"use client";

import { useEffect, useState } from "react";
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
import Loading from "@/components/Loading";
import { AiOutlineClose } from "react-icons/ai";

const ListMapelView = () => {
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
  const [modalEdit, setModalEdit] = useState(false);
  const [editData, setEditData]: any = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  }: any = useForm();

  const fetchMapel = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mapels/search`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/mapels?take=${take}&skip=${skip}`,
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
    fetchMapel();
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
    fetchMapel();
  };

  const onSubmitAddMapel = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mapels/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_mapel: data.nama_mapel,
            kkm: Number(data.kkm),
          }),
        }
      );

      const result = await response.json();
      if (response.status === 201) {
        setAlertMessage(result.message);
        setAlertType("success");
        reset();
        fetchMapel();
      } else {
        setAlertMessage(result.message);
        setAlertType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setAlertMessage("Terjadi kesalahan saat membuat Mapel.");
      setAlertType("error");
    } finally {
      setModalAdd(false);
      setLoading(false);
    }
  };

  const showModalEdit = (data: any) => {
    setModalEdit(true);
    setEditData(data);
    setValue("nama_mapel", data.nama_mapel);
    setValue("kkm", data.kkm);
  };

  const closeModalEdit = () => {
    setModalEdit(false);
    setEditData(null);
    reset();
  };

  const onSubmitEditMapel = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mapels/update/${editData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_mapel: data.nama_mapel,
            kkm: Number(data.kkm),
          }),
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        setAlertMessage(result.message);
        setAlertType("success");
        fetchMapel();
        closeModalEdit();
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

  const handleDeleteMapel = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mapels/delete/${id}`,
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
        fetchMapel();
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
      <h1 className="text-xl font-semibold">Data Mapel</h1>

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
            <div className="flex gap-3 flex-wrap items-center">
              <button
                onClick={() => setModalAdd(true)}
                className="py-2 px-4 rounded-md bg-green-400 text-white text-xs font-semibold"
              >
                Tambah Mapel
              </button>
              <Link
                href={"/import/mapel"}
                className="p-2 bg-yellow-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Import</span>
                <FaFileExcel />
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/mapels/export/excel?take=${take}&skip=${skip}`}
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
                <th className="px-4 py-2 text-left border">Nama Mapel</th>
                <th className="px-4 py-2 text-left border">KKM</th>
                <th className="px-4 py-2 text-left border">Tanggal Dibuat</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.mapel.map((item: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">
                    {skip + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    {item.nama_mapel}
                  </td>
                  <td className="px-4 py-2 text-left border">{item.kkm}</td>
                  <td className="px-4 py-2 text-left border">
                    {item.createdAt.split("T")[0]}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => showModalEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaPencilAlt />
                      </button>
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

      {modalAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[90%] md:w-1/3 p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tambah Mapel</h2>
            <form
              action=""
              onSubmit={handleSubmit(onSubmitAddMapel)}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Nama Pelajaran"
                {...register("nama_mapel", {
                  required: {
                    value: true,
                    message: "Nama pelajaran harus diisi",
                  },
                })}
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.nama_mapel ? "border-red-500" : ""
                }`}
              />
              {errors.nama_mapel && (
                <span className="text-red-500 text-xs">
                  {errors.nama_mapel.message}
                </span>
              )}

              <input
                type="number"
                placeholder="KKM"
                {...register("kkm", {
                  required: {
                    value: true,
                    message: "KKM harus diisi",
                  },
                })}
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.kkm ? "border-red-500" : ""
                }`}
              />
              {errors.kkm && (
                <span className="text-red-500 text-xs">
                  {errors.kkm.message}
                </span>
              )}
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

      {modalEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[90%] md:w-1/3 p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Mapel</h2>
            <form
              action=""
              onSubmit={handleSubmit(onSubmitEditMapel)}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Nama Pelajaran"
                {...register("nama_mapel", {
                  required: {
                    value: true,
                    message: "Nama pelajaran harus diisi",
                  },
                })}
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.nama_mapel ? "border-red-500" : ""
                }`}
              />
              {errors.nama_mapel && (
                <span className="text-red-500 text-xs">
                  {errors.nama_mapel.message}
                </span>
              )}

              <input
                type="number"
                placeholder="KKM"
                {...register("kkm", {
                  required: {
                    value: true,
                    message: "KKM harus diisi",
                  },
                })}
                className={`w-full p-2 border border-gray-300 rounded focus:outline-lamaSky ${
                  errors.kkm ? "border-red-500" : ""
                }`}
              />
              {errors.kkm && (
                <span className="text-red-500 text-xs">
                  {errors.kkm.message}
                </span>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-400 text-white py-2 px-4 rounded-md border-none w-max"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => closeModalEdit()}
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

export default ListMapelView;
