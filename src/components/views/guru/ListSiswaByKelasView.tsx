"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import {
  FaTrash,
  FaPencilAlt,
  FaEye,
  FaSearch,
  FaFileExcel,
  FaPlus,
  FaFilePdf, // Import icon PDF
} from "react-icons/fa";
import Link from "next/link";
import Loading from "@/components/Loading";
import jsPDF from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas

const ListSiswaByKelasView = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token, user }: any = useAuth();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      let response;
      if (search) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/siswas/search?id_kelas=${user?.kelas.id}&take=${take}&skip=${skip}`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/siswas?take=${take}&skip=${skip}&id_kelas=${user?.kelas.id}`,
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
      setData(result?.data);
      setTotal(result?.data?.total || 0);
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

  const generatePDF = async () => {
    const input: any = document.getElementById("siswaTable");
    const canvas = await html2canvas(input, {
      ignoreElements: (element) => element.classList.contains("no-print"),
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("data-siswa.pdf");
  };

  if (loading) return <Loading />;

  const handleTakeChange = (e: any) => {
    setTake(Number(e.target.value));
    setSkip(0);
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
      <h1 className="text-xl font-semibold">Data Siswa {user?.kelas.name}</h1>

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
                type="submit"
                className="p-2 disabled:cursor-not-allowed bg-lamaSky text-white rounded"
              >
                <FaSearch />
              </button>
            </form>
            <div className="flex gap-2">
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/siswas/export/excel?take=${take}&skip=${skip}`}
                className="p-2 bg-green-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Export</span>
                <FaFileExcel />
              </Link>
              <button
                onClick={generatePDF}
                className="p-2 bg-red-500 text-white rounded flex gap-2"
              >
                <span className="text-xs md:block hidden">Print PDF</span>
                <FaFilePdf />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <table id="siswaTable" className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">NIS</th>
                <th className="px-4 py-2 text-left border">Nama Siswa</th>
                <th className="px-4 py-2 text-left border no-print">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.siswas.map((siswa: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">
                    {skip + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border">{siswa?.nis}</td>
                  <td className="px-4 py-2 text-left border">{siswa?.nama}</td>
                  <td className="px-4 py-2 text-left border no-print">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/list/siswa/${siswa?.id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEye />
                      </Link>
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

export default ListSiswaByKelasView;
