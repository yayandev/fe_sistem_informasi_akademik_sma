"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

const EditJadwalView = ({ id }: { id: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  }: any = useForm();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [gurus, setGurus] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token }: any = useAuth();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jadwals/update/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlertMessage(result.message);
        setAlertType("success");
      } else {
        setAlertMessage(result.message);
        setAlertType("");
      }
    } catch (error) {
      console.log(error);
      setAlertMessage("Terjadi Kesalahan Saat menyimpan data, Coba Kemabali!");
      setAlertType("");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const resDataJadwal = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jadwals/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataJadwal = await resDataJadwal.json();

      const data = dataJadwal?.data;

      setValue("hari", data?.hari);
      setValue("waktu_mulai", data?.waktu_mulai);
      setValue("waktu_selesai", data?.waktu_selesai);
      setValue("kelasId", data?.kelasId);
      setValue("mapelId", data?.mapelId);
      setValue("guruId", data?.guruId);

      const resGurus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gurus`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resDataGurus = await resGurus.json();
      setGurus(resDataGurus.data.gurus);

      const resKelas = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resDataKelas = await resKelas.json();
      setKelas(resDataKelas.data.kelas);

      const resMapel = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mapels`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resDataMapel = await resMapel.json();
      setMapel(resDataMapel.data.mapel);
    } catch (error: any) {
      console.log(error);
      setAlertMessage(error.message);
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Edit Jadwal</h1>

      {alertMessage && (
        <div
          className={`${
            alertType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } px-4 py-2 text-sm rounded-md flex justify-between items-center`}
        >
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage("")}>
            <AiOutlineClose />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full p-4 space-y-3"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full space-y-1">
            <label htmlFor="mapelId">Mapel</label>
            <select
              id="mapelId"
              {...register("mapelId", {
                required: {
                  value: true,
                  message: "Mapel harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.mapelId ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Mapel
              </option>
              {mapel?.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.nama_mapel}
                </option>
              ))}
            </select>
            {errors.mapelId && (
              <p className="text-red-500 text-sm">{errors.mapelId.message}</p>
            )}
          </div>
          <div className="w-full space-y-1">
            <label htmlFor="guruId">Guru</label>
            <select
              id="guruId"
              {...register("guruId", {
                required: {
                  value: true,
                  message: "Guru harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.guruId ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Guru
              </option>
              {gurus?.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
            {errors.guruId && (
              <p className="text-red-500 text-sm">{errors.guruId.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full space-y-1">
            <label htmlFor="kelasId">Kelas</label>
            <select
              id="kelasId"
              {...register("kelasId", {
                required: {
                  value: true,
                  message: "Kelas harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.kelasId ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Kelas
              </option>
              {kelas?.map((k: any) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
            {errors.kelasId && (
              <p className="text-red-500 text-sm">{errors.kelasId.message}</p>
            )}
          </div>
          <div className="w-full space-y-1">
            <label htmlFor="hari">Hari</label>
            <select
              id="hari"
              {...register("hari", {
                required: {
                  value: true,
                  message: "Hari harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.hari ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Hari
              </option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
            {errors.hari && (
              <p className="text-red-500 text-sm">{errors.hari.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full space-y-1">
            <label htmlFor="waktu_mulai">Waktu Mulai</label>
            <input
              type="time"
              id="waktu_mulai"
              {...register("waktu_mulai", {
                required: {
                  value: true,
                  message: "Waktu Mulai harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.waktu_mulai ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.waktu_mulai && (
              <p className="text-red-500 text-sm">
                {errors.waktu_mulai.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-1">
            <label htmlFor="waktu_selesai">Waktu Selesai</label>
            <input
              type="time"
              id="waktu_selesai"
              {...register("waktu_selesai", {
                required: {
                  value: true,
                  message: "Waktu Selesai harus diisi",
                },
              })}
              className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                errors.waktu_selesai ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.waktu_selesai && (
              <p className="text-red-500 text-sm">
                {errors.waktu_selesai.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-lamaPurple text-white px-4 py-2 rounded-md"
          >
            Simpan
          </button>
          <Link
            href={"/list/jadwal"}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Kembali
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditJadwalView;
