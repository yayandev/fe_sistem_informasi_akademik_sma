"use client";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

const InputNilaiSiswaView = () => {
  const [tahunAjaran, setTahunAjaran] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token }: any = useAuth();

  const fetchTahunAjaran = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  const fethSiswaInClass = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/${user?.kelas.id}/siswas`,
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
        setSiswa(result.data.kelas.siswas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fethMapel = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mapels/all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        setMapel(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAll = async () => {
    try {
      await fetchTahunAjaran();
      await fethSiswaInClass();
      await fethMapel();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchAll();
    }
  }, [token, user]);

  if (loading) return <Loading />;

  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Input Nilai Siswa ({user?.kelas.nama})
        </h1>
        <Link
          href={"/list/guru/nilai_siswa"}
          className="bg-gray-400 hover:opacity-75 text-white font-bold py-2 px-3 text-sm rounded"
        >
          Kembali
        </Link>
      </div>

      <form className="bg-white w-full p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="siswa">
              Siswa
            </label>
            <select
              id="siswa"
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Pilih siswa</option>
              {siswa?.map((siswa: any) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="mapel">
              Mata Pelajaran
            </label>
            <select
              id="mapel"
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Pilih Mapel</option>
              {mapel?.map((mapel: any) => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.nama_mapel}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="tahunAjaran">
              Tahun Ajaran
            </label>
            <select
              id="tahunAjaran"
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Pilih Tahun Ajaran</option>
              {tahunAjaran?.map((tahunAjaran: any) => (
                <option key={tahunAjaran.id} value={tahunAjaran.id}>
                  {tahunAjaran.tahun_ajaran} - {tahunAjaran.semester}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="nilai_tugas">
              Nilai Tugas
            </label>
            <input
              type="number"
              id="nilai_tugas"
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="nilai_uts">
              Nilai UTS
            </label>
            <input
              type="number"
              id="nilai_uts"
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="space-y-1 w-full">
            <label className="text-sm font-semibold" htmlFor="nilai_uas">
              Nilai UAS
            </label>
            <input
              type="number"
              id="nilai_uas"
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <button className="bg-blue-400 hover:opacity-75 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputNilaiSiswaView;
