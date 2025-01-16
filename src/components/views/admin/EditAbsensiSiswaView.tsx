"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";

const EditAbsensiSiswaView = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [dataAbsen, setDataAbsen]: any = useState(null);
  const { token } = useAuth();

  const fetchDataAbsen = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (response.status === 200) {
      setDataAbsen(result.data);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      fetchDataAbsen();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-3 w-full p-4">
      <h1 className="text-xl font-semibold">Edit Absensi Siswa</h1>

      <div className="bg-white w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1 w-full">
          <label htmlFor="siswaId">ID Siswa</label>
          <input
            type="text"
            readOnly
            className="px-3 py-2 rounded-md border-gray-200 border focus:outline-lamaSky w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="kelasId">ID Kelas</label>
          <input
            type="text"
            readOnly
            className="px-3 py-2 rounded-md border-gray-200 border focus:outline-lamaSky w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="">Nama Siswa</label>
          <input
            type="text"
            className="px-3 py-2 rounded-md border-gray-200 border focus:outline-lamaSky w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="status">Status Kehadiran</label>
          <select
            id="status"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-lamaSky"
          >
            <option value="">Pilih status</option>
            <option value="alpa">Alpa</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="hadir">Hadir</option>
          </select>
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="tanggal">Tanggal</label>
          <input
            type="date"
            className="px-3 py-2 rounded-md border-gray-200 border focus:outline-lamaSky w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="keterangan">Keterangan</label>
          <textarea className="px-3 py-2 rounded-md border-gray-200 border focus:outline-lamaSky w-full"></textarea>
        </div>
      </div>
    </div>
  );
};

export default EditAbsensiSiswaView;
