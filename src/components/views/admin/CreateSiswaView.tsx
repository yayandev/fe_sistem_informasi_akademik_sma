"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreateSiswaView = () => {
  const [loading, setLoading] = useState(false);
  const [kelas, setKelas] = useState([]);
  const { token } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  }: any = useForm();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const fetchKelas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setKelas(result.data);
    } catch (error) {
      console.log(error);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchKelas();
    }
  }, [token]);

  if (loading) return <Loading />;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/siswas/create`,
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

      if (response.ok) {
        setAlertMessage(
          `${result.message}, Password default (${result.data.defaultPassword})`
        );
        setAlertType("success");
        reset();
      } else {
        setAlertMessage(result.message);
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("Terjadi kesalahan saat membuat siswa.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Buat Siswa</h1>

      {alertMessage && (
        <div
          className={`${
            alertType === "success" ? "bg-green-100" : "bg-red-100"
          } p-3 rounded-md`}
        >
          <p className="text-sm">{alertMessage}</p>
        </div>
      )}

      <div className="flex gap-3 flex-col md:flex-row">
        <div className="flex-1 bg-white p-3 space-y-3 rounded-md shadow-sm">
          <form
            action=""
            className="space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="space-y-1 w-full">
                <label htmlFor="name" className="text-sm">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nama"
                  {...register("nama", {
                    required: {
                      value: true,
                      message: "Nama harus diisi",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Nama hanya boleh mengandung huruf dan spasi",
                    },
                    minLength: {
                      value: 3,
                      message: "Nama minimal 3 karakter",
                    },
                  })}
                  className={`w-full p-2 border  focus:outline-lamaPurple rounded-md ${
                    errors.nama ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nama && (
                  <p className="text-xs text-red-400">
                    {errors.nama.message.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-1 w-full">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email harus diisi",
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Email tidak valid",
                    },
                  })}
                  placeholder="Email"
                  className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email.message.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="space-y-1 w-full">
                <label htmlFor="jenis_kelamin" className="text-sm">
                  Jenis Kelamin
                </label>
                <select
                  id="jenis_kelamin"
                  {...register("jenis_kelamin", {
                    required: {
                      value: true,
                      message: "Jenis Kelamin harus diisi",
                    },
                  })}
                  className={`w-full p-2 border  focus:outline-lamaPurple rounded-md ${
                    errors.jenis_kelamin ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected>
                    Pilih Jenis Kelamin
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {errors.jenis_kelamin && (
                  <p className="text-xs text-red-400">
                    {errors.jenis_kelamin.message.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-1 w-full">
                <label htmlFor="telepon" className="text-sm">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  id="telepon"
                  placeholder="08123456789"
                  {...register("no_telp", {
                    required: {
                      value: true,
                      message: "Nomor Telepon harus diisi",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Nomor Telepon harus berupa angka",
                    },
                    minLength: {
                      value: 10,
                      message: "Nomor Telepon minimal 10 angka",
                    },
                    maxLength: {
                      value: 13,
                      message: "Nomor Telepon maksimal 13 angka",
                    },
                  })}
                  className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                    errors.no_telp ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.no_telp && (
                  <p className="text-xs text-red-400">
                    {errors.no_telp.message.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="space-y-1 w-full">
                <label htmlFor="name" className="text-sm">
                  Kelas
                </label>
                <select
                  id="kelas"
                  {...register("kelasId", {
                    required: {
                      value: true,
                      message: "Kelas harus diisi",
                    },
                  })}
                  className={`w-full p-2 border  focus:outline-lamaPurple rounded-md ${
                    errors.kelasId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" selected disabled>
                    Pilih Kelas
                  </option>
                  {kelas?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
                {errors.kelasId && (
                  <p className="text-xs text-red-400">
                    {errors.kelasId.message.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-1 w-full">
                <label htmlFor="name" className="text-sm">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  id="alamat"
                  placeholder="Alamat"
                  {...register("alamat", {
                    required: {
                      value: true,
                      message: "Alamat harus diisi",
                    },
                  })}
                  className={`w-full p-2 border focus:outline-lamaPurple rounded-md ${
                    errors.alamat ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.alamat && (
                  <p className="text-xs text-red-400">
                    {errors.alamat.message.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-lamaPurple text-white text-xs font-semibold"
              >
                Simpan
              </button>
              <Link
                href={"/list/siswa"}
                className="py-2 px-4 rounded-md bg-gray-400 text-white text-xs font-semibold"
              >
                Kembali
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSiswaView;
