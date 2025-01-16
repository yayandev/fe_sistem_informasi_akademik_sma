"use client";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useRouter } from "next/navigation";

const EditManyAbsenSiswaView = ({ id_kelas, tanggal }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState(null);
  const { user, token }: any = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const fetchData = async () => {
    try {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/get_absensi_by_id_kelas_and_date`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ kelas_id: id_kelas, tanggal }),
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData.data);
          setLoading(false);
        } else {
          console.log(`Error ${response.status}: ${response.statusText}`);
          setSuccess(false);
          setMessage("Gagal mengambil data absensi.");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user, token, id_kelas, tanggal]);

  const handleSelectAll = (status: string) => {
    data?.absensiSiswa.forEach((item: any) => {
      const radioInput: any = document.querySelector(
        `input[name="${item.id}"][value="${status}"]`
      );
      if (radioInput) {
        radioInput.checked = true;
      }
    });
  };

  const generateAbsensiData = () => {
    const absensiData = data?.absensiSiswa?.map((item: any) => {
      const absensiRadio: any = document.querySelector(
        `input[name="${item.id}"]:checked`
      );
      const status = absensiRadio ? absensiRadio.value : "alpa";
      const keterangan = "";
      return {
        siswaId: item.siswaId,
        status: status,
        keterangan: keterangan,
        tanggal: item.tanggal,
        kelasId: item.kelasId,
        id: item.id,
      };
    });

    return { dataJson: absensiData };
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const absensiData = generateAbsensiData();
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/update_many`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(absensiData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess(data.success);
        setMessage(data.message);
        router.push("/absen_siswa");
      } else {
        setSuccess(false);
        setMessage("Gagal menyimpan absensi siswa. Kesalahan server.");
      }
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
      <h1 className="text-xl font-semibold">Edit Absen Siswa</h1>
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
      {user && user?.siswa.id === user?.siswa.kelas.ketuaKelasId ? (
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
                  <td className="text-start">{data?.absensiSiswa?.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3 items-center mt-3 flex-wrap">
            <button
              type="button"
              onClick={() => handleSelectAll("hadir")}
              className="py-2 px-4 bg-green-400 text-white rounded-md text-xs md:text-sm"
            >
              Pilih Hadir Semua
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll("izin")}
              className="py-2 px-4 bg-yellow-400 text-white rounded-md text-xs md:text-sm"
            >
              Pilih Izin Semua
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll("alpa")}
              className="py-2 px-4 bg-red-400 text-white rounded-md text-xs md:text-sm"
            >
              Pilih Alpa Semua
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll("sakit")}
              className="py-2 px-4 bg-blue-400 text-white rounded-md text-xs md:text-sm"
            >
              Pilih Sakit Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border border-gray-200 overflow-x-auto box-border whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="border border-gray-200 p-2 text-start">No</th>
                  <th className="border border-gray-200 p-2 text-start">NIS</th>
                  <th className="border border-gray-200 p-2 text-start">
                    Nama
                  </th>
                  <th className="border border-gray-200 p-2">Hadir</th>
                  <th className="border border-gray-200 p-2">Izin</th>
                  <th className="border border-gray-200 p-2">Alpa</th>
                  <th className="border border-gray-200 p-2">Sakit</th>
                </tr>
              </thead>
              <tbody>
                {data?.absensiSiswa?.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
                  >
                    <td className="border border-gray-200 p-2 text-start">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 p-2 text-start">
                      {item.siswa.nis}
                    </td>
                    <td className="border border-gray-200 p-2 text-start">
                      {item.siswa.nama}
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="hadir"
                        defaultChecked={item.status === "hadir" ? true : false}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="izin"
                        defaultChecked={item.status === "izin" ? true : false}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="alpa"
                        defaultChecked={item.status === "alpa" ? true : false}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="sakit"
                        defaultChecked={item.status === "sakit" ? true : false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            <div className="space-y-3 text-center">
              <h3 className="text-center font-semibold text-red-500">
                Kamu Bukan Ketua Kelas!
              </h3>
              <p className="text-center text-gray-500 text-xs">
                Hubungi Ketua Kelas Untuk Melakukan Absensi!
              </p>
              <Link
                href={"/dashboard"}
                className="py-2 px-4 bg-lamaSky text-white rounded-md inline-block"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditManyAbsenSiswaView;
