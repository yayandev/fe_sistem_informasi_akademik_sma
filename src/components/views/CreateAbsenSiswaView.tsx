"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../Loading";

const CreateAbsenSiswaView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState(null);
  const { user, token }: any = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/kelas/${user?.siswa.kelas.id}/siswas`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            setData(responseData.data);
            setLoading(false);
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            setSuccess(false);
            setMessage("Gagal mengambil data kelas.");
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const generateAbsensiData = () => {
    const absensiData = data?.kelas?.siswas?.map((siswa: any) => {
      const absensiRadio: any = document.querySelector(
        `input[name="absensi_${siswa.id}"]:checked`
      );
      const status = absensiRadio ? absensiRadio.value : "alpa";
      const keterangan = "";
      return {
        siswaId: siswa.id,
        status: status,
        keterangan: keterangan,
        tanggal: today,
        kelasId: data.kelas.id,
      };
    });

    return { dataJson: absensiData };
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const absensiData = generateAbsensiData();
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/create-many`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(absensiData),
        }
      );
      const data = await response.json();

      console.log(data);

      setSuccess(data.success);
      setMessage(data.message);
    } catch (error) {
      console.error("Fetch error:", error);
      setSuccess(false);
      setMessage("Gagal menyimpan absensi siswa. Kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-3 w-full box-border">
      <h1 className="text-xl font-semibold">Input Absen Siswa</h1>
      {message && (
        <div
          className={`${
            success ? "bg-green-300" : "bg-red-300"
          } py-2 px-3 rounded-md w-full box-border text-xs ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
      {user?.siswa.id === user?.siswa.kelas.ketuaKelasId ? (
        <div className="bg-white p-4 rounded-md w-full box-border">
          <div className="flex flex-col-reverse md:flex-row items-start gap-3 justify-between">
            <table className="w-full md:w-1/2 overflow-x-auto">
              <tbody>
                <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                  <th className="text-start">ID Kelas</th>
                  <th className="text-start">:</th>
                  <td className="text-start">{data?.kelas?.id}</td>
                </tr>
                <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                  <th className="text-start">Nama Kelas</th>
                  <th className="text-start">:</th>
                  <td className="text-start">{data?.kelas?.nama}</td>
                </tr>
                <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                  <th className="text-start">Ketua Kelas</th>
                  <th className="text-start">:</th>
                  <td className="text-start">{user?.name}</td>
                </tr>
                <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                  <th className="text-start">Tanggal</th>
                  <th className="text-start">:</th>
                  <td className="text-start">{today}</td>
                </tr>
                <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                  <th className="text-start">Jumlah Siswa</th>
                  <th className="text-start">:</th>
                  <td className="text-start">{data?.totalSiswa}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <table className="w-full mt-4 border-collapse border border-gray-200 overflow-x-auto box-border">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="border border-gray-200 p-2 text-start">Nama</th>
                <th className="border border-gray-200 p-2 text-start">NIS</th>
                <th className="border border-gray-200 p-2">Absensi</th>
              </tr>
            </thead>
            <tbody>
              {data?.kelas?.siswas?.map((siswa: any) => (
                <tr
                  key={siswa.id}
                  className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
                >
                  <td className="border border-gray-200 p-2 text-start">
                    {siswa.nama}
                  </td>
                  <td className="border border-gray-200 p-2 text-start">
                    {siswa.nis}
                  </td>
                  <td className="border border-gray-200 p-2">
                    <div className="flex space-x-4 justify-center">
                      <label>
                        <input
                          type="radio"
                          name={`absensi_${siswa.id}`}
                          value="hadir"
                        />
                        Hadir
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`absensi_${siswa.id}`}
                          value="ijin"
                        />
                        Ijin
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`absensi_${siswa.id}`}
                          value="alpa"
                        />
                        Alpa
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-3 items-center mt-3">
            <Link
              href={"/absen_siswa"}
              className="py-2 px-4 bg-gray-400  text-white rounded-md"
            >
              Kembali
            </Link>
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-lamaSky text-white rounded-md "
            >
              Simpan
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-md w-full box-border">
          <div className="flex justify-center">
            <div className="space-y-1">
              <h3 className="text-center font-semibold text-red-500">
                Kamu Bukan Ketua Kelas!
              </h3>
              <p className="text-center text-gray-500 text-xs">
                Hubungi Ketua Kelas Untuk Melakukan Absensi!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAbsenSiswaView;
