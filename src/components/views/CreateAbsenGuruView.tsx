"use client";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useForm } from "react-hook-form";
import Link from "next/link";

const CreateAbsenGuruView = () => {
  const [gurus, setGurus] = useState<any>([]);
  const [kelas, setKelas] = useState<any>([]);
  const [mapels, setMapels] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { user, token }: any = useAuth();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  }: any = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/absensi_guru/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guruId: data.guruId,
            kelasId: data.kelasId,
            mapelId: data.mapelId,
            tanggal: data.tanggal,
            status: data.status,
            keterangan: data.keterangan,
            jam_mulai: parseInt(data.jam_mulai),
            jam_selesai: parseInt(data.jam_selesai),
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setSuccess(true);
        setMessage(responseData.message);
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`);
        const responseData = await response.json();
        setSuccess(false);
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSuccess(false);
      setMessage("Gagal menyimpan absensi guru. Kesalahan server.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gurus/all`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setGurus(data.data);

        const responseKelas = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kelas/all`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const dataKelas = await responseKelas.json();
        setKelas(dataKelas.data);

        const responseMapel = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mapels/all`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const dataMapel = await responseMapel.json();
        setMapels(dataMapel.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Input Kehadiran Guru</h1>

      {success && message && (
        <div className="bg-green-500 text-white p-3 rounded-md">{message}</div>
      )}
      {!success && message && (
        <div className="bg-red-500 text-white p-3 rounded-md">{message}</div>
      )}

      <div className="w-full bg-white p-4 rounded-md">
        <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="space-y-1 w-full">
              <label htmlFor="guru" className="text-sm">
                Guru
              </label>
              <select
                id="guru"
                defaultValue=""
                {...register("guruId", {
                  required: {
                    value: true,
                    message: "Guru harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="" disabled>
                  Pilih Guru
                </option>
                {gurus?.map((guru: any) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.nama}
                  </option>
                ))}
              </select>

              {errors.guruId && (
                <span className="text-red-500 text-sm">
                  {errors.guruId.message}
                </span>
              )}
            </div>
            <div className="space-y-1 w-full">
              <label htmlFor="kelas" className="text-sm">
                Kelas
              </label>
              <select
                id="kelas"
                defaultValue={user?.siswa.kelas.id || ""}
                disabled
                {...register("kelasId", {
                  required: {
                    value: true,
                    message: "Kelas harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="">Pilih Kelas</option>
                {kelas?.map((kelas: any) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>

              {errors.kelasId && (
                <span className="text-red-500 text-sm">
                  {errors.kelasId.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="space-y-1 w-full">
              <label htmlFor="mapel" className="text-sm">
                Mata Pelajaran
              </label>
              <select
                id="mapel"
                {...register("mapelId", {
                  required: {
                    value: true,
                    message: "Mata Pelajaran harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="">Pilih Mata Pelajaran</option>

                {mapels?.map((mapel: any) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama_mapel}
                  </option>
                ))}
              </select>
              {errors.mapelId && (
                <span className="text-red-500 text-sm">
                  {errors.mapelId.message}
                </span>
              )}
            </div>
            <div className="space-y-1 w-full">
              <label htmlFor="mapel" className="text-sm">
                Status Kehadiran
              </label>
              <select
                name="status"
                id="status"
                {...register("status", {
                  required: {
                    value: true,
                    message: "Status harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="">Pilih Status</option>
                <option value="hadir">Hadir</option>
                <option value="sakit">Sakit</option>
                <option value="izin">Izin</option>
              </select>
              {errors.status && (
                <span className="text-red-500 text-sm">
                  {errors.status.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="space-y-1 w-full">
              <label htmlFor="jam_mulai" className="text-sm">
                Jam Mulai
              </label>
              <select
                id="jam_mulai"
                {...register("jam_mulai", {
                  required: {
                    value: true,
                    message: "Jam Mulai harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="">Pilih Jam</option>
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Jam ke {index + 1}
                  </option>
                ))}
              </select>
              {errors.jam_mulai && (
                <span className="text-red-500 text-sm">
                  {errors.jam_mulai.message}
                </span>
              )}
            </div>
            <div className="space-y-1 w-full">
              <label htmlFor="jam_selesai" className="text-sm">
                Jam Selesai
              </label>
              <select
                id="jam_selesai"
                {...register("jam_selesai", {
                  required: {
                    value: true,
                    message: "Jam Selesai harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
              >
                <option value="">Pilih Jam</option>
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Jam ke {index + 1}
                  </option>
                ))}
              </select>
              {errors.jam_selesai && (
                <span className="text-red-500 text-sm">
                  {errors.jam_selesai.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="space-y-1 w-full">
              <label htmlFor="mapel" className="text-sm">
                Tanggal Pelajaran
              </label>
              <input
                type="date"
                {...register("tanggal", {
                  required: {
                    value: true,
                    message: "Tanggal harus dipilih",
                  },
                })}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
                readOnly
                value={new Date().toISOString().split("T")[0]}
              />
              {errors.tanggal && (
                <span className="text-red-500 text-sm">
                  {errors.tanggal.message}
                </span>
              )}
            </div>
            <div className="space-y-1 w-full">
              <label htmlFor="keterangan" className="text-sm">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                id="keterangan"
                {...register("keterangan")}
                className="w-full p-2 border border-gray-300 focus:outline-blue-400 rounded-md"
                placeholder="Keterangan"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 rounded-md bg-blue-400 text-white"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
            <Link
              href={"/dashboard"}
              className="py-2 px-4 rounded-md bg-gray-400 text-white"
            >
              Kembali
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAbsenGuruView;
