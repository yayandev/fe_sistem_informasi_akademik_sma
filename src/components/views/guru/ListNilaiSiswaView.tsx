"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaPencilAlt } from "react-icons/fa";

const ListNilaiSiswaView = () => {
  const [tahunAjaran, setTahunAjaran] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user }: any = useAuth();
  const [tahunAjaranId, setTahunAjaranId] = useState("");
  const [data, setData]: any = useState([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTahunAjaran = async () => {
    try {
      setLoading(true);
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tahun_ajaran`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = await response.json();
      if (response.status === 200) {
        setTahunAjaran(result.data.tahunAjaran);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  const fetchNilaiSiswa = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nilais?tahun_ajaran_id=${tahunAjaranId}&guru_id=${user?.guru.id}&take=${take}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        setData(result.data.nilais);
        setTotal(result.data.total || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNilaiSiswa();
    }
  }, [tahunAjaranId, user, skip]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * take);
  };

  const totalPages = Math.ceil(total / take);

  return (
    <div className="space-y-3 w-full p-4">
      <h1 className="text-xl font-semibold">Data Nilai Siswa</h1>

      <div className="flex justify-between items-center">
        <select
          onChange={(e) => setTahunAjaranId(e.target.value)}
          value={tahunAjaranId}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max p-2.5"
        >
          <option value="">Semua Tahun Ajaran</option>
          {tahunAjaran?.map((item: any) => (
            <option value={item.id} key={item.id}>
              {item.tahun_ajaran} - {item.semester}
            </option>
          ))}
        </select>
        <Link
          href={"/list/guru/nilai_siswa/create"}
          className="bg-sky-500 text-white py-2 px-3 text-sm rounded-md"
        >
          Input Nilai
        </Link>
      </div>

      <div className="w-full bg-white p-4 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6 border">
                No
              </th>
              <th scope="col" className="py-3 px-6 border">
                Nama Siswa
              </th>
              <th scope="col" className="py-3 px-6 border">
                Mapel
              </th>
              <th scope="col" className="py-3 px-6 border">
                Tahun Ajaran
              </th>
              <th scope="col" className="py-3 px-6 border">
                Semester
              </th>
              <th scope="col" className="py-3 px-6 border">
                Tanggal Input
              </th>
              <th scope="col" className="py-3 px-6 border">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any, index: number) => (
              <tr className="bg-white hover:bg-gray-50" key={index}>
                <td className="py-4 px-6 border">{skip + index + 1}</td>
                <td className="py-4 px-6 border">{item.siswa.nama}</td>
                <td className="py-4 px-6 border">{item.mapel.nama_mapel}</td>
                <td className="py-4 px-6 border">
                  {item.tahun_ajaran.tahun_ajaran}
                </td>
                <td className="py-4 px-6 border">
                  {item.tahun_ajaran.semester}
                </td>
                <td className="py-4 px-6 border">
                  {item.created_at.split("T")[0]}
                </td>
                <td className="py-4 px-6 border">
                  <div className="flex gap-1 flex-wrap">
                    <Link
                      href={`/nilai_siswa/edit/${item.id}`}
                      className="bg-green-500 text-white py-2 px-3 text-sm rounded-md"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/nilai_siswa/edit/${item.id}`}
                      className="bg-sky-500 text-white py-2 px-3 text-sm rounded-md"
                    >
                      <FaPencilAlt />
                    </Link>
                    <button className="bg-red-500 text-white py-2 px-3 text-sm rounded-md">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 border ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListNilaiSiswaView;
